import { BadRequestException, Body, Controller, Delete, Get, Ip, Param, Post, Put, Query, Req } from '@nestjs/common';
import { SiteService } from './service/site.service';
import { SiteDto } from './dto/site.dto';
import { IndexDto } from './dto/index.dto';
import { IndexService } from './service/index.service';
import { RequestService } from './service/request.service';
import { RequestDto } from './dto/request.dto';

@Controller('/site')
export class SiteController {
  constructor(
    private readonly siteService: SiteService,
    private readonly indexService: IndexService,
    private readonly requestService: RequestService
  ) {}

  /**
   * Get all sites list
   * @param req Express request object
   * @returns List of all sites categorized
   */
  @Get()
  async getSiteList(@Req() req) {
    // console.log(req);
    return this.siteService.getSiteList();
  }

  /**
   * Get main site information
   * @returns List of main sites that are featured
   */
  @Get('/main')
  async getMainSite() {
    return this.siteService.getMainSiteList();
  }

  /**
   * Search sites by keyword
   * @param keyword Search term to find sites
   * @returns List of sites matching the keyword
   * @throws BadRequestException if keyword is less than 2 characters
   */
  @Get('/search')
  async getSiteListByKeyword(@Query("keyword") keyword: string) {
    if (!keyword || keyword.length < 2) {
      throw new BadRequestException({
        success: false,
        message: '검색어는 2글자 이상 입력해주세요.',
      });
    }

    return this.siteService.getSiteListByKeword(keyword);
  }

  /**
   * Create a new site
   * @param site Site data to insert
   * @returns The created site entity
   */
  @Post()
  async insertSite(@Body() site: SiteDto) {
    return this.siteService.insertSite(site);
  }

  /**
   * Increment click counter for a site
   * @param site Site data containing ID of the clicked site
   * @param ipString IP address of the user
   * @returns Result of the click count update operation
   */
  @Post('/click')
  async addClickCount(@Body() site: SiteDto, @Ip() ipString: string) {
    const ip = ipString.split(':')[ipString.split(':').length - 1];
    return this.siteService.addClickCount(ip,site.id);
  }

  /**
   * Create Elasticsearch index for sites
   * @returns Result of index creation
   */
  @Post('/createSiteIndex')
  async createSiteIndex() {
    return this.indexService.createSiteIndex();
  }

  /**
   * Create Elasticsearch document for a site
   * @param site Site data to index
   * @returns Result of document creation
   */
  @Post('/createSiteDocument')
  async createSiteDocument(@Body() site: SiteDto) {
    return this.indexService.createSiteDocument(site);
  }

  /**
   * Update Elasticsearch index mapping
   * @param mappingInfo Updated mapping configuration
   * @returns Result of the index mapping update
   */
  @Put('/modifySiteIndex')
  async modifySiteIndex(@Body() mappingInfo: any) {
    return this.indexService.modifySiteIndex(mappingInfo);
  }

  /**
   * Update Elasticsearch document for a site
   * @param site Updated site data
   * @returns Result of the document update
   */
  @Put('/modifySiteDocument')
  async modifySiteDocument(@Body() site: SiteDto) {
    return this.indexService.modifySiteDocument(site);
  }

  /**
   * Delete Elasticsearch index
   * @param index Index information to delete
   * @returns Result of the index deletion
   */
  @Delete('/deleteIndex')
  async deleteIndex(@Body() index: IndexDto) {
    return this.indexService.deleteIndex(index.name);
  }

  /**
   * Delete Elasticsearch document for a site
   * @param site Site to remove from the index
   * @returns Result of the document deletion
   */
  @Delete('/DeleteSiteDocument')
  async DeleteSiteDocument(@Body() site: SiteDto) {
    return this.indexService.deleteSiteDocument(site);
  }
}
