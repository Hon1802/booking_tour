'use strict';
import { 
  Entity, 
  Column, 
  BeforeUpdate, 
  BeforeInsert
} from 'typeorm';
import { 
  IsNotEmpty, 
  IsString, 
  IsOptional, 
  IsEmail, 
  IsNumber, 
  Min, 
  IsEnum 
} from 'class-validator';
import { BaseEntity } from './Origin';

export enum PaymentStatus {
  DEPOSIT_ADVANCE = 'DEPOSIT_ADVANCE', 
  COMPLETED = 'COMPLETED',           
}

@Entity()
export class Payments extends BaseEntity {
  @Column()
  @IsNotEmpty()
  @IsString()
  public bookingId!: string; // ID của booking, lấy từ API đặt tour

  @Column()
  @IsEnum(PaymentStatus)
  @IsNotEmpty()
  public status!: PaymentStatus; // Trạng thái thanh toán (DEPOSIT_ADVANCE hoặc COMPLETED)

  @Column('float')
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  public depositAmount!: number; // Số tiền cọc (do FE tính và gửi)

  @Column('float')
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  public totalAmount!: number; // Tổng số tiền phải trả

  @Column()
  @IsString()
  @IsNotEmpty()
  public paymentMethod!: string; // Phương thức thanh toán (e.g., e-wallet)

  @Column()
  @IsEmail()
  @IsNotEmpty()
  public paymentAccount!: string; // Tài khoản PayPal hoặc tài khoản thanh toán khác

  @Column()
  @IsString()
  @IsNotEmpty()
  public payerName!: string; // Tên người thanh toán từ PayPal

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  public paymentDate!: Date | null; // Ngày thanh toán

  @BeforeInsert()
  private setPaymentDateOnInsert() {
    this.paymentDate = new Date(); 
  }

  @BeforeUpdate()
  private validateStatus() {
    if (this.depositAmount >= this.totalAmount) {
      this.status = PaymentStatus.COMPLETED; 
    }
    if (this.status === PaymentStatus.COMPLETED && !this.paymentDate) {
        this.paymentDate = new Date();
    }
  }
}
