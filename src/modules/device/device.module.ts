import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

// Services
import { DeviceService } from './services/device.service';

// Resolvers
import { DeviceResolver } from './resolvers/device.resolver';

@Module({
    imports: [
        ConfigModule,
    ],
    providers: [
        PrismaClient,

        // Services
        DeviceService,

        // Resolvers
        DeviceResolver,
    ],
    exports: [
        DeviceService,
    ],
})
export class DeviceModule {}