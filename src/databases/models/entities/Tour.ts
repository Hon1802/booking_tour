'use strict'
import { Entity, ObjectIdColumn, ObjectId, Column, BeforeInsert, BeforeUpdate, BeforeRemove } from 'typeorm';
import { IsNotEmpty, MaxLength, IsOptional, IsInt, Min, Max, IsDate, IsString, Matches, MinLength, IsNumber} from 'class-validator';
import { Transform } from 'class-transformer';


@Entity()
export class Tour {
  @ObjectIdColumn()
  public id: ObjectId | undefined;
  
  // name of tour 
  @Column({ type: 'varchar', length: 50, name: 'name' })
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(50, { message: 'Name cannot be longer than 50 characters' })
  public name!: string;

  // description of tour
  @Column({ type: 'varchar', name: 'description' })
  @IsNotEmpty({ message: 'Description is required' })
  @MinLength(8, { message: 'Description must be at least 10 characters long' })
  // @MaxLength(500, {message: 'Description cannot be longer than 500 characters long' })
  public description!: string;
  
  // how long ?
  @Column({ type: 'varchar', length: 50, name: 'duration' })
  @IsNotEmpty({ message: 'Duration is required' })
  @MaxLength(50, { message: 'Duration cannot be longer than 50 characters' })
  public duration!: string;

  // where
  @Column({ type: 'varchar' , name: 'location' })
  @IsNotEmpty({ message: 'Location is required' })
  // @MaxLength(150, { message: 'Location cannot be longer than 150 characters' })
  public location!: string;

  // 
  @Column({ type: 'varchar' , name: 'regulation' })
  @IsNotEmpty({ message: 'Regulation is required' })
  // @MaxLength(250, { message: 'Regulation cannot be longer than 250 characters' })
  public regulation!: string;

  // 
  @Column({ type: 'number' , name: 'buySlot' })
  public buySlot!: number;
  
  // limit
  @Column({ type: 'number' , name: 'limit' })
  public limit!: number;
  
  // limit
  @Column({ type: 'tinyint' , name: 'isApprove' })
  public isApprove!: number | boolean;

  // exactly address
  @Column({ type: 'varchar' , name: 'address' })
  @IsNotEmpty({ message: 'Address is required' })
  
  // @MaxLength(250, { message: 'Address cannot be longer than 250 characters' })
  public address!: string;

  // exactly transportationId
  @Column({ type: 'varchar' , name: 'transportationId' })
  // @MaxLength(250, { message: 'Address cannot be longer than 250 characters' })
  public transportationId !: string;
  
  // estimatedTime
  @Column({ type: 'date',name: 'estimatedTime' })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => value || null)
  public estimatedTime!: Date;
  
  // closeOrderTime
  @Column({ type: 'date',name: 'closeOrderTime' })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => value || null)
  public closeOrderTime!: Date;

  // exactly hotelId
  @Column({ type: 'varchar' , name: 'hotelId' })
  // @MaxLength(250, { message: 'Address cannot be longer than 250 characters' })
  public hotelId !: string;
    
  // price adult
  @Column({ type: 'string', name: 'priceAdult' })
  @IsNotEmpty({ message: 'Price adult is required' })
  public priceAdult!: string;

  // price child
  @Column({ type: 'double', name: 'priceChild' })
  @IsNotEmpty({ message: 'Price children is required' })
  public priceChild!: number;

  // Add the images field (array of objects with urlImage as a string)
  @Column({ type: 'json', name: 'images' })
  public images!: { urlImage: string }[];

  // Add the plan field (array of objects with day, time, description)
  @Column({ type: 'json', name: 'plan' })
  public plan!: { day: string; time: string; description: string }[];

  // phone contact
  @Column({ type: 'varchar', length: 20, nullable: true })
  @IsString()
  @IsOptional()
  public phone!: string;
  
  // begin
  @Column({ type: 'date', nullable: true, name: 'start_day' })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => value || null)
  public startDay!: Date;

  // end
  @Column({ type: 'date', nullable: true, name: 'end_day' })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => value || null)
  public endDay!: Date;

  @Column({ type: 'tinyint', name: 'delFlg' })
  @IsInt()
  @Min(0)
  @Max(1)
  public delFlg: number = 0;
  
  // 
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

  // auto
  @BeforeInsert()
  private beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // auto
  @BeforeUpdate()
  private beforeUpdate() {
    this.updatedAt = new Date();
  }

  // auto
  @BeforeRemove()
  private beforeRemove(){
    this.deletedAt = new Date();    
  }
}
