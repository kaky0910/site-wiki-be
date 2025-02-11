import { IsNumber, IsOptional, IsString } from "class-validator";

export class SiteDto {
  constructor(id: string, site_id: string, name: string, url: string, description: string, imageUrl: string, category: string, tags: string[]) {
    this.id = id;
    this.site_id = site_id;
    this.name = name;
    this.url = url;
    this.description = description;
    this.image_url = imageUrl;
    this.category = category;
    this.tags = tags;
  }

  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  site_id?: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  url: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image_url?: string;   
  
  @IsString()
  @IsOptional()
  category: string;    

  @IsString()
  @IsOptional()
  request_id?: string;    

  @IsOptional()
  tags?: string[];    
}