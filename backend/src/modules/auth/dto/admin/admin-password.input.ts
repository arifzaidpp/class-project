// src/auth/dto/admin/admin-password.dto.ts
import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

/**
 * DTO for changing admin password
 */
@InputType()
export class AdminPasswordDto {
  /**
   * Current admin password
   * @example "CurrentPassword123"
   */
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Current password is required' })
  currentPassword: string;
  
  /**
   * New admin password
   * @example "NewSecurePassword456"
   */
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
  })
  newPassword: string;
}