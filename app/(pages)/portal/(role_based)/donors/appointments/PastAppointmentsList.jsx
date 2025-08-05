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
    Award,
    Heart,
    Sparkles,
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
            <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg border border-orange-200 dark:border-gray-700 p-12">
                <div className="absolute top-4 right-4 opacity-20">
                    <Heart className="w-12 h-12 text-orange-500" />
                </div>
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-orange-500 rounded-full shadow-lg">
                        <History className="w-12 h-12 text-white" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                            No Past Appointments Yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 max-w-md">
                            Your donation history will appear here once you complete your first appointment. Every donation makes a difference!
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-medium">
                        <Award className="w-5 h-5" />
                        <span>Start your hero journey today</span>
                    </div>
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
                            className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                        >
                            <div className={`absolute top-0 left-0 w-full h-1 ${
                                appt.status === 'collected' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                                appt.status === 'deferred' ? 'bg-gradient-to-r from-yellow-500 to-orange-600' :
                                appt.status === 'cancelled' ? 'bg-gradient-to-r from-red-500 to-pink-600' :
                                'bg-gradient-to-r from-gray-500 to-gray-600'
                            }`}></div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1 flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${
                                            appt.status === 'collected' ? 'bg-green-100 dark:bg-green-900' :
                                            appt.status === 'deferred' ? 'bg-yellow-100 dark:bg-yellow-900' :
                                            appt.status === 'cancelled' ? 'bg-red-100 dark:bg-red-900' :
                                            'bg-gray-100 dark:bg-gray-700'
                                        }`}>
                                            <History className={`w-6 h-6 ${
                                                appt.status === 'collected' ? 'text-green-600 dark:text-green-400' :
                                                appt.status === 'deferred' ? 'text-yellow-600 dark:text-yellow-400' :
                                                appt.status === 'cancelled' ? 'text-red-600 dark:text-red-400' :
                                                'text-gray-600 dark:text-gray-400'
                                            }`} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                                {event?.title || "Untitled Event"}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Appointment #{appt.id} • {formatDate(event?.date)}
                                            </p>
                                        </div>
                                        {appt.status === 'collected' && (
                                            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 rounded-full">
                                                <Award className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                <span className="text-xs font-medium text-green-700 dark:text-green-300">Hero</span>
                                            </div>
                                        )}
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
                                            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Time</p>
                                                <p className="font-semibold text-gray-800 dark:text-white">{appt.time_schedule?.formatted_time || "-"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <MapPin className="w-5 h-5 text-red-600 dark:text-red-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Location</p>
                                                <p className="font-semibold text-gray-800 dark:text-white text-sm">{event?.agency?.agency_address || "No location"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className={`w-3 h-3 rounded-full ${
                                                appt.status === 'collected' ? 'bg-green-500' :
                                                appt.status === 'deferred' ? 'bg-yellow-500' :
                                                appt.status === 'cancelled' ? 'bg-red-500' : 'bg-gray-500'
                                            }`}></div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Status</p>
                                                <p className={`font-semibold uppercase ${
                                                    appt.status === 'collected' ? 'text-green-700 dark:text-green-300' :
                                                    appt.status === 'deferred' ? 'text-yellow-700 dark:text-yellow-300' :
                                                    appt.status === 'cancelled' ? 'text-red-700 dark:text-red-300' :
                                                    'text-gray-700 dark:text-gray-300'
                                                }`}>{appt.status}</p>
                                            </div>
                                        </div>
                                        {appt.status === 'collected' && (
                                            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                                                <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Impact</p>
                                                    <p className="font-semibold text-green-700 dark:text-green-300">~3 lives saved</p>
                                                </div>
                                            </div>
                                        )}
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
                                <button
                                    className={`inline-flex items-center gap-2 px-4 py-2 font-medium rounded-lg shadow-sm transition-all duration-200 ${
                                        canDownload
                                            ? "bg-green-600 hover:bg-green-700 text-white hover:shadow-md"
                                            : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                    }`}
                                    disabled={!canDownload}
                                    aria-label="Download certificate"
                                    title={
                                        canDownload
                                            ? "Download Certificate"
                                            : "Certificate available after successful donation"
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
