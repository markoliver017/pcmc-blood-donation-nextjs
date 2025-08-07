import React from "react";
import {
    Calendar,
    MapPin,
    Clock,
    BadgeCheck,
    Eye,
    MessageSquareQuote,
    CalendarPlus,
    ArrowRight,
    Sparkles,
} from "lucide-react";
import CancelEventButton from "@components/donors/CancelEventButton";
import Link from "next/link";
import { BiQuestionMark } from "react-icons/bi";
import { FaCheckCircle, FaQuestionCircle } from "react-icons/fa";
import StarRating from "@components/reusable_components/StarRating";

const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const UpcomingAppointmentsList = ({ appointments = [], onViewDetails }) => {
    if (!appointments || appointments.length === 0) {
        return (
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg border border-blue-200 dark:border-gray-700 p-12">
                <div className="absolute top-4 right-4 opacity-20">
                    <Sparkles className="w-12 h-12 text-blue-500" />
                </div>
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-blue-500 rounded-full shadow-lg">
                        <CalendarPlus className="w-12 h-12 text-white" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                            No Upcoming Appointments
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 max-w-md">
                            Ready to make a difference? Book your next blood
                            donation appointment and help save lives in your
                            community.
                        </p>
                    </div>
                    <Link
                        href="/portal/donors/events"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105"
                    >
                        <CalendarPlus className="w-5 h-5" />
                        Book New Appointment
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Only first two appointments will be shown */}
            {appointments.slice(0, 2).map((appt) => {
                const event = appt.time_schedule?.event;
                const hasAnsweredScreeningQuestions =
                    appt?.screening_details?.length > 0;
                return (
                    <div
                        key={appt.id}
                        className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-blue-200 dark:border-blue-700 p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                        <div className="flex-1 min-w-0 ">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1 flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                        <BadgeCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                            {event?.title || "Untitled Event"}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Appointment #{appt.id}
                                        </p>
                                    </div>
                                </div>
                                {appt.feedback_average !== null ? (
                                    <div className="flex items-center flex-none gap-2 p-2 rounded-md bg-base-200">
                                        <span className="text-sm font-medium">
                                            Your Rating:
                                        </span>
                                        <StarRating
                                            rating={appt.feedback_average}
                                        />
                                    </div>
                                ) : (
                                    <Link
                                        href={`/portal/donors/appointments/${appt.id}/feedback`}
                                        className="btn btn-ghost"
                                        aria-label="Provide Feedback"
                                    >
                                        <MessageSquareQuote className="w-4 h-4" />
                                        <span>Send Feedback</span>
                                    </Link>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                Date
                                            </p>
                                            <p className="font-semibold text-gray-800 dark:text-white">
                                                {formatDate(event?.date)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                Time
                                            </p>
                                            <p className="font-semibold text-gray-800 dark:text-white">
                                                {appt.time_schedule
                                                    ?.formatted_time || "-"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <MapPin className="w-5 h-5 text-red-600 dark:text-red-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                Location
                                            </p>
                                            <p className="font-semibold text-gray-800 dark:text-white text-sm">
                                                {event?.agency
                                                    ?.agency_address ||
                                                    "No location"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div
                                            className={`w-3 h-3 rounded-full ${
                                                appt.status === "confirmed"
                                                    ? "bg-green-500"
                                                    : appt.status === "pending"
                                                    ? "bg-yellow-500"
                                                    : appt.status ===
                                                      "cancelled"
                                                    ? "bg-red-500"
                                                    : "bg-gray-500"
                                            }`}
                                        ></div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                Status
                                            </p>
                                            <p className="font-semibold text-gray-800 dark:text-white uppercase">
                                                {appt.status}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3 justify-end">
                            <button
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
                                onClick={() =>
                                    onViewDetails && onViewDetails(appt)
                                }
                                aria-label="View appointment details"
                            >
                                <Eye className="w-4 h-4" />
                                Details
                            </button>
                            <Link
                                href={`/portal/donors/appointments/${appt.id}/screening-questionaires`}
                                className={
                                    hasAnsweredScreeningQuestions
                                        ? "inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
                                        : "inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
                                }
                                aria-label="Answer screening questionaires"
                            >
                                {hasAnsweredScreeningQuestions ? (
                                    <FaCheckCircle className="w-4 h-4" />
                                ) : (
                                    <FaQuestionCircle className="w-4 h-4" />
                                )}
                                Screening{" "}
                                {hasAnsweredScreeningQuestions ? (
                                    <span className="text-xs text-green-900">
                                        (Answered)
                                    </span>
                                ) : (
                                    <span className="text-xs text-red-900">
                                        (Pending)
                                    </span>
                                )}
                            </Link>

                            <CancelEventButton
                                event={event}
                                schedule={appt?.time_schedule}
                                appointmentId={appt.id}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default UpcomingAppointmentsList;
