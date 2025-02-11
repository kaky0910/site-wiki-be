import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SiteRequestEntity } from "./site-request.entity";
import { SiteEntity } from "./site.entity";
import { join } from "path";


@Entity({
  name: 'category'
})
export class SiteCategoryEntity {

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({
    comment: '카테고리명',
  })
  category_name: string;

  @Column({
    comment: '카테고리 코드'
  })
  category_code: string;

  @Column({
    comment: '카테고리 순서'
  })
  order: number;

  @Column({
    type: 'boolean',
    default: true,
    comment: '사용여부'
  })
  use_yn?: boolean;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP(6)',
    comment: '생성일시'
  })
  public created_at?: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP(6)',
    comment: '수정일시'
  })
  public updated_at?: Date;

  @OneToMany(() => SiteEntity, site => site.site_category, {eager: true})
  sites: SiteEntity[];
}