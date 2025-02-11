import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SiteEntity } from "../entities/site.entity";
import { Repository } from "typeorm";

@Injectable()
export class SiteRepository extends Repository<SiteEntity> {
  constructor(
    @InjectRepository(SiteEntity)
    private readonly repository: Repository<SiteEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}