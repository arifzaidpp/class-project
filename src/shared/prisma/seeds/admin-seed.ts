import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../seed-utils';

export async function seedAdmins(prisma: PrismaClient): Promise<void> {
  console.log('Seeding admin user...');

  const existingAdmin = await prisma.admin.findUnique({
    where: { email: 'admin@smartclass.com' },
  });

  if (existingAdmin) {
    console.log('Admin already exists, skipping creation.');
  } else {
    try {
      const adminPassword = await hashPassword('Admin@123');
      const admin = await prisma.admin.create({
        data: {
          email: 'admin@smartclass.com',
          password: adminPassword,
        },
      });
      console.log(`Created admin with email: ${admin.email}`);
    } catch (error) {
      console.error('Error creating admin:', error.message);
      throw new Error('Failed to create admin');
    }
  }

  const totalAdmins = await prisma.admin.count();
  console.log(
    `Admin seeding completed. Total admins in database: ${totalAdmins}`,
  );
}
