import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SiteDto } from '../dto/site.dto';
import { RequestDto } from '../dto/request.dto';
import axios from 'axios';

@Injectable()
export class IndexService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async createSiteIndex() {
    var result = await this.elasticsearchService.indices.create({
      index: 'site_info',
      body: {
        settings: {
          analysis: {
            tokenizer: {
              edge_ngram_tokenizer: {
                type: "edge_ngram",
                min_gram: 2,
                max_gram: 20,
                token_chars: ["letter"]
              }
            },
            analyzer: {
              custom_analyzer: {
                type: "custom",
                tokenizer: "edge_ngram_tokenizer"
              }
            }
          }
        },
        mappings: {
          properties: {
            name: { type: 'text' },
            url: { type: 'text' },
            image_url: { type: 'text' },
            description: { type: 'text' },
            category: { type: 'text'},
            site_id: { type: 'text' },
            tags: { 
              type: "text",
              fields: {
                keyword: {
                  type: "keyword"
                },
                autocomplete: {
                  type: "text",
                  analyzer: "custom_analyzer"
                }
              }
            },
          },
        },
      },
    });
    
    console.log(result.index);
    return result;
  }

  async deleteIndex(index: string) {
    console.log(index);
    var result = await this.elasticsearchService.indices.delete({
      index: index,
    });

    console.log(result);
    return result;
  }

  async modifySiteIndex(mappingInfo: any) {
    console.log(mappingInfo)
    var result = await this.elasticsearchService.indices.putMapping({
      index: 'site_info',
      body: {
        properties: mappingInfo,
      },
    });

    console.log(result);
    return result;
  }

  async createSiteDocument(site: SiteDto) {

    var searchResult = await this.elasticsearchService.search({
      index: 'site_info',
      body: {
        query: {
          bool: {
            should: [
              {
                match: {
                  site_id: site.site_id,  
                },
              }
            ],
          },
        },
      },
    });

    // console.log(searchResult.hits);
    if ((searchResult.hits.total as any).value > 0) {
      console.log('Site already exists');
      return;
    }

    var result = await this.elasticsearchService.index({
      index: 'site_info',
      document:site
    });
    // console.log(result.result);

    return result;
  }

  async modifySiteDocument(site: SiteDto) {
    var result = await this.elasticsearchService.update({
      index: 'site_info',
      id: site.id,
      body: {
        doc: site,
      },
    });

    console.log(result);
    return result;
  }

  async deleteSiteDocument(site: SiteDto) {
    var result = await this.elasticsearchService.delete({
      index: 'site_info',
      id: site.id,
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
