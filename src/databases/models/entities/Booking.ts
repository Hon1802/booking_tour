'use strict';
import { Entity, Column, BeforeUpdate, BeforeInsert } from 'typeorm';
import { IsNotEmpty, MaxLength, IsString, IsOptional, IsInt, Min, Max, IsEmail, IsNumber, IsEnum, ValidateNested, IsArray } from 'class-validator';

import { OrderStatus, PaymentStatus, Person } from './common';
import { Type } from 'class-transformer';
import { BaseEntity } from './Origin';
 
@Entity()
export class Bookings extends BaseEntity {
  @Column()
  @IsNotEmpty()
  public tourId!: string;

  @Column()
  @IsNotEmpty()
  public userId!: string;

  @Column()
  @IsOptional()
  public paymentId!: string;

  @Column()
  @IsEmail()
  public email!: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  public fullName!: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  public phone!: string;

  @Column('json')
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  public adults!: Person[];

  @Column('json')
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  public children!: Person[]; 

  @Column('float')
  @IsNumber()
  @Min(0)
  public depositAmount!: number;

  @Column('float')
  @IsNumber()
  @Min(0)
  public totalAmount!: number;

  @Column()
  @IsString()
  @IsOptional()
  public method!: string;

  @Column()
  @IsString()
  @IsOptional()
  public paymentAccount!: string;

  @Column()
  @IsString()
  @IsOptional()
  public payerName!: string;

  @Column()
  @IsEnum(OrderStatus)
  public orderStatus!: OrderStatus;

  @Column()
  @IsEnum(PaymentStatus)
  public paymentStatus!: PaymentStatus;

  @BeforeUpdate()
  private updateOrderStatus() {
    const threeHoursInMs = 3 * 60 * 60 * 1000; // 3 tiếng tính bằng mili giây
    if (
      this.updatedAt = new Date(),
      this.paymentStatus !== PaymentStatus.COMPLETED &&
      this.createdAt &&
      new Date().getTime() > this.createdAt.getTime() + threeHoursInMs
    ) {
      this.orderStatus = OrderStatus.CANCELLED;
    }
  }
}