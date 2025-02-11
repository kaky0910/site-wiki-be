import { Module } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import axios from 'axios';
import { SiteRequestRepository } from 'src/api/site/repository/site-request.repository';
import { SiteRepository } from 'src/api/site/repository/site.repository';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly siteRepository: SiteRepository,
    private readonly siteRequestRepository: SiteRequestRepository,
  ) {}
  
  async verifyRequest(urlList: string[]) {
    // check url prefix https if don't exist, add https://
    

    // check Google Safe Browsing API
    var result = await axios.post('https://safebrowsing.googleapis.com/v4/threatMatches:find?key=', {
      client: {
        clientId: 'site_zip',
        clientVersion: '1.5.2',
      },
      threatInfo: {
        threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING'],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: urlList.map((url) => {
          return { url: url };
        }),
      },
    });

    // check http response status 200
  }

  getDateString(): string {
    const date = new Date();
    date.setHours(date.getHours() + 9);
    const formattedDate = date.toISOString().split('T')[0];

    return formattedDate;
  }

  
  async scheduledVerifyRequest() {
    // const requestList = await this.getRequestList();
    // await this.verifyRequest(requestList);

  }
}
