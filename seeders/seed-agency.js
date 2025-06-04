import { faker } from "@faker-js/faker";

/** @type {import('sequelize-cli').Seeder} */
export async function up(queryInterface) {
    const agencies = [];

    for (let i = 0; i < 10; i++) {
        agencies.push({
            head_id: [
                "20c5c4fa-c040-473c-9236-0192efed2643",
                "20c5c4fa-c040-473c-9236-0192efed2643",
                "20c5c4fa-c040-473c-9236-0192efed2643",
                "20c5c4fa-c040-473c-9236-0192efed2643",
                "20c5c4fa-c040-473c-9236-0192efed2643",
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
