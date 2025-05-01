import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
export enum DonationStatus {
    DRAFT = 'draft',
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    REJECTED = 'rejected'
}

@InputType()
export class AddDonationInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    deviceId: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    phoneNumber: string;

    @Field()
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @Field()
    @IsNotEmpty()
    @IsString()
    countryName: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    stateName: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    cityName: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    pincode: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    screenshotLink?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsEnum(DonationStatus)
    status?: DonationStatus;
}