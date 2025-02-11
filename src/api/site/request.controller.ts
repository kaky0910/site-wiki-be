import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { RequestService } from './service/request.service';
import { RequestDto } from './dto/request.dto';
import { VerifyUrlService } from './service/verify-url.service';

@Controller('/request')
export class RequestController {
  constructor(
    private readonly requestService: RequestService,
    private readonly verifyUrlService: VerifyUrlService
  ) {}

  @Post()
  async insertRequest(@Body() request: RequestDto) {
    return this.requestService.insertRequest(request);
  }

  @Post('/multiple')
  async insertRequests(@Body() requests: RequestDto[]) {
    return this.requestService.insertRequests(requests);
  }

  @Get('/verify')
  async get() {
    return this.verifyUrlService.verifyRequest(null);
  }

  @Get()
  async getRequestList() {
    return this.verifyUrlService.checkVTReport(2);
  }
}
