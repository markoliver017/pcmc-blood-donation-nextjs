import React from "react";
import {
    Calendar,
    MapPin,
    Clock,
    History,
    Download,
    MessageCircle,
    Eye,
    MessageSquareQuote,
} from "lucide-react";
import StarRating from "@components/reusable_components/StarRating";
import Link from "next/link";

const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const PastAppointmentsList = ({ appointments = [], onViewDetails }) => {
    if (!appointments.length) {
        return (
            <div className="flex flex-col items-center justify-center p-8 rounded shadow text-gray-500">
                <History className="w-8 h-8 mb-2 text-gray-400" />
                <div className="font-semibold text-lg">
                    No Past Appointments
                </div>
                <div className="text-sm">
                    Your past appointments will appear here.
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {appointments
                .slice(-5)
                .reverse()
                .map((appt) => {
                    const event = appt.time_schedule?.event;
                    const canDownload = appt.status === "donated";
                    return (
                        <div
                            key={appt.id}
                            className="space-y-2  justify-between p-4 rounded-lg shadow border border-gray-100"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-semibold text-lg">
                                        <History className="w-5 h-5" />
                                        {event?.title || "Untitled Event"}
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
                                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />{" "}
                                        {formatDate(event?.date)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />{" "}
                                        {appt.time_schedule?.formatted_time ||
                                            "-"}
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
                            <div className="flex md:justify-end gap-2 mt-4 md:mt-0 md:ml-4">
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
                                <button
                                    className={`btn btn-sm btn-outline hidden items-center gap-1 ${
                                        canDownload
                                            ? ""
                                            : "opacity-60 cursor-not-allowed"
                                    }`}
                                    disabled={!canDownload}
                                    aria-label="Download certificate"
                                    title={
                                        canDownload
                                            ? "Download Certificate"
                                            : "Certificate available after donation"
                                    }
                                >
                                    <Download className="w-4 h-4" />
                                    Certificate
                                </button>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};

export default PastAppointmentsList;
