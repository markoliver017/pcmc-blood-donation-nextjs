import React from "react";
import {
    getActiveScreeningQuestions,
    getScreeningDetails,
} from "@action/screeningDetailAction";

import { auth } from "@lib/auth";
import {
    Agency,
    BloodDonationEvent,
    Donor,
    DonorAppointmentInfo,
    EventTimeSchedule,
} from "@lib/models";
import ScreeningQuestionnaireForm from "./ScreeningQuestionnaireForm";
import {
    ArrowLeftCircle,
    Building,
    Calendar,
    Clock,
    MapPin,
} from "lucide-react";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { formatFormalName } from "@lib/utils/string.utils";
import Link from "next/link";
import { Toaster } from "sonner";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { format, parse } from "date-fns";

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
                required: true,
            },
            {
                model: EventTimeSchedule,
                as: "time_schedule",
                include: {
                    model: BloodDonationEvent,
                    as: "event",
                    include: { model: Agency, as: "agency" },
                },
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

    const event = appointment.time_schedule.event;
    const timeSchedule = appointment.time_schedule;

    return (
        <div>
            <Toaster />
            <WrapperHeadMain
                icon={
                    <>
                        <Link
                            href="/portal/donors/appointments"
                            className="btn btn-ghost p-2"
                        >
                            <ArrowLeftCircle className="w-6 h-6" />
                        </Link>
                    </>
                }
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
                        title: formatFormalName(event?.title),
                    },
                ]}
            />

            <div className="flex flex-col gap-4 p-2 md:max-w-7/10 mx-auto">
                <p className="text-base italic flex items-center text-gray-600 dark:text-gray-400">
                    <InfoCircledIcon className="w-4 h-4 mr-2" /> Please answer
                    all questions honestly. Your responses are confidential and
                    essential for ensuring the safety of both you and the
                    recipient.
                </p>
                <div className="mb-2 p-4 border rounded-lg bg-secondary/50">
                    <h3 className="text-xl font-semibold mb-3">
                        Appointment Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-md">
                        <div className="flex items-center gap-2">
                            <Building className="w-5 h-5 text-primary" />
                            <span>
                                <strong>Agency:</strong> {event.agency.name}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            <span>
                                <strong>Location:</strong>{" "}
                                {event.agency.agency_address}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            <span>
                                <strong>Date:</strong>{" "}
                                {new Date(
                                    timeSchedule.event.date
                                ).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            <span>
                                <strong>Time:</strong>{" "}
                                {format(
                                    parse(
                                        timeSchedule.time_start,
                                        "HH:mm:ss",
                                        new Date()
                                    ),
                                    "hh:mm a"
                                )}{" "}
                                -{" "}
                                {format(
                                    parse(
                                        timeSchedule.time_end,
                                        "HH:mm:ss",
                                        new Date()
                                    ),
                                    "hh:mm a"
                                )}
                            </span>
                        </div>
                    </div>
                </div>

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
