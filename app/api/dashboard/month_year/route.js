import { Report } from "@lib/models";
import { NextResponse } from "next/server";
import { Sequelize } from "sequelize";

export async function GET(request) {
    try {
        // await new Promise((resolve) => setTimeout(resolve, 3000));

        const Op = Sequelize.Op;
        const searchParams = request.nextUrl.searchParams;
        const currentYear = new Date().getFullYear();
        const year = searchParams.get("year") || currentYear;
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;

        const monthlyReportCounts = await Report.findAll({
            where: {
                error_date: {
                    [Op.between]: [startDate, endDate],
                },
            },
            attributes: [
                [Sequelize.literal("MONTHNAME(error_date)"), "month"],
                [Sequelize.literal("MONTH(error_date)"), "month_num"],
                [Sequelize.fn("COUNT", Sequelize.col("error_date")), "count"],
            ],
            group: ["month", "month_num"],
            order: [[Sequelize.literal("month_num"), "ASC"]],
        });

        // console.log(
        //     "monthlyReportCountsmonthlyReportCounts",
        //     monthlyReportCounts
        // );

        const totalReports = monthlyReportCounts.reduce(
            (sum, item) => sum + parseInt(item.dataValues.count, 10),
            0
        );

        return NextResponse.json(
            {
                error: false,
                message: "The reports have been successfully retrieved.",
                total: totalReports,
                data: monthlyReportCounts,
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
