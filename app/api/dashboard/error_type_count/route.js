import { ErrorType, Report } from "@lib/models";
import { NextResponse } from "next/server";
import { Sequelize } from "sequelize";

export async function GET() {
    try {
        // const searchParams = request.nextUrl.searchParams;
        // const Op = Sequelize.Op;
        // const currentYear = new Date().getFullYear();
        // const year = searchParams.get("year") || currentYear;
        // const startDate = `${year}-01-01`;
        // const endDate = `${year}-12-31`;
        // await new Promise((resolve) => setTimeout(resolve, 5000));
        const errorTypeCounts = await ErrorType.findAll({
            attributes: [
                "id",
                "name",
                [Sequelize.fn("COUNT", Sequelize.col("Reports.id")), "count"],
            ],
            include: [
                {
                    model: Report,
                    attributes: [], // exclude report fields
                    // where: {
                    //     error_date: {
                    //         [Op.between]: [startDate, endDate],
                    //     },
                    // },
                    required: false, // <-- this is key! makes it a LEFT JOIN
                },
            ],
            group: ["ErrorType.id", "ErrorType.name"],
            order: [["id", "ASC"]], // optional: sort alphabetically
            raw: true,
        });

        const totalReports = errorTypeCounts.reduce((sum, item) => {
            return sum + parseInt(item.count, 10);
        }, 0);

        return NextResponse.json(
            {
                error: false,
                message: "The reports have been successfully retrieved.",
                total: totalReports,
                data: errorTypeCounts,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                error: true,
                message: "Failed to retrieve reports.",
                data: error,
            },
            { status: 500 }
        );
    }
}
