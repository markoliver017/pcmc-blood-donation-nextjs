import { NextResponse } from "next/server";
import { sequelize } from "@lib/models";
import jwt from "jsonwebtoken";

export async function POST(request) {
    try {
        const { email, password, firstName, lastName, middleName, gender } = await request.json();

        // Validation
        if (!email || !password || !firstName || !lastName) {
            return NextResponse.json(
                { error: "Required fields: email, password, firstName, lastName" },
                { status: 400 }
            );
        }

        const models = sequelize.models;
        const { user } = models;

        // Check if user already exists
        const existingUser = await user.findOne({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 409 }
            );
        }

        // Create new user
        const fullName = `${firstName} ${middleName || ''} ${lastName}`.trim();
        const newUser = await user.create({
            email,
            password, // Assuming your model has a beforeCreate hook to hash password
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            full_name: fullName,
            name: fullName,
            gender,
            is_active: true,
        });

        // Assign default donor role (adjust role_id as needed)
        // You may need to find the donor role first
        const donorRole = await sequelize.models.Role.findOne({
            where: { role_name: "Donor" } // Adjust based on your role naming
        });

        if (donorRole) {
            await sequelize.models.UserRole.create({
                user_id: newUser.id,
                role_id: donorRole.id,
                is_active: true,
            });
        }

        // Fetch user with roles
        const createdUser = await user.findOne({
            where: { id: newUser.id },
            attributes: [
                "id",
                "image",
                "email",
                "name",
                "first_name",
                "middle_name",
                "last_name",
                "full_name",
                "gender",
            ],
            include: [
                {
                    model: sequelize.models.Role,
                    attributes: ["id", "role_name", "icon", "url"],
                    as: "roles",
                    through: {
                        attributes: ["is_active"],
                        as: "role",
                    },
                },
            ],
        });

        // Prepare user data
        const userData = {
            id: createdUser.id,
            name: createdUser?.name || createdUser?.full_name,
            email: createdUser.email,
            image: createdUser.image,
            gender: createdUser.gender,
            roles: createdUser.roles,
            role_name: createdUser.roles.length === 1 ? createdUser.roles[0].role_name : "",
        };

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: createdUser.id,
                email: createdUser.email,
            },
            process.env.AUTH_SECRET,
            { expiresIn: "7d" }
        );

        return NextResponse.json({
            success: true,
            token,
            user: userData,
        }, { status: 201 });
    } catch (error) {
        console.error("Mobile registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
