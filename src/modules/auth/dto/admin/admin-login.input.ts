import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

/**
 * DTO for admin login
 */
@InputType()
export class AdminLoginDto {
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