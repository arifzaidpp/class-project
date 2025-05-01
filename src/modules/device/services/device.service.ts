import {
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CheckDeviceInput } from '../dto/check-device.input';
import { Device } from '@prisma/client';
import { Request } from 'express';
import { CacheService } from 'src/shared/cache/cache.service';
import { cacheKeys } from 'src/shared/cache/cache-keys.util';

/**
 * Service to handle Device operations
 * Uses Prisma as ORM, implements caching strategies, and logs device actions
 */
@Injectable()
export class DeviceService {
    private readonly logger = new Logger(DeviceService.name);
    private readonly ttl = 24 * 60 * 60; // 1 day

    constructor(
        private readonly prisma: PrismaService,
        private readonly cacheService: CacheService,
    ) {}

    /**
     * Find a device by its ID
     *
     * @param input - Input containing the device ID
     * @returns Promise with the Device object
     * @throws NotFoundException if the device is not found
     */
    async findDeviceById(input: CheckDeviceInput): Promise<Device> {
        const cacheKey = cacheKeys.device(input.deviceId);

        // Try to get the device from cache
        const cachedDevice = await this.cacheService.get<Device>(cacheKey);
        if (cachedDevice) {
            this.logger.log(`Cache hit for device ID ${input.deviceId}`);
            return cachedDevice;
        }

        // Fetch from database if not in cache
        const device = await this.prisma.device.findUnique({
            where: { deviceId: input.deviceId },
            include: {
                donations: true,
            },
        });

        if (!device) {
            this.logger.warn(`Device with ID ${input.deviceId} not found`);
            throw new NotFoundException(`Device with ID ${input.deviceId} not found`);
        }

        this.logger.log(`Device with ID ${input.deviceId} found`);

        // Add to the cache
        await this.cacheService.set(cacheKey, device, this.ttl);

        return device;
    }

    /**
     * Create a new device
     *
     * @param input - Input containing the device ID
     * @returns Promise with the newly created Device object
     */
    async createDevice(input: CheckDeviceInput, req: Request): Promise<Device> {
        const newDevice = await this.prisma.device.create({
            data: {
                deviceId: input.deviceId,
                deviceType: req.headers['user-agent'] as string || 'unknown',
                createdAt: new Date(),
            },
        });

        this.logger.log(`Device with ID ${input.deviceId} created successfully`);

        // Cache the newly created device
        const cacheKey = cacheKeys.device(input.deviceId);
        await this.cacheService.set(cacheKey, newDevice, this.ttl);

        return newDevice;
    }

    /**
     * Invalidate device cache
     *
     * @param deviceId - ID of the device to invalidate
     */
    async invalidateCache(deviceId: string): Promise<void> {
        const cacheKey = cacheKeys.device(deviceId);
        await this.cacheService.delete(cacheKey);
        this.logger.log(`Cache invalidated for device ID ${deviceId}`);
    }
}