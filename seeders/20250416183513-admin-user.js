//npx sequelize-cli db:seed --seed 20250416183513-admin-user.js

import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

/** @type {import('sequelize-cli').Seeder} */
export async function up(queryInterface) {
    const users = [];
    const saltRounds = 10;

    for (let i = 0; i < 3; i++) {
        // Generate 50 admin records
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email(firstName);
        // const password = faker.internet.password(12); // At least 12 characters
        const password = "User@1234"; // At least 12 characters
        const hashedPassword = bcrypt.hashSync(password, saltRounds);

        users.push({
            id: faker.string.uuid(),
            name: firstName + " " + lastName,
            first_name: firstName,
            last_name: lastName,
            gender: ["male", "female"][Math.floor(Math.random() * 3)],
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
