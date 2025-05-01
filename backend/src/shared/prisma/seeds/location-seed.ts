import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedLocations(prisma: PrismaClient): Promise<void> {
    console.log('Seeding countries, states, and cities with faker...');

    // Number of countries, states per country, and cities per state
    const numberOfCountries = 5;
    const statesPerCountry = 3;
    const citiesPerState = 4;

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < numberOfCountries; i++) {
        try {
            const countryName = faker.location.country();

            const country = await prisma.country.create({
                data: {
                    name: countryName,
                    states: {
                        create: Array.from({ length: statesPerCountry }).map(() => ({
                            name: faker.location.state(),
                            cities: {
                                create: Array.from({ length: citiesPerState }).map(() => ({
                                    name: faker.location.city(),
                                })),
                            },
                        })),
                    },
                },
            });

            console.log(`Seeded country: ${country.name}`);
            successCount++;
        } catch (error) {
            console.error(`Error seeding country: ${error.message}`);
            errorCount++;
        }
    }

    console.log('Seeding completed.');
    console.log(`Successfully seeded ${successCount} countries. Encountered ${errorCount} errors.`);
}
