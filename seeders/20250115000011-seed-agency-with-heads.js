// npx sequelize-cli db:seed --seed 20250115000011-seed-agency-with-heads.js
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

/** @type {import('sequelize-cli').Seeder} */
export async function up(queryInterface, Sequelize) {
    // First, get or create the Agency Administrator role
    const [adminRole] = await queryInterface.sequelize.query(
        `SELECT id FROM roles WHERE role_name = 'Agency Administrator' LIMIT 1`,
        { type: Sequelize.QueryTypes.SELECT }
    );

    if (!adminRole) {
        throw new Error(
            "Agency Administrator role not found. Please run role seeders first."
        );
    }

    // Create agency heads
    const agencyHeads = [];
    const userRoles = [];
    const numberOfAgencies = 10;

    for (let i = 0; i < numberOfAgencies; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const userId = faker.string.uuid();

        agencyHeads.push({
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
            role_id: adminRole.id,
            is_active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    // Insert the agency heads into the users table
    await queryInterface.bulkInsert("users", agencyHeads, {});

    // Create user role associations after users exist
    await queryInterface.bulkInsert("user_roles", userRoles, {});

    // Now create agencies with the newly created users as heads
    const agencies = [];

    for (let i = 0; i < numberOfAgencies; i++) {
        agencies.push({
            head_id: agencyHeads[i].id,
            name: faker.company.name(),
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
            address: faker.location.streetAddress(),
            barangay: faker.location.street(),
            city_municipality: faker.location.city(),
            province: "Metro Manila",
            region: "luzon",
            organization_type: faker.helpers.arrayElement([
                "business",
                "media",
                "government",
                "church",
                "education",
                "healthcare",
            ]),
            status: "for approval",
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    // Insert the agencies
    await queryInterface.bulkInsert("agencies", agencies, {});
}

export async function down(queryInterface) {
    // Delete in reverse order of creation
    await queryInterface.bulkDelete("agencies", null, {});

    // Get the user IDs before deleting them
    const userIds = (
        await queryInterface.sequelize.query(
            "SELECT id FROM users WHERE id IN (SELECT head_id FROM agencies)",
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        )
    ).map((user) => user.id);

    // Delete user roles
    if (userIds.length > 0) {
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
