import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

// Services

// Strategies
import { AdminSessionStrategy } from './strategies/admin-session.strategy';
import { CacheModule } from 'src/shared/cache/cache.module';

// Resolvers
import { AdminAuthService } from './services/admin-auth.service';
import { AdminModule } from '../admin/admin.module';
import { AdminAuthResolver } from './resolvers/admin-auth.resolver';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'session' }),
    ConfigModule,
    CacheModule,
    AdminModule
  ],
  providers: [
    PrismaClient,
    
    // Services
    AdminAuthService,
    
    // Strategies
    AdminSessionStrategy,
    
    // Resolvers
    AdminAuthResolver,
  ],
  exports: [
    PassportModule,
    AdminAuthService,
  ],
})
export class AuthModule {}