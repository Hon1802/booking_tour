'use strict'
import { Entity, ObjectIdColumn, ObjectId, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { IsEmail, IsNotEmpty, MaxLength, IsOptional, IsInt, Min, Max, IsDate, IsString, Matches, MinLength} from 'class-validator';
import { Transform } from 'class-transformer';


@Entity()
export class Hotels {
  @ObjectIdColumn()
  public id: ObjectId | undefined;

  @Column({ type: 'varchar', length: 500, name: 'hotelName' })
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(500, { message: 'Name cannot be longer than 500 characters' })
  public hotelName!: string;


  @Column({ type: 'text', nullable: true })
  @IsString()
  @IsOptional()
  public address!: string;

  @Column({ type: 'text', nullable: true })
  @IsString()
  @IsOptional()
  public location!: string;

  @Column({ type: 'number', name: 'starRating', default: 1 })
  @IsInt()
  @Min(0)
  @Max(10)
  public starRating!: number;

  @Column({ type: 'text', nullable: true })
  @IsString()
  @IsOptional()
  public description!: string;

  @Column({ type: 'number', name: 'pricePerNight', default: 1 })
  @IsInt()
  public pricePerNight!: number;

  @Column({ type: 'tinyint', name: 'delFlg', default: 0 })
  @IsInt()
  @Min(0, { message: 'delFlg must not be less than 0' })
  @Max(1, { message: 'delFlg must not be greater than 1' })
  public delFlg!: number;
  

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
