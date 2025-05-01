import { PrismaClient } from '@prisma/client';

export async function seedAdminSessions(prisma: PrismaClient): Promise<void> {
    console.log('Seeding admin session...');

    const admin = await prisma.admin.findUnique({
        where: { email: 'admin@smartclass.com' },
    });

    if (!admin) {
        console.error('Admin user not found. Please seed the admin first.');
        throw new Error('Admin user not found');
    }

    const existingSession = await prisma.adminSession.findFirst({
        where: { adminId: admin.id },
    });

    if (existingSession) {
        console.log('Admin session already exists, skipping creation.');
    } else {
        try {
            const session = await prisma.adminSession.create({
                data: {
                    adminId: admin.id,
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours from now
                    ipAddress: '127.0.0.1',
                    deviceId: 'device-12345',
                    loginMethod: 'password',
                    lastActiveAt: new Date(),
                },
            });
            console.log(`Created admin session with ID: ${session.id}`);
        } catch (error) {
            console.error('Error creating admin session:', error.message);
            throw new Error('Failed to create admin session');
        }
    }

    const totalSessions = await prisma.adminSession.count();
    console.log(
        `Admin session seeding completed. Total sessions in database: ${totalSessions}`,
    );
}
