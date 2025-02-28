import { BadRequestException, Injectable } from '@nestjs/common';
import { SiteDto } from '../dto/site.dto';
import { RequestDto } from '../dto/request.dto';
import axios, { AxiosResponse } from 'axios';
import { Like } from 'typeorm';
import { SiteEntity } from '../entities/site.entity';
import { SiteRequestRepository } from '../repository/site-request.repository';
import { SiteRequestEntity } from '../entities/site-request.entity';
import { ConfigService } from '@nestjs/config';
import { SiteService } from './site.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { IndexService } from './index.service';
import { SiteCategoryRepository } from '../repository/category.repository';
import { isArray } from 'class-validator';

@Injectable()
export class RequestService {
  constructor(
    private readonly siteRequestRepository: SiteRequestRepository,
    private readonly configService: ConfigService,
    private readonly siteService: SiteService,
    private readonly indexService: IndexService,

  ) {}

  async getRequestList() {
    const result = await this.siteRequestRepository.findBy({
      use_yn: true,
    })

    return result;
  }

  async getRequestListToBeVerify() {
    const result = await this.siteRequestRepository.findBy({
      use_yn: true,
      request_status: 'init',
      request_url: Like('https%')
    })

    return result;
  }

  async insertRequests(requests: RequestDto[]) {

    for (const request of requests) {
      await this.insertRequest(request);
    }
  }

  async insertRequest(requestDto: RequestDto) {


    if (requestDto.url && requestDto.url.startsWith('http://')) {
      throw new BadRequestException({
        success: false,
        message: 'Invalid URL',
      });
    }
    // requestDto.url 에서 도메인 추출
    const url = new URL(requestDto.url);

    // check url exists
    const request = await this.siteRequestRepository.findOneBy({
      request_url: Like(`${url.origin}${url.pathname}%`)
    });

    if (request && request.use_yn) {
      throw new BadRequestException({
        success: false,
        message: 'Request already exists',
      });
    }

    const entity = new SiteRequestEntity();
    entity.request_url = requestDto.url;
    entity.request_status = 'init';
    entity.request_name = requestDto.name;
    entity.request_verify_result = 'init';
    entity.request_category = requestDto.category;
    entity.use_yn = true;

    const result = await this.siteRequestRepository.save(entity);

    return result;
  }

  async updateRequestStatus(id: string, status: string, verifyResult?: string) {
    const request = await this.siteRequestRepository.findOneBy({
      id: id
    });

    if (!request) {
      return 'request not found';
    }

    request.request_status = status;
    if (verifyResult) request.request_verify_result = verifyResult;

    const result = await this.siteRequestRepository.save(request);

    return result;
  }

  async verifyRequest(id: string, metadata: any) {
    const request = await this.siteRequestRepository.findOneBy({
      id: id
    });

    if (!request) {
      return 'request not found';
    }

    // get metadata from GEMINI API
    const generatedMetadata = await this.callGeminiApiMakingMetadata(metadata, request);
    console.log('metadata : ',generatedMetadata);

    // request update 
    request.metadata = isArray(generatedMetadata) ? generatedMetadata[0] : generatedMetadata;
    request.request_status = 'verified';
    request.request_verify_result = 'verified';
    request.request_name = generatedMetadata.title;

    await this.siteRequestRepository.save(request);
    console.log('request update');

    // site insert
    var siteEntity = await this.siteService.insertSite({
      url: request.request_url,
      name: request.request_name,
      description: generatedMetadata.description,
      image_url: generatedMetadata.thumbnail_image_url,
      category: generatedMetadata.category,
      request_id: request.id
    });

    // elastic search insert
    const result = await this.indexService.createSiteDocument({
      site_id: siteEntity.id,
      name: request.request_name,
      url: request.request_url,
      description: generatedMetadata.description,
      image_url: generatedMetadata.thumbnail_image_url,
      category: generatedMetadata.category,
      tags: generatedMetadata.tags
    });

    request.request_status = 'completed';
    await this.siteRequestRepository.save(request);
    console.log('site insert')
  }

  async callGeminiApiMakingMetadata(metadata: any, request: SiteRequestEntity) {
    const genAI = new GoogleGenerativeAI(this.configService.get<string>('GEMINI_APIKEY'));
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([`${this.configService.get<string>('GEMINI_METADATA_PROMPT')}${JSON.stringify(metadata)} site정보 : ${JSON.stringify(request)}`]);
    console.log(result.response.text());
    return JSON.parse(result.response.text().replace('```json', '').replace('```', '').trim());
  }

  getDateString(): string {
    const date = new Date();
    date.setHours(date.getHours() + 9);
    const formattedDate = date.toISOString().split('T')[0];

    return formattedDate;
  }
}
