import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosResponse } from "axios";
import { RedisClientType } from "redis";
import { SiteRequestEntity } from "../entities/site-request.entity";
import { RequestService } from "./request.service";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class VerifyUrlService {
  constructor(    
    @Inject('REDIS_CLIENT')
    private readonly redisClient: RedisClientType,
    private readonly configService: ConfigService,
    private readonly requestService: RequestService
  ) {}

  @Cron('0 0,10,20,30,40,50 * * * *')
  async verifyRequest(requestParam: SiteRequestEntity[]) {
    console.log('verifyRequest start at ', new Date());

    // get request list which status = init & use_yn = true
    const requestList = requestParam || await this.requestService.getRequestListToBeVerify();
    console.log('requestList length ', requestList.length);
    if (requestList.length === 0) { return }

    // check Google Safe Browsing API
    var GSBResult = await axios.post(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${this.configService.get<string>('GOOGLE_SAFE_BROWSING_APIKEY')}`, {
      client: {
        clientId: 'site_zip',
        clientVersion: '1.5.2',
      },
      threatInfo: {
        threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: requestList.map((request) => {
          return { url: request.request_url };
        }),
      },
    });

    // if matches exist, update request status to detected and request_verify_result to 'malware' or 'social engineering'
    if (GSBResult.data.matches?.length > 0) {
      await Promise.all(GSBResult.data.matches.map(async (match) => {
        const request = requestList.find((request) => {
          return match.threat.url === request.request_url;
        });
        await this.requestService.updateRequestStatus(request.id, 'detected', match.threatType);
      }))
    }

    // only check the request that is not detected by GSB
    const filteredRequestList = requestList.filter((request) => {
      if (GSBResult.data.matches) {
        return !GSBResult.data.matches.some((match) => {
          return match.threat.url === request.request_url;
        });
      } else {
        return true
      }
    })

    // check virus total API
    await Promise.all(filteredRequestList.map(async (request) => {
      const encodedParams = new URLSearchParams();
      encodedParams.set('url', request.request_url);

      const options = {
        method: 'POST',
        url: 'https://www.virustotal.com/api/v3/urls',
        headers: {
          accept: 'application/json',
          'x-apikey': this.configService.get<string>('VIRUS_TOTAL_APIKEY'),
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: encodedParams,
      };
      return axios.request(options).then(async (response) => {
        if (response.status === 200) {
          // console.log('response.data', response.data);
          // push on report queue
          await this.redisClient.LPUSH('verify-url-queue', JSON.stringify({
            id: response.data.data.id.split('-')[1],
            request_id: request.id
          }));
          // update request status to 'verifying'
          await this.requestService.updateRequestStatus(request.id, 'verifying');
        }
      });
    }));
  }

  // redis queue에서 id를 가져와 virustotal api를 이용하여 url을 검증하는 기능 (get url report)
  @Cron('0 5,15,25,35,45,55 * * * *')
  async checkVTReport(checkcount: number) {
    checkcount = checkcount || 5;
    console.log('checkVTReport start at', new Date());

    const length = await this.redisClient.LLEN('verify-url-queue');
    console.log('verify-url-queue length ', length);

    if (length === 0) { return }

    for (let i = 0; i < checkcount; i++) {
      try {
        const redisData = JSON.parse(await this.redisClient.RPOP('verify-url-queue'));
        if (!redisData || !redisData.id) { continue; }
        
        const { id, request_id } = redisData;
        if (!id) {
          continue;
        }
        const response: AxiosResponse = await axios.get(`https://www.virustotal.com/api/v3/urls/${id}`, {
          headers: {
            'x-apikey': this.configService.get<string>('VIRUS_TOTAL_APIKEY'),
            Accept: 'application/json',
            "Content-Type": "content-type: application/x-www-form-urlencoded"
          }
        });
  
        if (response.status === 200) {
          if (response.data.data.attributes.last_analysis_stats.malicious > 0) {
            await this.requestService.updateRequestStatus(request_id, 'detected', `malware:${response.data.data.attributes.last_analysis_stats.malicious}`);
          } else {
            await this.requestService.verifyRequest(request_id, response.data.data.attributes.html_meta);
          }
        }
      } 
      // catch json parsing error
      catch (error) {
        console.error(error);
      }
      
    }
  }
}