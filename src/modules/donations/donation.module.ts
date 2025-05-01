import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { DonationService } from './services/donation.service';
import { DonationResolver } from './resolvers/donation.resolver';

@Module({
    imports: [
        ConfigModule,
    ],
    providers: [
        PrismaClient,

        // Services
        DonationService,

        // Resolvers
        DonationResolver
    ],
    exports: [
        DonationService
    ],
})
export class DonationModule {}