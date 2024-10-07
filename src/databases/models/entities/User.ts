'use strict'
import { Entity, ObjectIdColumn, ObjectId, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { IsEmail, IsNotEmpty, MaxLength, IsOptional, IsInt, Min, Max, IsDate, IsString, Matches, MinLength} from 'class-validator';
import { Transform } from 'class-transformer';


@Entity()
export class User {
  @ObjectIdColumn()
  public id: ObjectId | undefined;

  @Column({ type: 'varchar', length: 50, name: 'email' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  public email!: string;

  @Column({ type: 'varchar', length: 255, name: 'password' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/, {
    message:
    'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  public password!: string;


  @Column({ type: 'varchar', length: 50, name: 'name' })
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(50, { message: 'Name cannot be longer than 50 characters' })
  public name!: string;

  @Column({ type: 'tinyint', name: 'userFlg', default: 1 })
  @IsInt()
  @Min(0)
  @Max(2)
  public userFlg!: number;

  @Column({ type: 'date', nullable: true, name: 'dateOfBirth' })
  @IsDate()
  @IsOptional()
  public dateOfBirth!: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @IsString()
  @IsOptional()
  public phone!: string;

  @Column({ type: 'text', nullable: true })
  @IsString()
  @IsOptional()
  public address!: string;

  @Column({ type: 'string', nullable: true })
  @IsString()
  @IsOptional()
  public urlAvatar!: string;

  @Column({ type: 'tinyint', name: 'delFlg', default: 0 })
  @IsInt()
  @Min(0)
  @Max(1)
  public delFlg!: number;

  @Column({ type: 'string', nullable: true, name: 'gender' })
  @IsString()
  @IsOptional()
  public gender!: string;
// refreshToken
  @Column({ type: 'string', nullable: true, name: 'refresh_token' })
  @IsString()
  @IsOptional()
  public refreshToken!: string;
  // public_key
  @Column({ type: 'string', nullable: true, name: 'public_key' })
  @IsString()
  @IsOptional()
  public accessToken!: string;

  @Column({ type: 'string', nullable: true, name: 'avatar' })
  @IsString()
  @IsOptional()
  public avatar!: string;

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
  }

  @BeforeUpdate()
  private beforeUpdate() {
    this.updatedAt = new Date();
  }
}
