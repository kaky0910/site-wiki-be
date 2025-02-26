import { Body, Controller, Delete, Get, Ip, Param, Post, Put, Query, Req } from '@nestjs/common';
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

  @Get()
  async getSiteList(@Req() req) {
    // console.log(req);
    return this.siteService.getSiteList();
  }

  @Get('/search')
  async getSiteListByKeyword(@Query("keyword") keyword: string) {
    console.log(keyword);
    return this.siteService.getSiteListByKeword(keyword);
  }

  @Post()
  async insertSite(@Body() site: SiteDto) {
    return this.siteService.insertSite(site);
  }

  @Post('/click')
  async addClickCount(@Body() site: SiteDto, @Ip() ipString: string) {
    const ip = ipString.split(':')[ipString.split(':').length - 1];
    return this.siteService.addClickCount(ip,site.id);
  }

  /**
   * Create site index
   * @returns string
   */
  @Post('/createSiteIndex')
  async createSiteIndex() {
    return this.indexService.createSiteIndex();
  }

  @Post('/createSiteDocument')
  async createSiteDocument(@Body() site: SiteDto) {
    return this.indexService.createSiteDocument(site);
  }

  @Put('/modifySiteIndex')
  async modifySiteIndex(@Body() mappingInfo: any) {
    return this.indexService.modifySiteIndex(mappingInfo);
  }

  @Put('/modifySiteDocument')
  async modifySiteDocument(@Body() site: SiteDto) {
    return this.indexService.modifySiteDocument(site);
  }

  @Delete('/deleteIndex')
  async deleteIndex(@Body() index: IndexDto) {
    return this.indexService.deleteIndex(index.name);
  }

  @Delete('/DeleteSiteDocument')
  async DeleteSiteDocument(@Body() site: SiteDto) {
    return this.indexService.deleteSiteDocument(site);
  }
}
