import { ObjectType, Field, ID, Float, registerEnumType } from '@nestjs/graphql';
import { Device } from 'src/modules/device/models/device.model';
import { DonationStatus as PrismaDonationStatus } from '@prisma/client';


export { PrismaDonationStatus as DonationStatus };

registerEnumType(PrismaDonationStatus, {
    name: 'DonationStatus',
    description: 'Status of the donation',
});

@ObjectType()
export class Donation {
    @Field(() => ID)
    id: string;

    @Field(() => String)
    deviceId: string;

    @Field(() => String)
    name: string;

    @Field(() => String)
    phoneNumber: string;

    @Field(() => Float)
    amount: number;

    @Field(() => String)
    countryName: string;

    @Field(() => String)
    stateName: string;

    @Field(() => String)
    cityName: string;

    @Field(() => String)
    pincode: string;

    @Field(() => String, { nullable: true })
    screenshotLink?: string | null;

    @Field(() => PrismaDonationStatus)
    status: PrismaDonationStatus;

    @Field(() => Date)
    createdAt: Date;
}