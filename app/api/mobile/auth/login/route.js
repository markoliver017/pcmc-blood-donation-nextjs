import { NextResponse } from "next/server";
import { sequelize } from "@lib/models";
import jwt from "jsonwebtoken";

export async function POST(request) {
    console.log("Mobile login request received");
    try {
        const { email, password } = await request.json();
        console.log("Mobile login credentials", email, password);

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const models = sequelize.models;
        const { user } = models;

        // Find user with roles
        const foundUser = await user.findOne({
            where: {
                email,
                is_active: true,
            },
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
                "password",
            ],
            include: [
                {
                    model: sequelize.models.Role,
                    attributes: ["id", "role_name", "icon", "url"],
                    as: "roles",
                    through: {
                        where: { is_active: true },
                        attributes: ["is_active"],
                        as: "role",
                    },
                },
            ],
        });

        if (!foundUser) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Validate password
        const isValid = await foundUser.validPassword(password);

        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Check if user has roles
        if (!foundUser?.roles?.length) {
            return NextResponse.json(
                { error: "No user role found" },
                { status: 403 }
            );
        }

        // Prepare user data
        const userData = {
            id: foundUser.id,
            name: foundUser?.name || foundUser?.full_name,
            email: foundUser.email,
            image: foundUser.image,
            gender: foundUser.gender,
            roles: foundUser.roles,
            role_name:
                foundUser.roles.length === 1
                    ? foundUser.roles[0].role_name
                    : "",
        };

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: foundUser.id,
                email: foundUser.email,
            },
            process.env.AUTH_SECRET,
            { expiresIn: "7d" } // Token expires in 7 days
        );

        return NextResponse.json({
            success: true,
            token,
            user: userData,
        });
    } catch (error) {
        console.error("Mobile login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
