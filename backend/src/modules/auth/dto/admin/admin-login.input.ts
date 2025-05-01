import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

/**
 * DTO for admin login
 */
@InputType()
export class AdminLoginDto {
  /**
   * device ID
   * @example "device123"
   */
  @Field()
  @IsNotEmpty({ message: 'Device ID is required' })
  @IsString()
  deviceId: string;

  /**
   * Admin email address
   * @example "admin@thelicham.com"
   */
  @Field()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  /**
   * Admin password
   * @example "SecurePassword123"
   */
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}