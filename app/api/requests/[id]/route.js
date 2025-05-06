import { send_mail } from "@lib/mail.utils";
import {
    ErrorType,
    GenericMedicine,
    Report,
    ReportMedicineRoute,
    ReportRequest,
    RouteMedicine,
} from "@lib/models";

import { NextResponse } from "next/server";

import { promises as fs } from "fs";
import path from "path";
import { auth } from "@lib/auth";

import { generate_pdf } from "@lib/generate.utils";
import { getMedicationErrorReportHtml } from "@lib/pdf-html-template/getPdfHtmlTemplate";

export async function PUT(request, { params }) {
    const { id } = await params;
    const body = await request.json(); // Parse the request body
    const token = await auth();

    try {
        if (!body.status && !id) {
            const error = new Error("Validation failed");
            error.name = "ZodValidationError";
            error.errors = ["Request ID && Status is required."];
            throw error;
        }

        const { status } = body;

        const reportRequest = await ReportRequest.findByPk(id);

        if (!reportRequest) {
            throw { message: "Database Error: Request not found" };
        }

        if (!token) {
            throw {
                message:
                    "Server Error: You are not authorized to access this request",
            };
        }

        const { user } = token;

        const updatedRequest = await reportRequest.update({
            status: status,
            approved_by: user.id,
        });

        if (!updatedRequest) {
            throw {
                message:
                    "Database Error: There was an error while trying to update the request.",
            };
        }

        let emailStatus = {
            success: false,
            message: "No Sent Email",
        };

        if (status == "approved") {
            const reports = await Report.findAll({
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

            const rawReports = JSON.parse(JSON.stringify(reports));

            const subject = "INMERS Data Request Notification";
            const text = "";
            const html = await getAcknowledgeHtml();
            const attachFiles = [
                {
                    filename: "INMERS-reports.pdf",
                    content: await generate_pdf(
                        getMedicationErrorReportHtml(
                            rawReports,
                            "Overall Medication Error Summary Report"
                        )
                    ),
                    contentType: "application/pdf",
                },
            ];

            emailStatus = await send_mail(
                reportRequest.email,
                subject,
                text,
                html,
                attachFiles
            );
        }
        if (status == "rejected") {
            const subject = "INMERS Data Request Update";
            const text = "";
            const html = await getRejectTemplateHtml();

            emailStatus = await send_mail(
                reportRequest.email,
                subject,
                text,
                html
            );
        }

        return NextResponse.json(
            { success: true, report: updatedRequest, email: emailStatus },
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
            { error: true, message: error.message },
            { status: 500 }
        );
    }
}

// async function getAcknowledgeText() {
//     const filePath = path.join(process.cwd(), 'public', 'acknowledge.txt');

//     return await fs.readFile(filePath, 'utf-8');
// }

async function getAcknowledgeHtml() {
    const filePath = path.join(process.cwd(), "public", "approve-email.html");

    return await fs.readFile(filePath, "utf-8");
}

async function getRejectTemplateHtml() {
    const filePath = path.join(process.cwd(), "public", "reject-email.html");

    return await fs.readFile(filePath, "utf-8");
}
