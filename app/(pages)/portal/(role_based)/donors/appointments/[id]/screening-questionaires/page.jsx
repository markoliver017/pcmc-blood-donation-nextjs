import React from "react";
import {
    getActiveScreeningQuestions,
    getScreeningDetails,
} from "@action/screeningDetailAction";

import { auth } from "@lib/auth";
import { BloodDonationEvent, Donor, DonorAppointmentInfo } from "@lib/models";
import ScreeningQuestionnaireForm from "./ScreeningQuestionnaireForm";
import { Calendar } from "lucide-react";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { formatFormalName } from "@lib/utils/string.utils";
import { GiChecklist } from "react-icons/gi";
import Link from "next/link";

const ScreeningQuestionairesPage = async ({ params }) => {
    const session = await auth();
    const appointmentId = (await params).id;

    const appointment = await DonorAppointmentInfo.findOne({
        where: { id: appointmentId },
        include: [
            {
                model: Donor,
                as: "donor",
                where: { user_id: session.user.id },
            },
            {
                model: BloodDonationEvent,
                as: "event",
                attributes: ["title"],
            },
        ],
    });

    if (!appointment) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-15rem)]">
                <div className="text-center text-red-500 font-bold">
                    Appointment not found or you do not have permission to view
                    this page.
                </div>
            </div>
        );
    }

    const questionsPromise = getActiveScreeningQuestions();
    const screeningDetailsPromise = getScreeningDetails(appointmentId);

    const [questionsResult, screeningDetailsResult] = await Promise.all([
        questionsPromise,
        screeningDetailsPromise,
    ]);

    const {
        success: questionsSuccess,
        data: questions,
        error: questionsError,
    } = questionsResult;
    const {
        success: detailsSuccess,
        data: existingAnswers,
        error: detailsError,
    } = screeningDetailsResult;

    if (!questionsSuccess || !detailsSuccess) {
        const error = questionsError || detailsError || "Something went wrong";
        return (
            <div className="flex items-center justify-center h-[calc(100vh-15rem)]">
                <div className="text-center text-red-500 font-bold">
                    {error}
                </div>
            </div>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-15rem)]">
                <div className="flex flex-col items-center gap-2 text-center text-red-500 font-bold">
                    No screening questions found.
                    <Link
                        href={`/portal/donors/appointments`}
                        className="btn text-blue-500 hover:underline"
                    >
                        Back
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <WrapperHeadMain
                icon={<GiChecklist />}
                pageTitle="Donor Screening Questionnaire"
                breadcrumbs={[
                    {
                        path: "/portal/donors/appointments",
                        icon: <Calendar className="w-4" />,
                        title: `My Appointments`,
                    },
                    {
                        path: `/portal/donors/appointments`,
                        icon: <Calendar className="w-4" />,
                        title: formatFormalName(appointment?.event?.title),
                    },
                ]}
            />
            <div className="flex flex-col gap-4 p-2">
                <p>
                    Please answer all questions honestly. Your responses are
                    confidential and essential for ensuring the safety of both
                    you and the recipient.
                </p>
                <ScreeningQuestionnaireForm
                    questions={questions}
                    appointmentId={appointmentId}
                    existingAnswers={existingAnswers || []}
                />
            </div>
        </div>
    );
};

export default ScreeningQuestionairesPage;
