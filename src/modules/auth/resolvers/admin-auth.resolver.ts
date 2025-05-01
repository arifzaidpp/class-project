import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AdminAuthService } from '../services/admin-auth.service';
import { Admin } from '../models/admin.model';
import { AdminAuthGuard } from 'src/common/guards/admin-auth.guard';
import { CurrentAdmin } from 'src/common/decorators/current-admin.decorator';
import { AdminLoginDto } from '../dto/admin/admin-login.input';
import { SuccessResponse } from 'src/common/models/pagination.model';
import { ChangePasswordInput } from '../dto/change-password.input';

@Resolver()
export class AdminAuthResolver {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Mutation(() => Admin)
  async adminLogin(
    @Args('input') input: AdminLoginDto,
    @Context() context: { req: Request; res: Response },
  ): Promise<Admin> {
    return this.adminAuthService.adminLogin(input, context.req, context.res)
  }

  @Mutation(() => SuccessResponse)
  @UseGuards(AdminAuthGuard)
  async adminLogout(
    @Context() context: { req: Request; res: Response },
  ): Promise<SuccessResponse> {
    // Get sessionId from the cookies
    const sessionId = context.req.cookies.adminSessionId;
    // This would need to be implemented in AdminAuthService similarly to the user logout
    return { success: true };
  }

  @Mutation(() => SuccessResponse)
  @UseGuards(AdminAuthGuard)
  async changeAdminPassword(
    @Args('input') input: ChangePasswordInput,
    @CurrentAdmin() admin: Admin,
  ): Promise<SuccessResponse> {
    return this.adminAuthService.changePassword(admin.id, input);
  }

  @Query(() => Admin)
  @UseGuards(AdminAuthGuard)
  async adminMe(@CurrentAdmin() admin: Admin): Promise<Admin> {
    return this.adminAuthService.me(admin.id);
  }
}