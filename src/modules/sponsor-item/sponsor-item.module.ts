import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { SponsorItemService } from './services/sponsor-item.service';
import { SponsorItemResolver } from './resolvers/sponsor-item.resolver';

@Module({
    imports: [
        ConfigModule,
    ],
    providers: [
        PrismaClient,

        // Services
        SponsorItemService,

        // Resolvers
        SponsorItemResolver
    ],
    exports: [
        SponsorItemService
    ],
})
export class SponsorItemModule {}