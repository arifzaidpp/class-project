import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { DonationStatus } from './add-donation.input';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateDonationInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    deviceId?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    name?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    amount?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    countryName?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    stateName?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    cityName?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    pincode?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    screenshotLink?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsEnum(DonationStatus)
    status?: DonationStatus;
}