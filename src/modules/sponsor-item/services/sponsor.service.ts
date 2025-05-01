import {
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { AddSponsorInput } from '../dto/add-sponsor.input';
import { UpdateSponsorInput } from '../dto/update-sponsor.input';
import { Sponsor } from '@prisma/client';
import { Request } from 'express';
import { CacheService } from 'src/shared/cache/cache.service';
import { cacheKeys } from 'src/shared/cache/cache-keys.util';

/**
 * Service to handle Sponsor operations
 * Uses Prisma as ORM, implements caching strategies, and logs sponsor actions
 */
@Injectable()
export class SponsorService {
    private readonly logger = new Logger(SponsorService.name);
    private readonly ttl = 24 * 60 * 60; // 1 day

    constructor(
        private readonly prisma: PrismaService,
        private readonly cacheService: CacheService,
    ) { }

    /**
     * Find a sponsor by its ID
     *
     * @param id - Sponsor ID
     * @returns Promise with the Sponsor object
     * @throws NotFoundException if the sponsor is not found
     */
    async findSponsorById(id: string): Promise<Sponsor> {
        const cacheKey = cacheKeys.sponsor(id);

        // Try to get the sponsor from cache
        const cachedSponsor = await this.cacheService.get<Sponsor>(cacheKey);
        if (cachedSponsor) {
            this.logger.log(`Cache hit for sponsor ID ${id}`);
            return cachedSponsor;
        }

        // Fetch from database if not in cache
        const sponsor = await this.prisma.sponsor.findUnique({
            where: { id }
        });

        if (!sponsor) {
            this.logger.warn(`Sponsor with ID ${id} not found`);
            throw new NotFoundException(`Sponsor with ID ${id} not found`);
        }

        this.logger.log(`Sponsor with ID ${id} found`);

        // Add to the cache
        await this.cacheService.set(cacheKey, sponsor, this.ttl);

        return sponsor;
    }

    /**
     * Find all sponsors
     * 
     * @returns Promise with an array of Sponsor objects
     */
    async findAllSponsors(): Promise<Sponsor[]> {
        const cacheKey = cacheKeys.allSponsors();

        // Try to get all sponsors from cache
        const cachedSponsors = await this.cacheService.get<Sponsor[]>(cacheKey);
        if (cachedSponsors) {
            this.logger.log(`Cache hit for all sponsors`);
            return cachedSponsors;
        }

        // Fetch from database if not in cache
        const sponsors = await this.prisma.sponsor.findMany({
            include: {
                contributions: {
                    include: {
                        sponsorItem: true
                    }
                }
            }
        });

        this.logger.log(`Retrieved ${sponsors.length} sponsors with their contributions`);

        // Add to the cache
        await this.cacheService.set(cacheKey, sponsors, this.ttl);

        return sponsors;
    }

    /**
     * Create a new sponsor
     *
     * @param data - Input data for creating a sponsor
     * @param req - Express request object
     * @returns Promise with the newly created Sponsor object
     */
    async createSponsor(data: AddSponsorInput, req: Request): Promise<Sponsor> {
        const { contributions, ...sponsorData } = data;

        // Create the sponsor without contributions first
        const newSponsor = await this.prisma.sponsor.create({
            data: {
                ...sponsorData,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            include: { contributions: true }
        });

        // If there are contributions, add them separately
        if (contributions && contributions.length > 0) {
            for (const contribution of contributions) {
                await this.prisma.sponsorContribution.create({
                    data: {
                        sponsorId: newSponsor.id,
                        itemId: contribution.itemId,
                        countContributed: contribution.countContributed
                    }
                });
                await this.prisma.sponsorItem.update({
                    where: { id: contribution.itemId },
                    data: {
                        sponsoredCount: {
                            increment: contribution.countContributed
                        }
                    }
                });
            }
        }

        this.logger.log(`Sponsor with ID ${newSponsor.id} created successfully`);

        // invalidate cache for sponsor item
        if (contributions && contributions.length > 0) {
            for (const contribution of contributions) {
                const cacheKey = cacheKeys.allSponsorItems();
                await this.cacheService.delete(cacheKey);
                this.logger.log(`Cache invalidated for sponsor item ID ${contribution.itemId}`);
            }
        }

        // Cache the newly created sponsor with updated contributions
        // Get the complete sponsor data with contributions and sponsor items
        const completeData = await this.prisma.sponsor.findUnique({
            where: { id: newSponsor.id },
            include: {
                contributions: {
                    include: {
                        sponsorItem: true // Add this to include the related sponsor items
                    }
                }
            }
        });

        if (!completeData) {
            this.logger.error(`Failed to retrieve created sponsor with ID ${newSponsor.id}`);
            throw new NotFoundException(`Sponsor with ID ${newSponsor.id} not found after creation`);
        }

        const cacheKey = cacheKeys.sponsor(newSponsor.id);
        await this.cacheService.set(cacheKey, completeData, this.ttl);

        // Invalidate all sponsors cache
        await this.invalidateAllSponsorsCache();

        return completeData;
    }

    /**
     * Update an existing sponsor
     *
     * @param id - ID of the sponsor to update
     * @param data - Updated sponsor data
     * @param req - Express request object
     * @returns Promise with the updated Sponsor object
     * @throws NotFoundException if the sponsor is not found
     */
    async updateSponsorById(id: string, data: UpdateSponsorInput, req: Request): Promise<Sponsor> {
        // Check if sponsor exists
        await this.findSponsorById(id);

        const { contributions, ...otherData } = data;

        const updatedSponsor = await this.prisma.sponsor.update({
            where: { id },
            data: {
                ...otherData,
                updatedAt: new Date(),
                ...(contributions && {
                    contributions: {
                        deleteMany: {},
                        create: contributions
                    }
                })
            },
        });

        this.logger.log(`Sponsor with ID ${id} updated successfully`);

        // Invalidate cache and set new data
        await this.invalidateCache(id);
        const cacheKey = cacheKeys.sponsor(id);
        await this.cacheService.set(cacheKey, updatedSponsor, this.ttl);

        // Invalidate all sponsors cache
        await this.invalidateAllSponsorsCache();

        return updatedSponsor;
    }

    /**
     * Delete a sponsor by ID
     * 
     * @param id - ID of the sponsor to delete
     * @returns Promise with boolean indicating success
     * @throws NotFoundException if the sponsor is not found
     */
    async deleteSponsorById(id: string): Promise<boolean> {
        // Check if sponsor exists
        await this.findSponsorById(id);

        await this.prisma.sponsor.delete({
            where: { id },
        });

        this.logger.log(`Sponsor with ID ${id} deleted successfully`);

        // Invalidate cache for this item
        await this.invalidateCache(id);

        // Invalidate all sponsors cache
        await this.invalidateAllSponsorsCache();

        return true;
    }

    /**
     * Invalidate sponsor cache
     *
     * @param id - ID of the sponsor to invalidate
     */
    async invalidateCache(id: string): Promise<void> {
        const cacheKey = cacheKeys.sponsor(id);
        await this.cacheService.delete(cacheKey);
        this.logger.log(`Cache invalidated for sponsor ID ${id}`);
    }

    /**
     * Invalidate all sponsors cache
     */
    async invalidateAllSponsorsCache(): Promise<void> {
        const cacheKey = cacheKeys.allSponsors();
        await this.cacheService.delete(cacheKey);
        this.logger.log(`Cache invalidated for all sponsors`);
    }
}
