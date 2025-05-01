/**
 * Primary entry point for Prisma seeding
 * This file is called directly by Prisma when running `npx prisma db seed`
 */

import { seedAll } from './index';

// Run all seeders
seedAll()
  .then(() => {
    console.log('🚀 Database seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database seeding failed:', error);
    process.exit(1);
  });