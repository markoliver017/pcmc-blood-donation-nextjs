import { send_mail } from "@lib/mail.utils";
import { ReportRequest } from "@lib/models";
import { requestSchema } from "@lib/zod/requestSchema";

import { NextResponse } from "next/server";
import { Sequelize } from "sequelize";

import { promises as fs } from 'fs';
import path from 'path';


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
        const requests = await ReportRequest.findAll({
            where: {
                request_date: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate,
                },
            },
            order: [["createdAt", "DESC"]]
        });

        return NextResponse.json({ success: true, requests }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                error: true,
                message: "Failed to retrieve request.",
                details: error,
            },
            { status: 500 }
        );
    }
}

// POST handler for report submission
export async function POST(request) {
    try {
        const body = await request.json(); // Parse the request body
        // delete body.error_type_id;

        const validationResult = requestSchema.safeParse(body);
        console.log("zod validation validationResult", validationResult);

        const error = new Error("Validation failed");
        if (!validationResult.success) {
            const fieldErrors = validationResult?.error?.flatten().fieldErrors;
            const messages = Object.values(fieldErrors).flat();
            error.name = "ZodValidationError";
            error.errors = messages;
            throw error;
        }

        const newRequest = await ReportRequest.create(validationResult.data);

        console.log("newRequest>>>>>>>>>>>>>>>>>", newRequest);

        if (!newRequest) {
            return NextResponse.json(
                { success: false, message: "Failed to create request." },
                { status: 500 }
            );
        }

        const { email } = body;
        const subject = "INMERS Data Request Acknowledgment";
        const text = await getAcknowledgeText();
        const html = await getAcknowledgeHtml();
        const emailStatus = await send_mail(email, subject, text, html);


        return NextResponse.json(
            { success: true, report: newRequest, email: emailStatus },
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
            { error: true, message: "Failed to submit request." },
            { status: 500 }
        );
    }
}


async function getAcknowledgeText() {
    const filePath = path.join(process.cwd(), 'public', 'acknowledge.txt');

    return await fs.readFile(filePath, 'utf-8');
}

async function getAcknowledgeHtml() {
    const filePath = path.join(process.cwd(), 'public', 'acknowledge-email.html');

    return await fs.readFile(filePath, 'utf-8');
}
