import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({
  name: 'user'
})
export class UserEntity {

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({
    comment: '유저명'
  })
  user_name: string;

  @Column({
    comment: '유저 nickname'
  })
  user_nickname: string;

  @Column({
    comment: 'email address',
    unique: true
  })
  user_email: string;

  @Column({
    comment: '유저 권한',
    default: 'user'
  })
  user_auth: string;

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