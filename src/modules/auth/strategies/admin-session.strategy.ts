import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { Admin, PrismaClient } from '@prisma/client';
import { cacheKeys } from 'src/shared/cache/cache-keys.util';
import { CacheService } from 'src/shared/cache/cache.service';

@Injectable()
export class AdminSessionStrategy extends PassportStrategy(Strategy, 'admin-session') {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly cacheService: CacheService,
  ) {
    super();
  }

  async validate(request: Request): Promise<any> {
    const sessionId = request.cookies.adminSessionId;
    
    if (!sessionId) {
      throw new UnauthorizedException('No admin session found');
    }
    
    // Find session
    const session = await this.prisma.adminSession.findUnique({
      where: { id: sessionId },
    });
    
    if (!session || new Date(session.expires) < new Date()) {
      throw new UnauthorizedException('Admin session expired or invalid');
    }
    
    // Check if admin exists and get admin data
    const cachedAdmin : Partial<Admin> | undefined = await this.cacheService.get(cacheKeys.admin(session.adminId));
    
    if (cachedAdmin) {
      
      // Update last active time (without waiting)
      this.prisma.adminSession.update({
        where: { id: sessionId },
        data: { lastActiveAt: new Date() },
      }).catch(err => console.error('Failed to update admin session last active time:', err));
      
      return cachedAdmin;
    }
    
    // If not in cache, get from database
    const admin = await this.prisma.admin.findUnique({
      where: { id: session.adminId },
    });
    
    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }
    
    // Update last active time (without waiting)
    this.prisma.adminSession.update({
      where: { id: sessionId },
      data: { lastActiveAt: new Date() },
    }).catch(err => console.error('Failed to update admin session last active time:', err));
    
    // Cache admin data
    await this.cacheService.set(cacheKeys.admin(admin.id), admin);
    
    return admin;
  }
}