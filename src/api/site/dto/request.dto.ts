import { IsNumber, IsOptional, IsString } from "class-validator";

export class RequestDto {
  constructor(id: string, name: string, url: string, description: string, category: string, like: number, verifyResult: string) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.description = description;
    this.category = category;
    this.like = like;
    this.verifyResult = verifyResult;
  }

  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  url: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  category: string;    

  @IsNumber()
  @IsOptional()
  like: number;

  @IsString()
  @IsOptional()
  verifyResult: string;

}