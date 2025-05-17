// npx sequelize-cli db:seed --seed 20250306072542-seed-roles.js
"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
    await queryInterface.bulkInsert(
        "Roles",
        [
            {
                role_name: "Role 1",
                icon: "FaUserLock",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                role_name: "Role 2",
                icon: "User",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                role_name: "Role 3",
                icon: "MdDeveloperMode",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ],
        {}
    );
}

export async function down(queryInterface) {
    await queryInterface.bulkDelete("Roles", null, {});
}
