import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Donation } from 'src/modules/donations/models/donation.model';


@ObjectType()
export class Device {
    @Field(() => ID)
    deviceId: string;

    @Field(() => String)
    deviceType: string;

    @Field(() => [Donation], { nullable: true })
    donations?: Donation[];

    @Field()
    createdAt: Date;
}