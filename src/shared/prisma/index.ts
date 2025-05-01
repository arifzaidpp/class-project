/**
 * Main seeder coordinator file
 * Imports and runs all seeders in the correct order to handle dependencies
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { seedAdmins } from './seeds/admin-seed';
import { cleanDatabase } from './cleanup';
import { seedDevices } from './seeds/device-seed';
import { seedDonations } from './seeds/donation-seed';
import { seedLocations } from './seeds/location-seed';
import { seedSponsors } from './seeds/sponsor-seed';

dotenv.config();

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export async function seedAll() {
  console.log('🌱 Starting database seeding...');

  // Clean the database before seeding (if needed)
  if (process.env.CLEAN_DB === 'true') {
    console.log('Cleaning existing database records...');
    await cleanDatabase(prisma);
  }

  // Seed static data
  console.log('Seeding static data...');

  // Seed admin
  console.log('Seeding admins...');
  await seedAdmins(prisma);
  
  // Seed devices
  console.log('Seeding devices...');
  await seedDevices(prisma);

  // Seed donations
  console.log('Seeding donations...');
  await seedDonations(prisma);

  // Seed locations
  console.log('Seeding locations...');
  await seedLocations(prisma);

  // Seeed sponsors
  console.log('Seeding sponsors...');
  await seedSponsors(prisma);

  console.log('Database seeding completed successfully!');
}