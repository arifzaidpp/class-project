import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { DonationService } from '../services/donation.service';
import { Donation } from '../models/donation.model';
import { AddDonationInput, DonationStatus } from '../dto/add-donation.input';
import { UpdateDonationInput } from '../dto/update-donation.input';


@Resolver(() => Donation)
export class DonationResolver {
    constructor(private readonly donationService: DonationService) {}

    @Query(() => Donation, { nullable: true })
    async getDonation(
        @Args('id') id: string,
        @Context() context: { req: Request; res: Response },
    ): Promise<Donation | null> {
        return this.donationService.findDonationById(id);
    }

    @Query(() => [Donation])
    async getDonations(
        @Args('deviceId') deviceId: string,
        @Context() context: { req: Request; res: Response },
    ): Promise<Donation[]> {
        return this.donationService.findDonationsByDeviceId(deviceId, context.req);
    }
    
    @Query(() => [Donation])
    async getDonationsByStatus(
        @Context() context: { req: Request; res: Response },
    ): Promise<Donation[]> {
        return this.donationService.findDonationsByStatus([DonationStatus.PENDING, DonationStatus.CONFIRMED]);
    }

    @Query(() => Number)
    async getTotalConfirmedDonationAmount(
        @Context() context: { req: Request; res: Response },
    ): Promise<number> {
        return this.donationService.getTotalDonationAmountByStatus(DonationStatus.CONFIRMED);
    }

    @Query(() => Number)
    async getTotalPendingDonationAmount(
        @Context() context: { req: Request; res: Response },
    ): Promise<number> {
        return this.donationService.getTotalDonationAmountByStatus(DonationStatus.PENDING);
    }

    @Query(() => [Donation])
    async getTopDonorsOfYesterday(
        @Context() context: { req: Request; res: Response },
    ): Promise<Donation[]> {
        return this.donationService.findTopDonorsOfYesterday(3);
    }

    @Query(() => [Donation])
    async getLeaderboardByTopAmount(
        @Context() context: { req: Request; res: Response },
    ): Promise<Donation[]> {
        return this.donationService.findLeaderboardByTopAmount(DonationStatus.CONFIRMED);
    }

    @Mutation(() => Donation)
    async addDonation(
        @Args('data') data: AddDonationInput,
        @Context() context: { req: Request; res: Response },
    ): Promise<Donation> {
        return this.donationService.createDonation(data, context.req);
    }

    @Mutation(() => Donation)
    async updateDonation(
        @Args('id') id: string,
        @Args('data') data: UpdateDonationInput,
        @Context() context: { req: Request; res: Response },
    ): Promise<Donation | null> {
        return this.donationService.updateDonation(id, data, context.req);
    }
}
