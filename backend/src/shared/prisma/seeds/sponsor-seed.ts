import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedSponsors(prisma: PrismaClient): Promise<void> {
    console.log('Seeding sponsors and sponsor items...');

    // Track successful and failed creations
    let sponsorSuccessCount = 0;
    let sponsorItemSuccessCount = 0;
    let contributionSuccessCount = 0;
    let errorCount = 0;

    try {
        // Create sponsor items
        const sponsorItems: Array<{ id: string; itemName: string; price: number; count: number }> = [];
        for (let i = 0; i < 10; i++) {
            const sponsorItem = await prisma.sponsorItem.create({
                data: {
                    itemName: faker.commerce.productName(),
                    price: faker.number.float({ min: 10, max: 500, fractionDigits: 2 }),
                    count: faker.number.int({ min: 1, max: 100 }),
                },
            });
            sponsorItems.push(sponsorItem);
            sponsorItemSuccessCount++;
        }

        // Create sponsors
        const sponsors: Array<{ id: string; name: string; imageLink: string; role: string; place: string }> = [];
        for (let i = 0; i < 5; i++) {
            const sponsor = await prisma.sponsor.create({
                data: {
                    name: faker.company.name(),
                    imageLink: faker.image.avatar(),
                    role: faker.name.jobTitle(),
                    place: faker.location.city(),
                },
            });
            sponsors.push(sponsor);
            sponsorSuccessCount++;
        }

        // Create sponsor contributions
        for (const sponsor of sponsors) {
            const contributionCount = faker.number.int({ min: 1, max: 3 });

            for (let i = 0; i < contributionCount; i++) {
                const randomItem = faker.helpers.arrayElement(sponsorItems);
                const countContributed = faker.number.int({ min: 1, max: randomItem.count });

                await prisma.sponsorContribution.create({
                    data: {
                        sponsorId: sponsor.id,
                        itemId: randomItem.id,
                        countContributed,
                    },
                });

                // Update sponsored count for the sponsor item
                await prisma.sponsorItem.update({
                    where: { id: randomItem.id },
                    data: {
                        sponsoredCount: {
                            increment: countContributed,
                        },
                    },
                });

                contributionSuccessCount++;
            }
        }
    } catch (error) {
        console.error(`Error seeding sponsors or sponsor items: ${error.message}`);
        errorCount++;
    }

    console.log(`Sponsor seeding completed.`);
    console.log(`Created ${sponsorSuccessCount} sponsors.`);
    console.log(`Created ${sponsorItemSuccessCount} sponsor items.`);
    console.log(`Created ${contributionSuccessCount} sponsor contributions.`);
    console.log(`Encountered ${errorCount} errors.`);
}