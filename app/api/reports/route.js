import {
    ErrorType,
    GenericMedicine,
    Report,
    ReportMedicineRoute,
    RouteMedicine,
} from "@lib/models";
import { createReportsSchema } from "@lib/zod/reportSchema";
import { NextResponse } from "next/server";
import { Sequelize } from "sequelize";

export async function GET(request) {
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    const Op = Sequelize.Op;
    const searchParams = request.nextUrl.searchParams;
    const start_date = searchParams.get("start_date");
    const end_date = searchParams.get("end_date");

    const currentDate = new Date();
    const defaultStartDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    );
    const defaultEndDate = currentDate;

    const startDate = start_date ? new Date(start_date) : defaultStartDate;
    const endDate = end_date ? new Date(end_date) : defaultEndDate;

    console.log("end_date", end_date);
    console.log("defaultStartDate", defaultStartDate);
    console.log("startDate", startDate);
    console.log("endDate", endDate);

    try {
        const reports = await Report.findAll({
            where: {
                error_date: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate,
                },
            },
            order: [["createdAt", "DESC"]],
            include: [
                {
                    attributes: ["id", "name", "is_medicine_needed"],
                    model: ErrorType,
                    as: "error_type",
                    required: false,
                },
                {
                    attributes: ["id"],
                    model: ReportMedicineRoute,
                    include: [
                        { model: GenericMedicine, attributes: ["name"] },
                        { model: RouteMedicine, attributes: ["name"] },
                    ],
                },
            ],
        });

        return NextResponse.json({ success: true, reports }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                error: true,
                message: "Failed to retrieve reports.",
                details: error,
            },
            { status: 500 }
        );
    }
}

// POST handler for report submission
export async function POST(request) {
    try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const body = await request.json(); // Parse the request body
        // delete body.error_type_id;

        const validationResult = createReportsSchema.safeParse(body);
        console.log("zod validation validationResult", validationResult);

        const error = new Error("Validation failed");
        if (!validationResult.success) {
            const fieldErrors = validationResult?.error?.flatten().fieldErrors;
            const messages = Object.values(fieldErrors).flat();
            error.name = "ZodValidationError";
            error.errors = messages;
            throw error;
        }

        const { medicines, selected_error_type } = validationResult.data;
        if (selected_error_type?.is_medicine_needed && !medicines?.length) {
            error.name = "ZodValidationError";
            error.errors = [
                "Medicines are required when error type is selected.",
            ];
            throw error;
        }

        const newReport = await Report.create(validationResult.data);
        if (selected_error_type?.is_medicine_needed) {
            const reportMedicineRoute = medicines.map((med) => ({
                generic_medicine_id: med.medicine_generic_id,
                route_medicine_id: med.medicine_route_id,
                report_id: newReport.id,
            }));
            await ReportMedicineRoute.bulkCreate(reportMedicineRoute);
        }

        await newReport.reload({
            include: [
                {
                    model: ReportMedicineRoute,
                    attributes: ["id"],
                    include: [
                        { model: GenericMedicine, attributes: ["name"] },
                        { model: RouteMedicine, attributes: ["name"] },
                    ],
                },
            ],
        });

        console.log("newReport>>>>>>>>>>>>>>>>>", newReport);

        return NextResponse.json(
            { success: true, report: newReport },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error handling report submission:", error);

        // Handle Sequelize validation errors
        if (
            error.name === "SequelizeValidationError" ||
            error.name === "SequelizeUniqueConstraintError"
        ) {
            const validationErrors = error.errors.map((err) => {
                if (error.name === "SequelizeUniqueConstraintError") {
                    return `${err.path} already exists!`;
                } else {
                    return err.message;
                }
            });

            return NextResponse.json(
                {
                    error: true,
                    message: "Validation failed",
                    details: validationErrors,
                },
                { status: 400 }
            );
        }

        if (error.name === "ZodValidationError") {
            return NextResponse.json(
                {
                    error: true,
                    message: "Validation failed",
                    details: error.errors,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: true, message: "Failed to submit report." },
            { status: 500 }
        );
    }
}

// const validationErrors = error.errors.reduce((acc, err) => {
//     if (error.name === "SequelizeUniqueConstraintError") {
//         acc[err.path] = `${err.path} already exists!`;
//     } else {
//         acc[err.path] = err.message;
//     }
//     return acc;
// }, {});
