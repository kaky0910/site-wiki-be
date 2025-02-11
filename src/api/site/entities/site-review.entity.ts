import { UserEntity } from "src/api/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({
  name: 'site_review'
})
export class SiteReviewEntity {

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({
    comment: '사이트 ID'
  })
  site_id: string;

  @Column({
    comment: '평점'
  })
  review_score: number;

  @Column({
    comment: '리뷰내용',
  })
  review_comment: string;

  @Column({
    comment: '리뷰일시',
  })
  review_date: Date;

  @Column({
    comment: '유저 ID'
  })
  @ManyToOne(() => UserEntity, user => user.id)
  writer_id: string;

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
}