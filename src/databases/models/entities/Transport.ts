'use strict'
import { Entity, ObjectIdColumn, ObjectId, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { IsEmail, IsNotEmpty, MaxLength, IsOptional, IsInt, Min, Max, IsDate, IsString, Matches, MinLength, IsEnum} from 'class-validator';
import { Transform } from 'class-transformer';

// Định nghĩa enum cho type
export enum TransportType {
  FLIGHT = 'FLIGHT',
  CAR = 'CAR',
}

@Entity()
export class Transport {
  @ObjectIdColumn()
  public id: ObjectId | undefined;

  @Column({ type: 'varchar', name: 'company' })
  @IsNotEmpty({ message: 'Company is required' })
  public company!: string;

  @Column({ type: 'varchar', name: 'departure' })
  @IsNotEmpty({ message: 'Departure is required' })
  public departure!: string;

  @Column({ type: 'varchar', name: 'destination' })
  @IsNotEmpty({ message: 'Destination is required' })
  public destination!: string;

  @Column({ type: 'number', name: 'price' })
  @IsNotEmpty({ message: 'Price is required' })
  public price!: number;

  // Thêm cột type với enum
  @Column({ type: 'enum', enum: TransportType, name: 'type' })
  @IsEnum(TransportType, { message: 'Type must be either FLIGHT or CAR' })
  @IsNotEmpty({ message: 'Type is required' })
  public type!: TransportType;

  @Column({ type: 'string', nullable: true, name: 'created_by' })
  @IsInt()
  @IsOptional()
  public createdBy!: string;

  @Column({ type: 'datetime', nullable: true, name: 'created_at' })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => value || null)
  public createdAt!: Date;

  @Column({ type: 'string', nullable: true, name: 'updated_by' })
  @IsInt()
  @IsOptional()
  public updatedBy!: string;

  @Column({ type: 'datetime', nullable: true, name: 'updated_at' })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => value || null)
  public updatedAt!: Date;

  @Column({ type: 'string', nullable: true, name: 'deleted_by' })
  @IsInt()
  @IsOptional()
  public deletedBy!: string;

  @Column({ type: 'datetime', nullable: true, name: 'deleted_at' })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => value || null)
  public deletedAt!: Date;

  @Column({ type: 'tinyint', name: 'delFlg', default: 0 })
  @IsInt()
  @Min(0)
  @Max(1)
  public delFlg!: number;


  @BeforeInsert()
  private beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  private beforeUpdate() {
    this.updatedAt = new Date();
  }
}
