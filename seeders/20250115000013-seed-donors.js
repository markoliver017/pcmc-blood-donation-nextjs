// npx sequelize-cli db:seed --seed 20250115000013-seed-donors
import { faker } from "@faker-js/faker";
import { Donor } from "../lib/models/index.js";
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

    // Get all blood types
    const bloodTypes = await queryInterface.sequelize.query(
        `SELECT id FROM blood_types`,
        {
            type: Sequelize.QueryTypes.SELECT,
        }
    );

    if (bloodTypes.length === 0) {
        throw new Error(
            "No blood types found. Please run blood type seeders first."
        );
    }

    // Get the Donor role
    const [donorRole] = await queryInterface.sequelize.query(
        `SELECT id FROM roles WHERE role_name = 'Donor' LIMIT 1`,
        {
            type: Sequelize.QueryTypes.SELECT,
        }
    );

    if (!donorRole) {
        throw new Error("Donor role not found. Please run role seeders first.");
    }

    // Create donor users first
    const donorUsers = [];
    const userRoles = [];
    const numberOfDonors = 1; // Create 10 donors

    for (let i = 0; i < numberOfDonors; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const userId = faker.string.uuid();

        donorUsers.push({
            id: userId,
            email: faker.internet.email({ firstName, lastName }),
            password: bcrypt.hashSync("Password123!", 10),
            name: firstName + " " + lastName,
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
            role_id: donorRole.id,
            is_active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    // Insert the donor users
    await queryInterface.bulkInsert("users", donorUsers, {});

    // Create user role associations
    await queryInterface.bulkInsert("user_roles", userRoles, {});

    // Create donor records linking to random active agencies and blood types
    const donors = [];

    for (let i = 0; i < numberOfDonors; i++) {
        // Randomly select an agency and blood type
        const randomAgency =
            activeAgencies[Math.floor(Math.random() * activeAgencies.length)];
        const randomBloodType =
            bloodTypes[Math.floor(Math.random() * bloodTypes.length)];

        // Calculate a random past date for date_of_birth (18-65 years old)
        const today = new Date();
        const minAge = 18;
        const maxAge = 65;
        const birthDate = new Date(
            today.getFullYear() -
                faker.number.int({ min: minAge, max: maxAge }),
            faker.number.int({ min: 0, max: 11 }),
            faker.number.int({ min: 1, max: 28 })
        );

        // For regular donors, calculate a random past donation date
        const isRegularDonor = faker.datatype.boolean();
        let lastDonationDate = null;
        if (isRegularDonor) {
            const threeMonthsAgo = new Date(
                today.getTime() - 90 * 24 * 60 * 60 * 1000
            );
            lastDonationDate = faker.date
                .between({ from: threeMonthsAgo, to: today })
                .toISOString()
                .split("T")[0];
        }

        donors.push({
            agency_id: randomAgency.id,
            user_id: donorUsers[i].id,
            blood_type_id: randomBloodType.id,
            date_of_birth: birthDate,
            address: faker.location.streetAddress(),
            barangay: faker.location.street(),
            city_municipality: faker.location.city(),
            province: "Metro Manila",
            region: "luzon",
            civil_status: faker.helpers.arrayElement([
                "single",
                "married",
                "divorced",
                "separated",
                "widowed",
            ]),
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
            nationality: "Filipino",
            occupation: faker.person.jobTitle(),
            is_regular_donor: isRegularDonor,
            donation_history_donation_date: lastDonationDate,
            blood_service_facility: isRegularDonor
                ? faker.helpers.arrayElement([
                      "Philippine Red Cross",
                      "St. Luke's Medical Center",
                      "Philippine Blood Center",
                      "National Kidney and Transplant Institute",
                  ])
                : null,
            status: "for approval",
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    // Insert the donors
    for (const donorData of donors) {
        await Donor.create(donorData);
    }
    // await queryInterface.bulkInsert("donors", donors, {});
}

export async function down(queryInterface) {
    // Get the user IDs before deleting
    const userIds = (
        await queryInterface.sequelize.query("SELECT user_id FROM donors", {
            type: queryInterface.sequelize.QueryTypes.SELECT,
        })
    ).map((row) => row.user_id);

    // Delete in reverse order of creation
    await queryInterface.bulkDelete("donors", null, {});

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
