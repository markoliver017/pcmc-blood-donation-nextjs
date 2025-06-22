"use server";

import { logAuditTrail } from "@lib/audit_trails.utils";
import { auth } from "@lib/auth";
import { logErrorToFile } from "@lib/logger.server";
import {
    DonorAppointmentInfo,
    PhysicalExamination,
    sequelize,
} from "@lib/models";
import { extractErrorMessage } from "@lib/utils/extractErrorMessage";
import { formatSeqObj } from "@lib/utils/object.utils";

import { appointmentDetailsSchema } from "@lib/zod/appointmentSchema";
import { physicalExaminationSchema } from "@lib/zod/physicalExaminationSchema";

/* For client user registration */
export async function storePhysicalExam(appointmentId, formData) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }
    const { user } = session;
    formData.examiner_id = user.id;

    const parsed = physicalExaminationSchema.safeParse(formData);

    if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        return {
            success: false,
            type: "validation",
            message: "Please check your input and try again.",
            errorObj: parsed.error.flatten().fieldErrors,
            errorArr: Object.values(fieldErrors).flat(),
        };
    }

    const { data } = parsed;

    const appointment = await DonorAppointmentInfo.findByPk(appointmentId);
    if (!appointment) {
        return {
            success: false,
            message: "Database Error: Appointment ID was not found.",
        };
    }

    const existingExam = await PhysicalExamination.findOne({
        where: { appointment_id: appointmentId },
    });

    if (existingExam) {
        return {
            success: false,
            message:
                "Database Error: A physical examination has already been created for this appointment.",
        };
    }

    data.appointment_id = appointment?.id;
    data.donor_id = appointment?.donor_id;
    data.event_id = appointment?.event_id;

    const transaction = await sequelize.transaction();

    try {
        const newExam = await PhysicalExamination.create(data, { transaction });
        if (!newExam) {
            return {
                success: false,
                message:
                    "Registration Failed: There was an error while trying to save new entry for physical exam!",
            };
        }

        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "physicalExamAction",
            action: "storePhysicalExam ",
            details: `The donor physical exam has been successfully created. With appointment ID#: ${appointmentId} with new Exam ID: ${newExam?.id}`,
        });

        return {
            success: true,
            message: "Physical Exam has been successfully created.",
            data: newExam.get({ plain: true }),
        };
    } catch (err) {
        logErrorToFile(err, "storePhysicalExam");
        await transaction.rollback();

        return {
            success: false,
            message: extractErrorMessage(err),
        };
    }
}

export async function updatePhysicalExam(examId, formData) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }
    const { user } = session;
    formData.updated_by = user.id;

    const parsed = physicalExaminationSchema.safeParse(formData);

    if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        return {
            success: false,
            type: "validation",
            message: "Please check your input and try again.",
            errorObj: parsed.error.flatten().fieldErrors,
            errorArr: Object.values(fieldErrors).flat(),
        };
    }

    const { data } = parsed;

    const exam = await PhysicalExamination.findByPk(examId);
    if (!exam) {
        return {
            success: false,
            message: "Database Error: Examination ID was not found.",
        };
    }

    const transaction = await sequelize.transaction();

    try {
        const updatedExam = await exam.update(data, { transaction });
        if (!updatedExam) {
            return {
                success: false,
                message:
                    "Update Failed: There was an error while trying to update the physical examination!",
            };
        }

        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "physicalExamAction",
            action: "updatePhysicalExam ",
            details: `The donor physical examination has been successfully updated. With examination ID#: ${examId}.`,
        });

        return {
            success: true,
            message: "Physical Exam has been successfully updated.",
            data: updatedExam.get({ plain: true }),
        };
    } catch (err) {
        logErrorToFile(err, "updatePhysicalExam");
        await transaction.rollback();

        return {
            success: false,
            message: extractErrorMessage(err),
        };
    }
}

export async function storeUpdatePhysicalExam(appointmentId, formData) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }
    const { user } = session;

    const parsed = physicalExaminationSchema.safeParse(formData);

    if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        return {
            success: false,
            type: "validation",
            message: "Please check your input and try again.",
            errorObj: parsed.error.flatten().fieldErrors,
            errorArr: Object.values(fieldErrors).flat(),
        };
    }

    const { data } = parsed;

    console.log("formData", formData)
    console.log("parsed data", data)

    const appointment = await DonorAppointmentInfo.findByPk(appointmentId);

    if (!appointment) {
        return {
            success: false,
            message: "Database Error: Appointment ID was not found.",
        };
    }

    const transaction = await sequelize.transaction();

    try {
        const exam = await PhysicalExamination.findOne({
            where: { appointment_id: appointmentId },
        });


        if (!exam) {
            data.appointment_id = appointment?.id
            data.donor_id = appointment.donor_id
            data.event_id = appointment.event_id
            data.examiner_id = user.id;
            await PhysicalExamination.create(data, { transaction });
        } else {
            data.updated_by = user.id;
            await exam.update(data, { transaction });
        }

        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "physicalExamAction",
            action: "storeUpdatePhysicalExam ",
            details: `The Donor's physical examination has been successfully submitted. With appointment ID#: ${appointmentId}.`,
        });



        return {
            success: true,
            message: `The Donor's physical examination has been successfully submitted.`,
            data: data,
        };

    } catch (err) {
        logErrorToFile(err, "updatePhysicalExam");
        await transaction.rollback();

        return {
            success: false,
            message: extractErrorMessage(err),
        };
    }
}

export async function getExaminationById(examId) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    try {
        const exam = await PhysicalExamination.findByPk(examId);

        if (!exam) {
            return {
                success: false,
                message: "Database Error: Physical Examination was not found!.",
            };
        }

        const formattedExam = formatSeqObj(exam);

        return { success: true, data: formattedExam };
    } catch (err) {
        logErrorToFile(err, "getExaminationById ERROR");
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}

export async function getExaminationByAppointmentId(appointmentId) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }

    try {
        const exam = await PhysicalExamination.findOne({
            where: { appointment_id: appointmentId },
        });

        if (!exam) {
            return {
                success: false,
                message: "Database Error: Physical Examination was not found!.",
            };
        }

        const formattedExam = formatSeqObj(exam);

        return { success: true, data: formattedExam };
    } catch (err) {
        logErrorToFile(err, "getExaminationByAppointmentId ERROR");
        return {
            success: false,
            type: "server",
            message: extractErrorMessage(err),
        };
    }
}

export async function updateAppointmentDetails(appointmentId, formData) {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "You are not authorized to access this request.",
        };
    }
    const { user } = session;
    formData.updated_by = user.id;

    const parsed = appointmentDetailsSchema.safeParse(formData);

    if (!parsed.success) {
        const errorObj = parsed?.error?.flatten().fieldErrors;

        return {
            success: false,
            type: "validation",
            message:
                "Validation Error: Please try again. If the issue persists, contact your administrator for assistance.",
            errorObj,
            errorArr: Object.values(errorObj).flat(),
        };
    }

    // return parsed;

    const { data } = parsed;

    const appointment = await DonorAppointmentInfo.findByPk(appointmentId);

    if (!appointment) {
        return {
            success: false,
            message: "Database Error: Appointment ID was not found.",
        };
    }

    const transaction = await sequelize.transaction();

    try {
        const updatedAppointment = await appointment.update(data, {
            transaction,
        });

        await transaction.commit();

        await logAuditTrail({
            userId: user.id,
            controller: "donorAppointmentAction",
            action: "donorAppointmentDetails",
            details: `The Donor's appointment details has been successfully updated. ID#: ${updatedAppointment.id}`,
        });

        return {
            success: true,
            message:
                "The Donor's appointment details has been successfully updated.",
        };
    } catch (err) {
        logErrorToFile(err, "donorAppointmentDetails");
        await transaction.rollback();

        return {
            success: false,
            message: extractErrorMessage(err),
        };
    }
}
