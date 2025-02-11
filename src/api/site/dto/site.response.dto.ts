import { SiteEntity } from "../entities/site.entity";

export class SiteResponseDto {
  
  constructor(id: string, name: string, url: string, description: string, imageUrl: string) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.description = description;
    this.image_url = imageUrl;
  }

  id?: string;

  name: string;

  url: string;

  description?: string;

  image_url?: string;   

  category: string;    

  request_id?: string;    

  static fromEntity(entity: SiteEntity) {
    return new SiteResponseDto(entity.id, entity.site_name, entity.site_url, entity.site_description, entity.site_image_url);
  }
}