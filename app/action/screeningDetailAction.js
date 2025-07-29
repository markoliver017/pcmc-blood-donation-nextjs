"use server";

import { auth } from "@lib/auth";
import {
    ScreeningQuestion,
    ScreeningDetail,
    sequelize,
    DonorAppointmentInfo,
    Donor,
    BloodDonationEvent,
} from "@lib/models";
import { formatSeqObj } from "@lib/utils/object.utils";
import { screeningQuestionnaireSchema } from "@lib/zod/screeningDetailSchema";
import { isBefore, startOfDay } from "date-fns";
import { revalidatePath } from "next/cache";

export async function getScreeningDetails(appointmentId) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const details = await ScreeningDetail.findAll({
            where: { donor_appointment_info_id: appointmentId },
            raw: true,
        });

        return { success: true, data: details };
    } catch (error) {
        console.error("Failed to fetch screening details:", error);
        return { success: false, error: "Failed to fetch screening details." };
    }
}

export async function getActiveScreeningQuestions() {
    // This action is public for any authenticated user preparing to fill out the form.
    const session = await auth();
    if (!session?.user) {
        return {
            success: false,
            message: "Unauthorized",
        };
    }
    try {
        const questions = await ScreeningQuestion.findAll({
            where: { is_active: true },
            order: [["id", "ASC"]],
        });

        return {
            success: true,
            data: formatSeqObj(questions),
        };
    } catch (error) {
        console.error("Error fetching active screening questions:", error);
        return {
            success: false,
            error: "Could not fetch screening questions.",
        };
    }
}

export async function upsertManyScreeningDetails(appointmentId, answers) {
    const session = await auth();
    if (
        session?.user?.role_name !== "Donor" &&
        session?.user?.role_name !== "Admin"
    ) {
        return {
            success: false,
            message: "Unauthorized: Donor role required",
        };
    }

    const whereConditions = {};
    if (session?.user?.role_name === "Donor") {
        whereConditions.user_id = session.user.id;
    }

    const t = await sequelize.transaction();

    try {
        const validation = screeningQuestionnaireSchema.safeParse({ answers });
        if (!validation.success) {
            await t.rollback();
            return {
                success: false,
                error: "Validation failed",
                details: validation.error.format(),
            };
        }

        const appointment = await DonorAppointmentInfo.findOne({
            where: { id: appointmentId },
            include: [
                {
                    model: Donor,
                    as: "donor",
                    where: whereConditions,
                },
                {
                    model: BloodDonationEvent,
                    as: "event",
                    attributes: ["date"],
                },
            ],
        });

        if (!appointment) {
            await t.rollback();
            return {
                success: false,
                message: "Appointment not found or you do not have permission.",
            };
        }

        const currentDate = startOfDay(new Date());
        const eventDate = startOfDay(new Date(appointment?.event?.date));

        if (isBefore(currentDate, eventDate)) {
            await t.rollback();
            return {
                success: false,
                message:
                    "Please answer the screening questionaires on the day of the event.",
            };
        }

        const screeningDetailsToUpsert = answers.map((answer) => ({
            ...answer,
            donor_appointment_info_id: appointmentId,
        }));

        await ScreeningDetail.bulkCreate(screeningDetailsToUpsert, {
            transaction: t,
            updateOnDuplicate: ["response", "additional_info", "updatedAt"],
        });

        await t.commit();

        revalidatePath(
            `/portal/donors/appointments/${appointmentId}/screening-questionaires`
        );

        return {
            success: true,
            message: "Screening questionnaire submitted successfully.",
            data: screeningDetailsToUpsert,
        };
    } catch (error) {
        await t.rollback();
        console.error("Error creating screening details:", error);
        return {
            success: false,
            error: "Failed to submit screening questionnaire.",
        };
    }
}
