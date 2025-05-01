import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class AddSponsorItemInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    itemName: string;

    @Field()
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @Field()
    @IsNotEmpty()
    @IsNumber()
    count: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    sponsoredCount?: number;
}
