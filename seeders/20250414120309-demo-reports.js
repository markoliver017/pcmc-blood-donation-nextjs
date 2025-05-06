//npx sequelize-cli db:seed:all

import { faker } from "@faker-js/faker";

/** @type {import('sequelize-cli').Seeder} */
export async function up(queryInterface) {
    const reports = [];

    const startDate = new Date("2025-01-01");
    const endDate = new Date("2025-12-31");

    for (let i = 0; i < 50; i++) {
        const errorDate = faker.date.between({ from: startDate, to: endDate });

        reports.push({
            report_date: new Date(),
            error_date: errorDate,
            patient_sex: ["male", "female", "unknown"][
                Math.floor(Math.random() * 3)
            ],
            patient_age: parseInt(Math.random() * 50 + 40),
            patient_weight: parseFloat((Math.random() * 50 + 40).toFixed(2)),
            patient_height: parseFloat((Math.random() * 50 + 140).toFixed(2)),
            exact_prescription: faker.lorem.sentence(),
            error_type_id: Math.floor(Math.random() * 12) + 1,
            other_error_type: faker.lorem.sentence(),
            incident_description: faker.lorem.paragraph(),
            workplace_environment: faker.lorem.sentences(2),
            patient_condition: faker.lorem.sentence(),
            immediate_actions: faker.lorem.sentences(2),
            corrective_actions: faker.lorem.sentences(2),
            preventive_actions: faker.lorem.sentences(2),
            is_verified: Math.random() > 0.5,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    await queryInterface.bulkInsert("reports", reports, {});
}

export async function down(queryInterface) {
    await queryInterface.bulkDelete("reports", null, {});
}
