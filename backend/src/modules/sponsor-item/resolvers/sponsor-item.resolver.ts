import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { SponsorItemService } from '../services/sponsor-item.service';
import { SponsorItem } from '../models/sponsor-item.model';
import { AddSponsorItemInput } from '../dto/add-sponsor-item.input';
import { UpdateSponsorItemInput } from '../dto/update-sponsor-item.input';
import { UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from 'src/common/guards/admin-auth.guard';

@Resolver(() => SponsorItem)
export class SponsorItemResolver {
    constructor(private readonly sponsorItemService: SponsorItemService) {}

    @Query(() => SponsorItem, { nullable: true })
    async getSponsorItemById(
        @Args('id') id: string,
        @Context() context: { req: Request; res: Response },
    ): Promise<SponsorItem | null> {
        return this.sponsorItemService.findSponsorItemById(id);
    }

    @Query(() => [SponsorItem])
    async getAllSponsorItems(
        @Context() context: { req: Request; res: Response },
    ): Promise<SponsorItem[]> {
        return this.sponsorItemService.findAllSponsorItems();
    }

    @Mutation(() => SponsorItem)
    @UseGuards(AdminAuthGuard)
    async createSponsorItem(
        @Args('data') data: AddSponsorItemInput,
        @Context() context: { req: Request; res: Response },
    ): Promise<SponsorItem> {
        return this.sponsorItemService.createSponsorItem(data, context.req);
    }

    @Mutation(() => SponsorItem)
    @UseGuards(AdminAuthGuard)
    async updateSponsorItemById(
        @Args('id') id: string,
        @Args('data') data: UpdateSponsorItemInput,
        @Context() context: { req: Request; res: Response },
    ): Promise<SponsorItem | null> {
        return this.sponsorItemService.updateSponsorItemById(id, data, context.req);
    }

    @Mutation(() => Boolean)
    @UseGuards(AdminAuthGuard)
    async deleteSponsorItemById(
        @Args('id') id: string,
        @Context() context: { req: Request; res: Response },
    ): Promise<boolean> {
        return this.sponsorItemService.deleteSponsorItemById(id);
    }
}
