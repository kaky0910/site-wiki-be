import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SiteCategoryEntity } from "../entities/category.entity";

@Injectable()
export class SiteCategoryRepository extends Repository<SiteCategoryEntity> {
  constructor(
    @InjectRepository(SiteCategoryEntity)
    private readonly repository: Repository<SiteCategoryEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}