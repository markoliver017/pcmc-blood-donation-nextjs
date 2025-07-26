"use server";

import { revalidatePath } from "next/cache";
import { sequelize, FeedbackResponse, DonorAppointmentInfo } from "@lib/models";
import { feedbackResponseSchema } from "@lib/zod/feedbackResponseSchema";

export async function createFeedbackResponse(data) {
    const transaction = await sequelize.transaction();

    try {
        const validatedData = feedbackResponseSchema.parse(data);
        const { responses, donor_appointment_id } = validatedData;

        // 1. Check if feedback has already been submitted for this appointment
        const existingFeedback = await FeedbackResponse.findOne({
            where: { donor_appointment_id },
        });

        if (existingFeedback) {
            return { success: false, message: "Feedback has already been submitted for this appointment." };
        }

        // 2. Create feedback responses
        const responsesToCreate = responses.map(res => ({ ...res, donor_appointment_id }));
        await FeedbackResponse.bulkCreate(responsesToCreate, { transaction });

        // 3. Calculate average rating
        const totalRating = responses.reduce((sum, res) => sum + res.rating, 0);
        const feedback_average = totalRating / responses.length;

        // 4. Update the appointment with the average rating
        await DonorAppointmentInfo.update(
            { feedback_average },
            { where: { id: donor_appointment_id }, transaction }
        );

        await transaction.commit();

        revalidatePath(`/portal/donors/appointments/${donor_appointment_id}`);
        return { success: true, message: "Feedback submitted successfully! Thank you." };

    } catch (error) {
        await transaction.rollback();
        if (error.name === "ZodError") {
            return { success: false, message: "Validation failed", errors: error.errors };
        }
        return { success: false, message: error.message || "An unexpected error occurred." };
    }
}
