import {
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { AddDonationInput, DonationStatus } from '../dto/add-donation.input';
import { UpdateDonationInput } from '../dto/update-donation.input';
import { Donation } from '@prisma/client';
import { Request } from 'express';
import { CacheService } from 'src/shared/cache/cache.service';
import { cacheKeys } from 'src/shared/cache/cache-keys.util';

/**
 * Service to handle Donation operations
 * Uses Prisma as ORM, implements caching strategies, and logs donation actions
 */
@Injectable()
export class DonationService {
    private readonly logger = new Logger(DonationService.name);
    private readonly ttl = 24 * 60 * 60; // 1 day

    constructor(
        private readonly prisma: PrismaService,
        private readonly cacheService: CacheService,
    ) {}

    /**
     * Find a donation by its ID
     *
     * @param id - Donation ID
     * @returns Promise with the Donation object
     * @throws NotFoundException if the donation is not found
     */
    async findDonationById(id: string): Promise<Donation> {
        const cacheKey = cacheKeys.donation(id);

        // Try to get the donation from cache
        const cachedDonation = await this.cacheService.get<Donation>(cacheKey);
        if (cachedDonation) {
            this.logger.log(`Cache hit for donation ID ${id}`);
            return cachedDonation;
        }

        // Fetch from database if not in cache
        const donation = await this.prisma.donation.findUnique({
            where: { id },
            include: {
                device: true,
            },
        });

        if (!donation) {
            this.logger.warn(`Donation with ID ${id} not found`);
            throw new NotFoundException(`Donation with ID ${id} not found`);
        }

        this.logger.log(`Donation with ID ${id} found`);

        // Add to the cache
        await this.cacheService.set(cacheKey, donation, this.ttl);

        return donation;
    }

    /**
     * Find donations by device ID
     *
     * @param deviceId - Device ID
     * @param req - Express request object
     * @returns Promise with an array of Donation objects
     */
    async findDonationsByDeviceId(deviceId: string, req: Request): Promise<Donation[]> {
        const cacheKey = cacheKeys.donationsByDevice(deviceId);
        const cachedDonations = await this.cacheService.get<Donation[]>(cacheKey);
        if (cachedDonations) {
            this.logger.log(`Cache hit for donations by device ID ${deviceId}`);
            return cachedDonations;
        }
        const donations = await this.prisma.donation.findMany({
            where: { deviceId },
            include: {
                device: true,
            },
        });
        if (!donations || donations.length === 0) {
            this.logger.warn(`No donations found for device ID ${deviceId}`);
            throw new NotFoundException(`No donations found for device ID ${deviceId}`);
        }
        this.logger.log(`Donations found for device ID ${deviceId}`);
        await this.cacheService.set(cacheKey, donations, this.ttl);
        return donations;
    }

    /**
     * Find donations by status
     *
     * @param statuses - Array of donation statuses to filter by
     * @returns Promise with an array of Donation objects
     */
    async findDonationsByStatus(statuses: DonationStatus[]): Promise<Donation[]> {
        const donations = await this.prisma.donation.findMany({
            where: {
                status: {
                    in: statuses,
                },
            },
            include: {
                device: true,
            },
        });

        if (!donations || donations.length === 0) {
            this.logger.warn(`No donations found for statuses: ${statuses.join(', ')}`);
            throw new NotFoundException(`No donations found for statuses: ${statuses.join(', ')}`);
        }

        this.logger.log(`Donations found for statuses: ${statuses.join(', ')}`);
        return donations;
    }

    /**
     * Get total donation amount by status
     *
     * @param status - Donation status to filter by
     * @returns Promise with the total donation amount
     */
    async getTotalDonationAmountByStatus(status: DonationStatus): Promise<number> {
        const totalAmount = await this.prisma.donation.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                status,
            },
        });

        const sum = totalAmount._sum.amount || 0;
        this.logger.log(`Total donation amount for status ${status}: ${sum}`);
        return sum;
    }

    /**
     * Get top donors of yesterday by highest payment
     *
     * @param limit - Number of top donors to retrieve
     * @returns Promise with an array of Donation objects
     */
    async findTopDonorsOfYesterday(limit: number): Promise<Donation[]> {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        const endOfYesterday = new Date(yesterday);
        endOfYesterday.setHours(23, 59, 59, 999);

        console.log(`Yesterday's date range: ${yesterday.toISOString()} to ${endOfYesterday.toISOString()}`);
        
        const topDonors = await this.prisma.donation.findMany({
            where: {
                createdAt: {
                    gte: yesterday,
                    lte: endOfYesterday,
                },
            },
            orderBy: {
                amount: 'desc',
            },
            take: limit,
            include: {
                device: true,
            },
        });

        if (!topDonors || topDonors.length === 0) {
            this.logger.warn(`No donations found for yesterday`);
            throw new NotFoundException(`No donations found for yesterday`);
        }

        this.logger.log(`Top ${limit} donors of yesterday retrieved successfully`);
        return topDonors;
    }

    /**
     * Get leaderboard by top donation amount
     *
     * @param status - Donation status to filter by
     * @returns Promise with an array of Donation objects sorted by amount
     */
    async findLeaderboardByTopAmount(status: DonationStatus): Promise<Donation[]> {
        const donations = await this.prisma.donation.findMany({
            where: {
                status,
            },
            orderBy: {
                amount: 'desc',
            },
            include: {
                device: true,
            },
        });

        if (!donations || donations.length === 0) {
            this.logger.warn(`No donations found for status: ${status}`);
            throw new NotFoundException(`No donations found for status: ${status}`);
        }

        this.logger.log(`Leaderboard retrieved successfully for status: ${status}`);
        return donations;
    }

    /**
     * Create a new donation
     *
     * @param data - Input data for creating a donation
     * @param req - Express request object
     * @returns Promise with the newly created Donation object
     */
    async createDonation(data: AddDonationInput, req: Request): Promise<Donation> {
        const newDonation = await this.prisma.donation.create({
            data: {
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            include: {
                device: true, // Ensure the device is included in the response
            },
        });

        // Map Prisma object to your GraphQL type
    const donation: Donation = {
        ...newDonation,
        status: newDonation.status as unknown as DonationStatus, // Type casting
    };

        this.logger.log(`Donation with ID ${donation.id} created successfully`);

        // Cache the newly created donation
        const cacheKey = cacheKeys.donation(donation.id);
        await this.cacheService.set(cacheKey, donation, this.ttl);

        return donation;
    }

    /**
     * Update an existing donation
     *
     * @param id - ID of the donation to update
     * @param data - Updated donation data
     * @param req - Express request object
     * @returns Promise with the updated Donation object
     * @throws NotFoundException if the donation is not found
     */
    async updateDonation(id: string, data: UpdateDonationInput, req: Request): Promise<Donation> {
        // Check if donation exists
        await this.findDonationById(id);

        const updatedDonation = await this.prisma.donation.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date(),
            },
            include: {
                device: true,
            },
        });

        this.logger.log(`Donation with ID ${id} updated successfully`);

        // Invalidate cache and set new data
        await this.invalidateCache(id);
        const cacheKey = cacheKeys.donation(id);
        await this.cacheService.set(cacheKey, updatedDonation, this.ttl);

        return updatedDonation;
    }

    /**
     * Invalidate donation cache
     *
     * @param id - ID of the donation to invalidate
     */
    async invalidateCache(id: string): Promise<void> {
        const cacheKey = cacheKeys.donation(id);
        await this.cacheService.delete(cacheKey);
        this.logger.log(`Cache invalidated for donation ID ${id}`);
    }
}