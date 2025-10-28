import { NextResponse } from "next/server";
import { sequelize } from "@lib/models";
import jwt from "jsonwebtoken";

export async function POST(request) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json(
                { error: "Token is required" },
                { status: 400 }
            );
        }

        // Verify JWT token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.AUTH_SECRET);
        } catch {
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 401 }
            );
        }

        const models = sequelize.models;
        const { user } = models;

        // Fetch fresh user data
        const foundUser = await user.findOne({
            where: {
                id: decoded.userId,
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
                { error: "User not found" },
                { status: 404 }
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
            role_name: foundUser.roles.length === 1 ? foundUser.roles[0].role_name : "",
        };

        return NextResponse.json({
            success: true,
            user: userData,
        });
    } catch (error) {
        console.error("Token verification error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
