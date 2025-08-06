import { NextResponse } from "next/server";
import { AuditTrail, User, Role } from "@lib/models";
import { Op } from "sequelize";
import { auth } from "@lib/auth";

export async function GET(request) {
    const session = await auth();
    if (!session || session.user.role_name !== "Admin") {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        const userId = searchParams.get("userId");
        const mod = searchParams.get("module");

        const whereConditions = {};
        if (startDate && endDate) {
            whereConditions.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        } else if (startDate) {
            whereConditions.createdAt = { [Op.gte]: new Date(startDate) };
        } else if (endDate) {
            whereConditions.createdAt = { [Op.lte]: new Date(endDate) };
        }

        if (userId && userId !== "ALL") {
            whereConditions.user_id = userId;
        }

        if (mod && mod !== "ALL") {
            whereConditions.controller = mod;
        }

        const auditTrails = await AuditTrail.findAll({
            where: whereConditions,
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["name"],
                    include: {
                        model: Role,
                        as: "role",
                        attributes: ["name"],
                    },
                },
            ],
            order: [["createdAt", "DESC"]],
            raw: true,
            nest: true,
        });

        return NextResponse.json({ success: true, data: auditTrails });
    } catch (error) {
        console.error("Audit Trail Report Error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "An error occurred while fetching the report data.",
            },
            { status: 500 }
        );
    }
}
