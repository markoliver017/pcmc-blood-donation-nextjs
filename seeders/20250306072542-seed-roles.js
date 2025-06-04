// npx sequelize-cli db:seed --seed 20250306072542-seed-roles.js
"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
    await queryInterface.bulkInsert(
        "Roles",
        [
            {
                role_name: "Admin",
                icon: "FaUserLock",
                url: "/portal/admin",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                role_name: "Agency Administrator",
                icon: "User",
                url: "/portal/hosts",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                role_name: "Organizer",
                icon: "User",
                url: "/portal/hosts",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                role_name: "Donor",
                icon: "User",
                url: "/portal/donors",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                role_name: "Developer",
                icon: "MdDeveloperMode",
                url: "/portal/admin",
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
