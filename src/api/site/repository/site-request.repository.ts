import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SiteRequestEntity } from "../entities/site-request.entity";

@Injectable()
export class SiteRequestRepository extends Repository<SiteRequestEntity> {
  constructor(
    @InjectRepository(SiteRequestEntity)
    private readonly repository: Repository<SiteRequestEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}