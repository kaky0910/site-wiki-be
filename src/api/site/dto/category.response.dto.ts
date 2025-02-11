import { SiteCategoryEntity } from "../entities/category.entity";
import { SiteEntity } from "../entities/site.entity";
import { SiteResponseDto } from "./site.response.dto";

export class SiteCategoryResponseDto {
  constructor(category_name: string) {
    this.category_name = category_name;
    this.sites = [];    
  }
  category_name: string;

  order: number;

  sites: SiteResponseDto[];

  addSite(site: SiteResponseDto) {
    this.sites.push(site);
  }

  static fromEntity(entity: SiteCategoryEntity) {
    const category = new SiteCategoryResponseDto(entity.category_name);
    category.order = entity.order
    entity.sites.forEach(site => {
      category.addSite(SiteResponseDto.fromEntity(site));
    });
    return category
  }
}