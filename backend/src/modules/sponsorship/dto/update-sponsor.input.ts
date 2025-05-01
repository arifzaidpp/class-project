import { IsString, IsOptional, IsUrl, IsArray, ValidateNested, IsInt, IsUUID } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { SponsorContributionInput } from './add-sponsor.input';

@InputType()
export class UpdateSponsorInput {
        @Field({ nullable: true })
        @IsOptional()
        @IsString()
        name?: string;

        @Field({ nullable: true })
        @IsOptional()
        @IsUrl()
        imageLink?: string;

        @Field({ nullable: true })
        @IsOptional()
        @IsString()
        role?: string;

        @Field({ nullable: true })
        @IsOptional()
        @IsString()
        place?: string;

        @Field(() => [SponsorContributionInput], { nullable: true })
        @IsOptional()
        @IsArray()
        @ValidateNested({ each: true })
        @Type(() => SponsorContributionInput)
        contributions?: SponsorContributionInput[];
}
