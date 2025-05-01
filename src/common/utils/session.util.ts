import { PrismaClient } from '@prisma/client';

/**
 * Create a new admin session
 */
export const createAdminSession = async (
  prisma: PrismaClient,
  adminId: string,
  ipAddress?: string,
  deviceId?: string,
): Promise<string> => {
  const session = await prisma.adminSession.create({
    data: {
      adminId,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      ipAddress,
      deviceId,
    },
  });
  
  return session.id;
};

/**
 * Invalidate an admin session
 */
export const invalidateAdminSession = async (
  prisma: PrismaClient,
  sessionId: string,
): Promise<void> => {
  await prisma.adminSession.update({
    where: { id: sessionId },
    data: { expires: new Date() },
  });
};