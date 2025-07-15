//npx sequelize-cli db:seed --seed 202507152025-admin-production.js

import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

/** @type {import('sequelize-cli').Seeder} */
export async function up(queryInterface, Sequelize) {
    const [adminRole] = await queryInterface.sequelize.query(
        `SELECT id FROM roles WHERE role_name = 'Admin' LIMIT 1`,
        { type: Sequelize.QueryTypes.SELECT }
    );

    if (!adminRole) {
        throw new Error(
            "Agency Administrator role not found. Please run role seeders first."
        );
    }

    const users = [];
    const userRoles = [];
    const saltRounds = 10;

    const userId = faker.string.uuid();
    const firstName = "Juan";
    const lastName = "Dela Cruz";
    const email = "admin@email.com";
    const password = "User@1234"; // At least 12 characters
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    users.push({
        id: userId,
        name: firstName + " " + lastName,
        first_name: firstName,
        last_name: lastName,
        gender: ["male", "female"][Math.floor(Math.random() * 3)],
        email,
        password: hashedPassword,
    });
    userRoles.push({
        user_id: userId,
        role_id: adminRole.id,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    await queryInterface.bulkInsert("users", users, {});
    await queryInterface.bulkInsert("user_roles", userRoles, {});
}

export async function down(queryInterface) {
    await queryInterface.bulkDelete("users", null, {});
}
