import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { Device } from '../models/device.model';
import { DeviceService } from '../services/device.service';
import { CheckDeviceInput } from '../dto/check-device.input';

@Resolver(() => Device)
export class DeviceResolver {
    constructor(private readonly deviceService: DeviceService) {}

    @Query(() => Device, { nullable: true })
    async getOrCreateDevice(
        @Args('deviceId') deviceId: CheckDeviceInput,
        @Context() context: { req: Request; res: Response },
    ): Promise<Device> {
        let device = await this.deviceService.findDeviceById(deviceId);
        if (!device) {
            device = await this.deviceService.createDevice(deviceId, context.req);
        }
        return device;
    }
}