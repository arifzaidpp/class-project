import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { SponsorService } from '../services/sponsor.service';
import { Sponsor } from '../models/sponsor.model';
import { AddSponsorInput } from '../dto/add-sponsor.input';
import { UpdateSponsorInput } from '../dto/update-sponsor.input';
import { UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from 'src/common/guards/admin-auth.guard';
import { DeleteSponsorInput } from '../dto/delete -sponsor.input';

@Resolver(() => Sponsor)
export class SponsorResolver {
    constructor(private readonly sponsorService: SponsorService) {}

    @Query(() => Sponsor, { nullable: true })
    async getSponsorById(
        @Args('id') id: string,
        @Context() context: { req: Request; res: Response },
    ): Promise<Sponsor | null> {
        return this.sponsorService.findSponsorById(id);
    }

    @Query(() => [Sponsor])
    async getAllSponsors(
        @Context() context: { req: Request; res: Response },
    ): Promise<Sponsor[]> {
        return this.sponsorService.findAllSponsors();
    }

    @Mutation(() => Sponsor)
    @UseGuards(AdminAuthGuard)
    async createSponsor(
        @Args('data') data: AddSponsorInput,
        @Context() context: { req: Request; res: Response },
    ): Promise<Sponsor> {
        return this.sponsorService.createSponsor(data, context.req);
    }

    @Mutation(() => Sponsor)
    @UseGuards(AdminAuthGuard)
    async updateSponsorById(
        @Args('id') id: string,
        @Args('data') data: UpdateSponsorInput,
        @Context() context: { req: Request; res: Response },
    ): Promise<Sponsor | null> {
        return this.sponsorService.updateSponsorById(id, data, context.req);
    }

    @Mutation(() => Boolean)
    @UseGuards(AdminAuthGuard)
    async deleteSponsor(
        @Args('data') data: DeleteSponsorInput,
        @Context() context: { req: Request; res: Response },
    ): Promise<boolean> {
        return this.sponsorService.deleteSponsorById(data.id);
    }
}
