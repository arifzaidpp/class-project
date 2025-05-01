import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { SponsorItem } from './sponsor-item.model';

@ObjectType()
export class Sponsor {
    @Field(() => ID)
    id: string;

    @Field(() => String)
    name: string;

    @Field(() => String)
    imageLink: string;

    @Field(() => String)
    role: string;

    @Field(() => String)
    place: string;

    @Field(() => [SponsorContribution], { nullable: true })
    contributions?: SponsorContribution[];
}

@ObjectType()
export class SponsorContribution {
    @Field(() => String)
    sponsorId: string;

    @Field(() => Sponsor)
    sponsor: Sponsor;

    @Field(() => String)
    itemId: string;

    @Field(() => SponsorItem)
    sponsorItem: SponsorItem;

    @Field(() => Int)
    countContributed: number;
}
