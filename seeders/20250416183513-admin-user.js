//npx sequelize-cli db:seed --seed 20250416183513-admin-user.js

import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

/** @type {import('sequelize-cli').Seeder} */
export async function up(queryInterface) {
    const users = [];
    const saltRounds = 10;

    for (let i = 0; i < 1; i++) {
        // Generate 50 admin records
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email(firstName);
        // const password = faker.internet.password(12); // At least 12 characters
        const password = "password"; // At least 12 characters
        const hashedPassword = bcrypt.hashSync(password, saltRounds);

        users.push({
            id: faker.string.uuid(),
            role_id: 2,
            name: firstName + " " + lastName,
            first_name: firstName,
            last_name: lastName,
            gender: ["male", "female", "unknown"][
                Math.floor(Math.random() * 3)
            ],
            email,
            password: hashedPassword,
            // createdAt: new Date(),
            // updatedAt: new Date(),
        });
    }

    await queryInterface.bulkInsert("users", users, {});
}

export async function down(queryInterface) {
    await queryInterface.bulkDelete("users", null, {});
}
