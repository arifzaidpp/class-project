import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedDevices(prisma: PrismaClient): Promise<void> {
  console.log('Seeding devices...');

  // Create 50 devices
  for (let i = 0; i < 50; i++) {
    const deviceId = faker.string.uuid();
    const deviceType = faker.helpers.arrayElement(['phone', 'tablet', 'laptop']);
    const createdAt = faker.date.past();

    await prisma.device.create({
      data: {
        deviceId,
        deviceType,
        createdAt,
      },
    });

    if (i % 10 === 0) {
      console.log(`Created ${i + 1} devices...`);
    }
  }

  console.log('Device seeding completed successfully');
}
