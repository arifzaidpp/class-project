import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class SponsorItem {
    @Field(() => ID)
    id: string;

    @Field(() => String)
    itemName: string;

    @Field(() => Float)
    price: number;

    @Field(() => Int)
    count: number;

    @Field(() => Int)
    sponsoredCount: number;
}
