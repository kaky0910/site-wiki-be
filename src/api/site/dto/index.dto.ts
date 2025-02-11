import { IsOptional, IsString } from "class-validator";

export class IndexDto {
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  name: string;

}