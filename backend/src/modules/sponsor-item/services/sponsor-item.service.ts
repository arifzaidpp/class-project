import {
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { AddSponsorItemInput } from '../dto/add-sponsor-item.input';
import { UpdateSponsorItemInput } from '../dto/update-sponsor-item.input';
import { SponsorItem } from '@prisma/client';
import { Request } from 'express';
import { CacheService } from 'src/shared/cache/cache.service';
import { cacheKeys } from 'src/shared/cache/cache-keys.util';

/**
 * Service to handle SponsorItem operations
 * Uses Prisma as ORM, implements caching strategies, and logs sponsorItem actions
 */
@Injectable()
export class SponsorItemService {
    private readonly logger = new Logger(SponsorItemService.name);
    private readonly ttl = 24 * 60 * 60; // 1 day

    constructor(
        private readonly prisma: PrismaService,
        private readonly cacheService: CacheService,
    ) {}

    /**
     * Find a sponsor item by its ID
     *
     * @param id - SponsorItem ID
     * @returns Promise with the SponsorItem object
     * @throws NotFoundException if the sponsor item is not found
     */
    async findSponsorItemById(id: string): Promise<SponsorItem> {
        const cacheKey = cacheKeys.sponsorItem(id);

        // Try to get the sponsor item from cache
        const cachedSponsorItem = await this.cacheService.get<SponsorItem>(cacheKey);
        if (cachedSponsorItem) {
            this.logger.log(`Cache hit for sponsor item ID ${id}`);
            return cachedSponsorItem;
        }

        // Fetch from database if not in cache
        const sponsorItem = await this.prisma.sponsorItem.findUnique({
            where: { id }
        });

        if (!sponsorItem) {
            this.logger.warn(`Sponsor item with ID ${id} not found`);
            throw new NotFoundException(`Sponsor item with ID ${id} not found`);
        }

        this.logger.log(`Sponsor item with ID ${id} found`);

        // Add to the cache
        await this.cacheService.set(cacheKey, sponsorItem, this.ttl);

        return sponsorItem;
    }

    /**
     * Find all sponsor items
     * 
     * @returns Promise with an array of SponsorItem objects
     */
    async findAllSponsorItems(): Promise<SponsorItem[]> {
        const cacheKey = cacheKeys.allSponsorItems();
        
        // Try to get all sponsor items from cache
        const cachedSponsorItems = await this.cacheService.get<SponsorItem[]>(cacheKey);
        if (cachedSponsorItems) {
            this.logger.log(`Cache hit for all sponsor items`);
            return cachedSponsorItems;
        }
        
        // Fetch from database if not in cache
        const sponsorItems = await this.prisma.sponsorItem.findMany();
        
        this.logger.log(`Retrieved ${sponsorItems.length} sponsor items`);
        
        // Add to the cache
        await this.cacheService.set(cacheKey, sponsorItems, this.ttl);
        
        return sponsorItems;
    }

    /**
     * Create a new sponsor item
     *
     * @param data - Input data for creating a sponsor item
     * @param req - Express request object
     * @returns Promise with the newly created SponsorItem object
     */
    async createSponsorItem(data: AddSponsorItemInput, req: Request): Promise<SponsorItem> {
        const newSponsorItem = await this.prisma.sponsorItem.create({
            data: {
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        this.logger.log(`Sponsor item with ID ${newSponsorItem.id} created successfully`);

        // Cache the newly created sponsor item
        const cacheKey = cacheKeys.sponsorItem(newSponsorItem.id);
        await this.cacheService.set(cacheKey, newSponsorItem, this.ttl);
        
        // Invalidate all sponsor items cache
        await this.invalidateAllSponsorItemsCache();

        return newSponsorItem;
    }

    /**
     * Update an existing sponsor item
     *
     * @param id - ID of the sponsor item to update
     * @param data - Updated sponsor item data
     * @param req - Express request object
     * @returns Promise with the updated SponsorItem object
     * @throws NotFoundException if the sponsor item is not found
     */
    async updateSponsorItemById(id: string, data: UpdateSponsorItemInput, req: Request): Promise<SponsorItem> {
        // Check if sponsor item exists
        await this.findSponsorItemById(id);

        const updatedSponsorItem = await this.prisma.sponsorItem.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });

        this.logger.log(`Sponsor item with ID ${id} updated successfully`);

        // Invalidate cache and set new data
        await this.invalidateCache(id);
        const cacheKey = cacheKeys.sponsorItem(id);
        await this.cacheService.set(cacheKey, updatedSponsorItem, this.ttl);
        
        // Invalidate all sponsor items cache
        await this.invalidateAllSponsorItemsCache();

        return updatedSponsorItem;
    }

    /**
     * Delete a sponsor item by ID
     * 
     * @param id - ID of the sponsor item to delete
     * @returns Promise with boolean indicating success
     * @throws NotFoundException if the sponsor item is not found
     */
    async deleteSponsorItemById(id: string): Promise<boolean> {
        // Check if sponsor item exists
        await this.findSponsorItemById(id);
        
        await this.prisma.sponsorItem.delete({
            where: { id },
        });
        
        this.logger.log(`Sponsor item with ID ${id} deleted successfully`);
        
        // Invalidate cache for this item
        await this.invalidateCache(id);
        
        // Invalidate all sponsor items cache
        await this.invalidateAllSponsorItemsCache();
        
        return true;
    }

    /**
     * Invalidate sponsor item cache
     *
     * @param id - ID of the sponsor item to invalidate
     */
    async invalidateCache(id: string): Promise<void> {
        const cacheKey = cacheKeys.sponsorItem(id);
        await this.cacheService.delete(cacheKey);
        this.logger.log(`Cache invalidated for sponsor item ID ${id}`);
    }
    
    /**
     * Invalidate all sponsor items cache
     */
    async invalidateAllSponsorItemsCache(): Promise<void> {
        const cacheKey = cacheKeys.allSponsorItems();
        await this.cacheService.delete(cacheKey);
        this.logger.log(`Cache invalidated for all sponsor items`);
    }
}
