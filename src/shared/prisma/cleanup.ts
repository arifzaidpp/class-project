import { PrismaClient } from '@prisma/client';

export async function cleanDatabase(prisma: PrismaClient): Promise<void> {
  const tableOrder = [
    // Auth schema
    // { schema: 'auth_schema', table: 'admins' },
  ];

  console.log('Starting database cleanup...');

  for (const { schema, table } of tableOrder) {
    try {
      // Using raw SQL for more control
      const query = `TRUNCATE TABLE "${schema}"."${table}" CASCADE;`;
      await prisma.$executeRawUnsafe(query);
      console.log(`Cleaned ${schema}.${table}`);
    } catch (error) {
      console.error(`Error cleaning ${schema}.${table}:`, error);
    }
  }

  console.log('Database cleanup completed');
}