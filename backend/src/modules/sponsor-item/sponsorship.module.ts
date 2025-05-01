import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { SponsorItemService } from './services/sponsor-item.service';
import { SponsorItemResolver } from './resolvers/sponsor-item.resolver';
import { SponsorService } from './services/sponsor.service';
import { SponsorResolver } from './resolvers/sponsor.resolver';

@Module({
    imports: [
        ConfigModule,
    ],
    providers: [
        PrismaClient,

        // Services
        SponsorItemService,
        SponsorService,

        // Resolvers
        SponsorItemResolver,
        SponsorResolver
    ],
    exports: [
        SponsorItemService,
        SponsorService
    ],
})
export class SponsorshipModule {}