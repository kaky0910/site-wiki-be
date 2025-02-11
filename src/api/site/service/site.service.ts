import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SiteDto } from '../dto/site.dto';
import { RequestDto } from '../dto/request.dto';
import axios from 'axios';
import { SiteRepository } from '../repository/site.repository';
import { Like } from 'typeorm';
import { SiteEntity } from '../entities/site.entity';
import { IndexService } from './index.service';
import { SiteCategoryRepository } from '../repository/category.repository';
import { SiteCategoryResponseDto } from '../dto/category.response.dto';

@Injectable()
export class SiteService {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly siteRepository: SiteRepository,
    private readonly siteCategoryRespository: SiteCategoryRepository,
    private readonly indexService: IndexService,
  ) {}

  async getSiteList() {
    const categoryList = await this.siteCategoryRespository.findBy({
      use_yn: true
    });

    // console.log(categoryList);
    const result = categoryList.map(e => SiteCategoryResponseDto.fromEntity(e)).sort((a,b) => a.order - b.order);

    // console.log(result)

    return result;
  }

  async insertSite(siteDto: SiteDto) {


    // siteDto.url 에서 도메인 추출
    const url = new URL(siteDto.url);

    // check url exists
    const site = await this.siteRepository.findOneBy({
      site_url: Like(`${url.origin}%`)
    });

    const siteCategory = await this.siteCategoryRespository.findOneBy({
      category_code: siteDto.category
    });

    if (site) {
      return site;
    }

    const entity = new SiteEntity();
    entity.site_url = siteDto.url;
    entity.site_name = siteDto.name;
    entity.site_description = siteDto.description;
    entity.site_image_url = siteDto.image_url;
    if (siteDto.request_id) entity.request_id = siteDto.request_id;
    entity.use_yn = true;
    entity.site_category = siteCategory;

    const result = await this.siteRepository.save(entity);

    return result;
  }

  async addClickCount(siteId: string) {

    
  }

  async addLikeCount(requestId: string) {
    var result = await this.elasticsearchService.update({
      index: 'request_site',
      id: requestId,
      body: {
        script: {
          source: 'ctx._source.like += 1',
        },
      },
    });

    console.log(result);
    return result;
  }

  
  async temp() {

    const siteList = await this.siteRepository.findBy({
      use_yn: true
    });

    for(const site of siteList) {
      console.log(site);
      const result = await this.indexService.createSiteDocument({
        id: site.id,
        site_id: site.id,
        name: site.site_name,
        url: site.site_url,
        description: site.site_description,
        image_url: site.site_image_url,
        tags: site.siteRequest.metadata.tags,
        category: site.site_category.category_code
      });
      
      console.log(result);
    }
    
  }

  getDateString(): string {
    const date = new Date();
    date.setHours(date.getHours() + 9);
    const formattedDate = date.toISOString().split('T')[0];

    return formattedDate;
  }
}
