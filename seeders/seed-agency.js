import { faker } from "@faker-js/faker";

/** @type {import('sequelize-cli').Seeder} */
export async function up(queryInterface) {
    const agencies = [];

    for (let i = 0; i < 10; i++) {
        agencies.push({
            head_id: [
                "14abe03d-b9f8-4076-a36f-9d595fd84138",
                "fb607157-b1dc-42e2-b832-16085ef72c01",
                "617cdcec-5323-4ded-9e75-0f6c06450d4e",
                "25401ede-1454-4b8d-bffe-b171354bfc08",
                "7cba8734-4827-4729-80b4-182fcd1b7afc",
                "a6cd4d3e-183f-4c5f-9339-e6b729ab4a19"
            ][Math.floor(Math.random() * 6)], // Assuming you have users with UUIDs
            name: faker.company.name(),
            contact_number: faker.phone.number("##########"),
            address: faker.location.streetAddress(),
            barangay: faker.location.street(),
            city_municipality: faker.location.city(),
            province: "Metro Manila",
            region: "luzon",
            organization_type: [
                "business",
                "media",
                "government",
                "church",
                "education",
                "healthcare",
            ][Math.floor(Math.random() * 6)],
            status: "for approval",
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    await queryInterface.bulkInsert("agencies", agencies, {});
}

export async function down(queryInterface) {
    await queryInterface.bulkDelete("agencies", null, {});
}