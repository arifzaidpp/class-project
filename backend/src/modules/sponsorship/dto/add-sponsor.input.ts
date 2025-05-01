import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUrl, IsOptional } from 'class-validator';

@InputType()
export class AddSponsorInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Field()
    @IsNotEmpty()
    @IsUrl()
    imageLink: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    role: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    place: string;

    @Field(() => [SponsorContributionInput], { nullable: true })
    @IsOptional()
    contributions?: SponsorContributionInput[];
}

@InputType()
export class SponsorContributionInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    itemId: string;

    @Field()
    @IsNotEmpty()
    countContributed: number;
}
