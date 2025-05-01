import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export enum DonationStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
}

export async function seedDonations(prisma: PrismaClient): Promise<void> {
  console.log('Seeding donations...');

  // Get devices
  const devices = await prisma.device.findMany();
  if (devices.length === 0) {
    throw new Error('No devices found. Make sure to seed devices first.');
  }

  console.log(`Found ${devices.length} devices`);

  // Donation statuses with distribution
  const statuses = [
    { status: DonationStatus.DRAFT, weight: 0.2 },    // 20% draft
    { status: DonationStatus.PENDING, weight: 0.3 },  // 30% pending
    { status: DonationStatus.CONFIRMED, weight: 0.5 } // 50% confirmed
  ];

  // Track successful and failed creations
  let successCount = 0;
  let errorCount = 0;

  // Create donations
  for (const device of devices) {
    try {
      const donationCount = faker.number.int({ min: 1, max: 5 });

      for (let i = 0; i < donationCount; i++) {
        // Determine donation status with weighted random
        const statusRandom = Math.random();
        let cumulativeWeight = 0;
        let status = DonationStatus.DRAFT;

        for (const statusOption of statuses) {
          cumulativeWeight += statusOption.weight;
          if (statusRandom < cumulativeWeight) {
            status = statusOption.status;
            break;
          }
        }

        // Create donation
        await prisma.donation.create({
          data: {
            deviceId: device.deviceId,
            name: faker.person.fullName(),
            phoneNumber: faker.string.numeric(10),
            amount: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
            countryName: faker.location.country(),
            stateName: faker.location.state(),
            cityName: faker.location.city(),
            pincode: faker.location.zipCode(),
            screenshotLink: faker.helpers.maybe(() => faker.internet.url(), { probability: 0.3 }),
            status,
          },
        });

        successCount++;
      }
    } catch (error) {
      console.error(`Error creating donation for device ${device.deviceId}: ${error.message}`);
      errorCount++;
    }
  }

  const finalDonationCount = await prisma.donation.count();

  console.log(`Donation seeding completed.`);
  console.log(`Created ${successCount} donations. Encountered ${errorCount} errors.`);
  console.log(`Total donations in database: ${finalDonationCount}`);
}
