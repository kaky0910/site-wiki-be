import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SiteRequestEntity } from "./site-request.entity";
import { SiteCategoryEntity } from "./category.entity";


@Entity({
  name: 'site'
})
export class SiteEntity {

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({
    comment: '사이트 id, request 가 승인되는 경우 id field에 request의 id 저장',
    nullable: true
  })
  request_id: string;

  @Column({
    comment: '사이트명'
  })
  site_name: string;

  @Column({
    comment: '사이트 url'
  })
  site_url: string;

  @Column({
    comment: '사이트 설명',
    nullable: true
  })
  site_description: string;

  @Column({
    comment: '사이트 이미지 url',
    nullable: true
  })
  site_image_url: string;

  @Column({
    type: 'boolean',
    default: true,
    comment: '사용여부'
  })
  use_yn?: boolean;

  @Column({
    type: 'boolean',
    default: false,
    comment: '메인여부'
  })
  main_yn?: boolean;

  @Column({
    comment: '사이트 정렬 순서',
    default: 1
  })
  order: number;

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

  @OneToOne(() => SiteRequestEntity, {eager: true})
  @JoinColumn(
    { name: 'request_id', referencedColumnName: 'id' }
  )
  siteRequest: SiteRequestEntity;

  @ManyToOne(() => SiteCategoryEntity, )
  @JoinColumn(
    { name: 'category_id', referencedColumnName: 'id' }
  )
  site_category: SiteCategoryEntity;
}