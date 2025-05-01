import {
  Injectable,
  Logger,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AdminLoginDto } from '../dto/admin/admin-login.input';
import { ChangePasswordInput } from '../dto/change-password.input';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CacheService } from 'src/shared/cache/cache.service';
import { withErrorHandling } from 'src/common/utils/application-error.utils';
import { hashPassword, verifyPassword } from 'src/common/utils/password.util';
import { cacheKeys } from 'src/shared/cache/cache-keys.util';
import {
  createAdminSession,
  invalidateAdminSession,
} from 'src/common/utils/session.util';
import { Admin, PrismaClient } from '@prisma/client';
import { Admin as AdminModel } from '../models/admin.model';
import { transformDates } from 'src/common/utils/date.utils';

/**
 * Service to handle Admin authentication operations
 * Uses Prisma as ORM, implements caching strategies, and logs admin actions
 */
@Injectable()
export class AdminAuthService {
  /**
   * Initialize the service with required dependencies
   */
  private readonly logger = new Logger(AdminAuthService.name);
  private readonly ttl = 7 * 24 * 60 * 60; // 1 week

  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Admin login - verify credentials and create session
   *
   * @param input - Login credentials
   * @param req - Express request object
   * @param res - Express response object
   * @returns Promise with Admin object
   * @throws UnauthorizedException if credentials are invalid
   */
  async adminLogin(
    input: AdminLoginDto,
    req: Request,
    res: Response,
  ): Promise<AdminModel> {
    return withErrorHandling(
      async () => {
        const { email, password } = input;

        // Find admin by email
        const admin = await this.prisma.admin.findUnique({
          where: { email },
        });

        if (!admin || !admin.passwordHash) {
          throw new UnauthorizedException('Invalid username or password');
        }

        // Verify password
        const isPasswordValid = await verifyPassword(
          admin.passwordHash,
          password,
        );
        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid username or password');
        }

        // Begin transaction for session handling
        const result = await this.prisma.$transaction(async (tx) => {
          // Check for existing sessions and invalidate them (only one active session allowed)
          const existingSessions = await tx.adminSession.findMany({
            where: {
              adminId: admin.id,
              expires: { gt: new Date() },
            },
          });

          if (existingSessions.length > 0) {
            await Promise.all(
              existingSessions.map((session) =>
                invalidateAdminSession(tx as PrismaClient, session.id),
              ),
            );
          }

          // Create a new session
          const sessionId = await createAdminSession(
            this.prisma,
            admin.id,
            req.ip || 'unknown',
            input.deviceId,
          );

          // Update last login time
          const updatedAdmin = await tx.admin.update({
            where: { id: admin.id },
            data: {
              lastLoginAt: new Date(),
            },
          });

          return { updatedAdmin, sessionId };
        });

        // Set session cookie
        res.cookie('adminSessionId', result.sessionId, {
          httpOnly: true,
          secure: this.configService.get('NODE_ENV') === 'production',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Cache the admin data
        await this.cacheService.set(
          cacheKeys.admin(admin.id),
          result.updatedAdmin,
          this.ttl,
        );

        // Remove sensitive data
        const { passwordHash, ...adminWithoutPassword } = result.updatedAdmin;
        return adminWithoutPassword as AdminModel;
      },
      {
        entityName: 'admin',
        operation: 'login',
      },
    );
  }

  /**
   * Admin logout - invalidate session
   *
   * @param adminId - ID of the admin to log out
   * @param sessionId - ID of the session to invalidate
   * @param res - Express response object
   * @returns Promise with success response
   */
  async adminLogout(
    adminId: string,
    sessionId: string,
    res: Response,
    ipAddress?: string,
  ): Promise<{ success: boolean }> {
    return withErrorHandling(
      async () => {
        // Invalidate the session
        await this.prisma.$transaction(async (tx) => {
          await invalidateAdminSession(tx as PrismaClient, sessionId);
        });

        // Clear the cookie
        res.clearCookie('adminSessionId');

        return { success: true };
      },
      {
        entityName: 'admin',
        operation: 'logout',
      },
    );
  }

  /**
   * Change admin password
   *
   * @param adminId - ID of the admin changing password
   * @param input - Current and new password
   * @param ipAddress - Optional IP address of the admin
   * @returns Promise with success response
   * @throws UnauthorizedException if current password is incorrect
   */
  async changePassword(
    adminId: string,
    input: ChangePasswordInput,
    ipAddress?: string,
  ): Promise<{ success: boolean }> {
    return withErrorHandling(
      async () => {
        const { currentPassword, newPassword } = input;

        const result = await this.prisma.$transaction(async (tx) => {
          // Find admin
          const admin = await tx.admin.findUnique({
            where: { id: adminId },
          });

          if (!admin || !admin.passwordHash) {
            throw new NotFoundException('Admin not found');
          }

          // Verify current password
          const isPasswordValid = await verifyPassword(
            admin.passwordHash,
            currentPassword,
          );

          if (!isPasswordValid) {
            throw new UnauthorizedException('Current password is incorrect');
          }

          // Hash new password
          const passwordHash = await hashPassword(newPassword);

          // Update admin password
          await tx.admin.update({
            where: { id: adminId },
            data: {
              passwordHash,
            },
          });

          return true;
        });

        // Invalidate admin cache
        await this.invalidateCache(adminId);

        return { success: true };
      },
      {
        entityName: 'admin',
        operation: 'changePassword',
      },
    );
  }

  /**
   * Get current admin profile
   *
   * @param adminId - ID of the admin to get profile for
   * @returns Promise with Admin object
   * @throws NotFoundException if admin not found
   */
  async me(adminId: string): Promise<AdminModel> {
    return withErrorHandling(
      async () => {
        // Try to get from cache first
        const cachedAdmin = await this.cacheService.get<Admin>(
          cacheKeys.admin(adminId),
        );

        if (cachedAdmin) {
          // Remove sensitive data and transform dates
          const { passwordHash, ...adminWithoutPassword } = cachedAdmin;
          return transformDates(adminWithoutPassword) as Admin;
        }

        // Get from database if not in cache
        const admin = await this.prisma.admin.findUnique({
          where: { id: adminId },
        });

        if (!admin) {
          throw new NotFoundException('Admin not found');
        }

        // Cache the admin
        await this.cacheService.set(cacheKeys.admin(adminId), admin, this.ttl);

        // Remove sensitive data
        const { passwordHash, ...adminWithoutPassword } = admin;

        return adminWithoutPassword as AdminModel;
      },
      {
        entityName: 'admin',
        operation: 'me',
      },
    );
  }

  /**
   * Verify if a session is valid
   *
   * @param sessionId - ID of the session to verify
   * @returns Promise with admin ID if session is valid
   * @throws UnauthorizedException if session is invalid
   */
  async verifySession(sessionId: string): Promise<string> {
    return withErrorHandling(
      async () => {
        // Check if session exists and is not expired
        const session = await this.prisma.adminSession.findUnique({
          where: { id: sessionId },
        });

        if (!session || session.expires < new Date()) {
          throw new UnauthorizedException('Invalid or expired session');
        }

        // Check if admin exists and is active
        const admin = await this.prisma.admin.findUnique({
          where: { id: session.adminId },
        });

        if (!admin) {
          throw new UnauthorizedException('Admin account is not active');
        }

        return session.adminId;
      },
      {
        entityName: 'session',
        operation: 'verify',
      },
    );
  }

  /**
   * Invalidates various admin-related caches
   * Groups all cache invalidation logic in one place for consistency
   *
   * @param adminId - Optional specific admin ID to invalidate
   * @private - Internal function for service use only
   */
  private async invalidateCache(adminId?: string): Promise<void> {
    try {
      const cacheDeletions: Promise<void>[] = [];

      // Specific admin cache if ID is provided
      if (adminId) {
        cacheDeletions.push(this.cacheService.delete(cacheKeys.admin(adminId)));
      }

      // Always invalidate list cache
      cacheDeletions.push(this.cacheService.delete('admins:*'));

      // Execute all cache deletions concurrently
      await Promise.all(cacheDeletions);
    } catch (error) {
      this.logger.error('Failed to invalidate admin cache', {
        error: error.message,
      });
    }
  }
}
