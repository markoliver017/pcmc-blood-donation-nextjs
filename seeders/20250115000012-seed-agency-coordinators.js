// npx sequelize-cli db:seed --seed 20250115000012-seed-agency-coordinators.js
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

/** @type {import('sequelize-cli').Seeder} */
export async function up(queryInterface, Sequelize) {
    // First, get all active agencies
    const activeAgencies = await queryInterface.sequelize.query(
        `SELECT id FROM agencies WHERE status = 'activated'`,
        {
            type: Sequelize.QueryTypes.SELECT,
        }
    );

    if (activeAgencies.length === 0) {
        console.log(
            "No active agencies found. Please run agency seeders first and ensure some agencies are activated."
        );
        return;
    }

    // Get the Organizer role
    const [organizerRole] = await queryInterface.sequelize.query(
        `SELECT id FROM roles WHERE role_name = 'Organizer' LIMIT 1`,
        { type: Sequelize.QueryTypes.SELECT }
    );

    if (!organizerRole) {
        throw new Error(
            "Organizer role not found. Please run role seeders first."
        );
    }

    // Create coordinator users first
    const coordinatorUsers = [];
    const userRoles = [];
    const numberOfCoordinators = Math.min(activeAgencies.length * 2, 20); // 2 coordinators per agency, max 20

    for (let i = 0; i < numberOfCoordinators; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const userId = faker.string.uuid();

        coordinatorUsers.push({
            id: userId,
            email: faker.internet.email({ firstName, lastName }),
            password: bcrypt.hashSync("Password123!", 10),
            first_name: firstName,
            last_name: lastName,
            gender: faker.helpers.arrayElement(["male", "female"]),
            is_active: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Prepare user role associations
        userRoles.push({
            user_id: userId,
            role_id: organizerRole.id,
            is_active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    // Insert the coordinator users
    await queryInterface.bulkInsert("users", coordinatorUsers, {});

    // Create user role associations after users exist
    await queryInterface.bulkInsert("user_roles", userRoles, {});

    // Create agency coordinators linking to random active agencies
    const agencyCoordinators = [];

    for (let i = 0; i < numberOfCoordinators; i++) {
        // Randomly select an agency
        const randomAgency =
            activeAgencies[Math.floor(Math.random() * activeAgencies.length)];

        agencyCoordinators.push({
            agency_id: randomAgency.id,
            user_id: coordinatorUsers[i].id,
            contact_number: faker.helpers.arrayElement([
                // Mobile number format
                `9${faker.string.numeric(9)}`,
                // Landline format (Metro Manila)
                `2${faker.string.numeric(7)}`,
                // Provincial landline
                `${faker.number.int({ min: 3, max: 8 })}${faker.string.numeric(
                    6
                )}`,
            ]),
            status: "for approval",
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    // Insert the agency coordinators
    await queryInterface.bulkInsert(
        "agency_coordinators",
        agencyCoordinators,
        {}
    );
}

export async function down(queryInterface) {
    // Get the user IDs before deleting
    const userIds = (
        await queryInterface.sequelize.query(
            "SELECT user_id FROM agency_coordinators",
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        )
    ).map((row) => row.user_id);

    // Delete in reverse order of creation
    await queryInterface.bulkDelete("agency_coordinators", null, {});

    if (userIds.length > 0) {
        // Delete user roles
        await queryInterface.bulkDelete(
            "user_roles",
            {
                user_id: {
                    [queryInterface.sequelize.Op.in]: userIds,
                },
            },
            {}
        );

        // Delete users
        await queryInterface.bulkDelete(
            "users",
            {
                id: {
                    [queryInterface.sequelize.Op.in]: userIds,
                },
            },
            {}
        );
    }
}
