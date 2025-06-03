import { faker } from "@faker-js/faker";

/** @type {import('sequelize-cli').Seeder} */
export async function up(queryInterface) {
    const agencies = [];

    for (let i = 0; i < 10; i++) {
        agencies.push({
            head_id: [
                "7838dca3-13bd-41f0-9bf1-ef6707436ea2",
                "207ac622-41c8-4f4d-948d-419bd6c0a795",
                "62e044f9-97b9-42e0-b1f9-504f0530713f",
                "806e519a-8b1d-4176-854a-68394bd84d09",
                "b10b971a-ad59-4cc0-bde2-65136c3c37ac",
            ][Math.floor(Math.random() * 5)], // Assuming you have users with UUIDs
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
