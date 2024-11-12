'use strict';
import { Entity, ObjectIdColumn, ObjectId, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { IsInt, IsOptional, IsDate, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

@Entity()
export abstract class BaseEntity {
  @ObjectIdColumn()
  public id: ObjectId | undefined;

  @Column({ type: 'bigint', nullable: true, name: 'created_by' })
  @IsInt()
  @IsOptional()
  public createdBy!: number;

  @Column({ type: 'datetime', nullable: true, name: 'created_at' })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => value || null)
  public createdAt!: Date;

  @Column({ type: 'bigint', nullable: true, name: 'updated_by' })
  @IsInt()
  @IsOptional()
  public updatedBy!: number;

  @Column({ type: 'datetime', nullable: true, name: 'updated_at' })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => value || null)
  public updatedAt!: Date;

  @Column({ type: 'bigint', nullable: true, name: 'deleted_by' })
  @IsInt()
  @IsOptional()
  public deletedBy!: number;

  @Column({ type: 'datetime', nullable: true, name: 'deleted_at' })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => value || null)
  public deletedAt!: Date;

  @Column({ type: 'tinyint', name: 'delFlg', default: 0 })
  @IsInt()
  @Min(0, { message: 'delFlg must not be less than 0' })
  @Max(1, { message: 'delFlg must not be greater than 1' })
  public delFlg!: number;

  @BeforeInsert()
  private beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
    if (this.delFlg === undefined) {
      this.delFlg = 0;
    }
  }

  @BeforeUpdate()
  private beforeUpdate() {
    this.updatedAt = new Date();
  }
}
