import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({
  name: 'site_request'
})
export class SiteRequestEntity {

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({
    comment: '요청 사이트명'
  })
  request_name: string;

  @Column({
    comment: '요청 사이트 url'
  })
  request_url: string;

  @Column({
    comment: '요청 인증 결과',
  })
  request_verify_result: string;

  @Column({
    comment: '요청 사이트 이미지 url',
    nullable: true
  })
  request_image_url: string;

  @Column({
    comment: '요청 사이트 분류 category',
    nullable: true
  })
  request_category: string;

  @Column({
    comment: '요청 상태',
  })
  request_status: string;

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

  @Column({
    comment: '메타데이터',
    type: 'jsonb',
    nullable: true
  })
  public metadata?: any;
}