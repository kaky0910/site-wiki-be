import { Inject, Injectable } from '@nestjs/common';
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
import { SiteResponseDto } from '../dto/site.response.dto';
import { RedisService } from 'src/common/provider/redis/redis.service';
import { RedisClientType } from 'redis';

@Injectable()
export class SiteService {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly siteRepository: SiteRepository,
    private readonly siteCategoryRespository: SiteCategoryRepository,
    private readonly indexService: IndexService,
    @Inject('REDIS_CLIENT')
    private readonly redisClient: RedisClientType
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

  async getSiteListByKeword(keyword: string) {
    const elasticResult = await this.elasticsearchService.search({
      index: 'site_info',
      body: {
        query: {
          bool: {
            should: [
              // 여러 필드를 한 번에 검색: 이름, 설명, 태그(자동완성)
              {
                multi_match: {
                  query: keyword,
                  fields: [
                    "name^2", // 이름에 가중치 부여
                    "description",
                    "tags.autocomplete"
                  ],
                  type: "best_fields",
                  operator: "and",
                  fuzziness: "AUTO"
                }
              },
              // 태그의 정확한 검색 (소문자로 변환하여 대소문자 구분 없이)
              {
                term: { "tags.keyword": keyword.toLowerCase() }
              },
              // 이름 필드의 부분 검색 (소문자로 변환)
              {
                wildcard: { 
                  "name": { 
                    value: `*${keyword.toLowerCase()}*`,
                    boost: 0.5  // 가중치 낮게 부여하여 다른 쿼리에 비해 덜 영향 주도록 함
                  } 
                }
              }
            ],
            minimum_should_match: 1
          }
        }
      }
    });
    

    const result = await this.siteRepository.findByIds(elasticResult.hits.hits.map((e: any) => e._source.site_id))

    return result.map(e => SiteResponseDto.fromEntity(e));
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

  async addClickCount(ip: string, siteId: string) {
    const ipKey = `ip-${ip}-click`;
    const siteClickStrengthKey = `click-score-${siteId}`;

    console.log(ipKey, siteId);
    // redis ip-{ipaddres}-click
    let exists = await this.redisClient.sIsMember(ipKey, siteId);
    let strength = 1;
    if (exists) {
      strength = 0.1;
    } else {
      await this.redisClient.sAdd(ipKey, siteId);
    }

    let score: number = Number.parseInt(await this.redisClient.get(siteClickStrengthKey) || '0');
    await this.redisClient.set(siteClickStrengthKey, score + strength);
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

  getDateString(): string {
    const date = new Date();
    date.setHours(date.getHours() + 9);
    const formattedDate = date.toISOString().split('T')[0];

    return formattedDate;
  }
}
