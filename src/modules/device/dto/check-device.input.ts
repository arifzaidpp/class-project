import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

@InputType()
export class CheckDeviceInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    deviceId: string;
}