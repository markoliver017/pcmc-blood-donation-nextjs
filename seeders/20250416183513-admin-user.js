import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

/** @type {import('sequelize-cli').Seeder} */
export async function up(queryInterface) {
    const admins = [];
    const saltRounds = 10;

    for (let i = 0; i < 1; i++) {
        // Generate 50 admin records
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email(firstName, lastName);
        // const password = faker.internet.password(12); // At least 12 characters
        const password = "password"; // At least 12 characters
        const hashedPassword = bcrypt.hashSync(password, saltRounds);

        admins.push({
            first_name: firstName,
            last_name: lastName,
            gender: ["male", "female"][Math.floor(Math.random() * 2)],
            email,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    await queryInterface.bulkInsert("admins", admins, {});
}

export async function down(queryInterface) {
    await queryInterface.bulkDelete("admins", null, {});
}
