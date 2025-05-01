import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Donation } from './donation.model';

@ObjectType()
export class Device {
    @Field(() => ID)
    deviceId: string;

    @Field(() => String)
    deviceType: string;

    @Field(() => [Donation], { nullable: true })

    @Field()
    createdAt: Date;
}