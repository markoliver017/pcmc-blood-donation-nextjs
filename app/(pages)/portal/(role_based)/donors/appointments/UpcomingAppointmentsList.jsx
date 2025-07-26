import React from "react";
import { Calendar, MapPin, Clock, BadgeCheck, Eye, MessageSquareQuote } from "lucide-react";
import CancelEventButton from "@components/donors/CancelEventButton";
import Link from "next/link";
import { BiQuestionMark } from "react-icons/bi";
import { FaQuestionCircle } from "react-icons/fa";
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
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded shadow text-gray-500">
                <Calendar className="w-8 h-8 mb-2 text-blue-400" />
                <div className="font-semibold text-lg">
                    No Upcoming Appointments
                </div>
                <div className="text-sm">
                    Book your next donation to see it here!
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Only first two appointments will be shown */}
            {appointments.slice(0, 2).map((appt) => {
                const event = appt.time_schedule?.event;
                return (
                    <div
                        key={appt.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white rounded-lg shadow border border-blue-100"
                    >
                        <div className="flex-1 min-w-0 ">
                            <div className="flex justify-between ">
                                <div className="flex-1 flex items-center gap-2 text-blue-700 font-semibold text-lg">
                                    <BadgeCheck className="w-5 h-5" />
                                    {event?.title || "Untitled Event"}
                                </div>
                                {appt.feedback_average !== null ? (
                                    <div className="flex items-center flex-none gap-2 p-2 rounded-md bg-base-200">
                                        <span className="text-sm font-medium">Your Rating:</span>
                                        <StarRating rating={appt.feedback_average} />
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
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />{" "}
                                    {formatDate(event?.date)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />{" "}
                                    {appt.time_schedule?.formatted_time || "-"}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {event?.agency?.agency_address ||
                                        "No location"}
                                </span>
                                <span className="flex items-center gap-1">
                                    Status:
                                    <span className="font-bold uppercase ml-1">
                                        {appt.status}
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4 md:mt-0 md:ml-4">
                            <button
                                className="btn btn-sm btn-primary"
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
                                className="btn btn-sm btn-primary"
                                aria-label="View appointment details"
                            >
                                <FaQuestionCircle className="w-4 h-4" />
                                Questionaires
                            </Link>
                            {appt.feedback_average === null && (
                                <Link
                                    href={`/portal/donors/appointments/${appt.id}/feedback`}
                                    className="btn btn-sm btn-primary"
                                    aria-label="Provide Feedback"
                                >
                                    <MessageSquareQuote className="w-4 h-4" />
                                    <span>Feedback</span>
                                </Link>
                            )}


                            <CancelEventButton
                                event={event}
                                schedule={appt?.time_schedule}
                                appointmentId={appt.id}
                                className="btn-sm btn-error"
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default UpcomingAppointmentsList;
