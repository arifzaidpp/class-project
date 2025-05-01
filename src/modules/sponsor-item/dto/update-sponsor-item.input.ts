import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateSponsorItemInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    itemName?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    price?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    count?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    sponsoredCount?: number;
}
