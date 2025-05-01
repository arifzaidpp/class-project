import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class DeleteSponsorInput {
    @Field(() => ID)
    @IsNotEmpty()
    @IsUUID()
    id: string;
}