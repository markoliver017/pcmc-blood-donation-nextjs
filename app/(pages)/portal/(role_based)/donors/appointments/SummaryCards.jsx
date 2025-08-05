import React from "react";
import {
    Calendar,
    Gift,
    Clock,
    ShieldCheck,
    ShieldAlert,
    Sparkles,
    Heart,
} from "lucide-react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

const Card = ({
    icon,
    label,
    value,
    subtext,
    color,
    gradient,
    isHighlight,
}) => (
    <div
        className={`relative flex flex-col items-center justify-center p-6 rounded-xl shadow-lg border transition-all duration-300 hover:shadow-xl hover:scale-105 ${
            gradient
                ? `bg-gradient-to-br ${gradient}`
                : "bg-white dark:bg-gray-800"
        } ${color || "border-gray-200 dark:border-gray-700"} ${
            isHighlight ? "ring-2 ring-blue-400 dark:ring-blue-500" : ""
        }`}
    >
        {isHighlight && (
            <div className="absolute -top-2 -right-2">
                <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            </div>
        )}
        <div className="mb-3 p-2 rounded-full bg-white/20 dark:bg-black/20">
            {icon}
        </div>
        <div className="text-3xl font-bold text-center mb-1 text-gray-200 dark:text-white">
            {value}
        </div>
        <div className="text-sm font-medium text-gray-300 dark:text-gray-300 text-center mb-2">
            {label}
        </div>
        {subtext && (
            <div className="text-xs text-gray-200 mt-1 text-center leading-relaxed">
                {subtext}
            </div>
        )}
    </div>
);

const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const SummaryCards = ({
    nextAppointment,
    totalDonations,
    lastDonation,
    eligibilityCountdown,
}) => {
    const isLastDonationSuccess = lastDonation?.status === "collected";
    const isPermanentlyDeferred =
        !isLastDonationSuccess &&
        lastDonation?.physical_exam?.eligibility_status ===
            "PERMANENTLY-DEFERRED";
    const isTemporarilyDeferred =
        !isLastDonationSuccess &&
        lastDonation?.physical_exam?.eligibility_status ===
            "TEMPORARILY-DEFERRED";
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Next Appointment */}
            <Card
                icon={<Calendar className="w-8 h-8 text-white" />}
                label="Next Appointment"
                value={
                    nextAppointment
                        ? formatDate(nextAppointment.time_schedule?.event?.date)
                        : "None"
                }
                subtext={
                    nextAppointment
                        ? nextAppointment.time_schedule?.event?.title || "-"
                        : "Ready to book your next donation?"
                }
                gradient="from-blue-500 to-blue-600"
                color="border-blue-300 dark:border-blue-500"
                isHighlight={!!nextAppointment}
            />
            {/* Total Donations */}
            <Card
                icon={<Heart className="w-8 h-8 text-white" />}
                label="Total Donations"
                value={totalDonations || 0}
                subtext={
                    totalDonations > 0
                        ? `You've saved ${totalDonations * 3} lives! 🎉`
                        : "Your first donation awaits!"
                }
                gradient="from-red-500 to-pink-600"
                color="border-red-300 dark:border-red-500"
                isHighlight={totalDonations > 0}
            />
            {/* Last Donation */}
            <Card
                icon={
                    isLastDonationSuccess ? (
                        <Clock className="w-8 h-8 text-white" />
                    ) : (
                        <ExclamationTriangleIcon className="w-8 h-8 text-white" />
                    )
                }
                label="Last Appointment"
                value={
                    lastDonation
                        ? formatDate(lastDonation.time_schedule?.event?.date)
                        : "None"
                }
                subtext={
                    lastDonation
                        ? lastDonation.time_schedule?.event?.title || "-"
                        : "Your donation history starts here"
                }
                gradient={
                    isLastDonationSuccess
                        ? "from-green-500 to-emerald-600"
                        : "from-gray-500 to-gray-600"
                }
                color={
                    isLastDonationSuccess
                        ? "border-green-300 dark:border-green-500"
                        : "border-gray-300 dark:border-gray-500"
                }
            />

            {/* Eligibility Countdown */}
            <Card
                icon={
                    isLastDonationSuccess ? (
                        <ShieldCheck className="w-8 h-8 text-white" />
                    ) : isPermanentlyDeferred ? (
                        <ShieldAlert className="w-8 h-8 text-white" />
                    ) : (
                        <ShieldAlert className="w-8 h-8 text-white" />
                    )
                }
                label="Eligibility Status"
                value={
                    isPermanentlyDeferred
                        ? "Permanently Deferred"
                        : isTemporarilyDeferred
                        ? "Temporarily Deferred"
                        : eligibilityCountdown === null
                        ? "Ready to Start"
                        : eligibilityCountdown === 0
                        ? "✅ Eligible Now!"
                        : `${eligibilityCountdown} day${
                              eligibilityCountdown === 1 ? "" : "s"
                          } left`
                }
                subtext={
                    isPermanentlyDeferred ? (
                        "Thank you for your willingness to help. There are other ways to make a difference!"
                    ) : isTemporarilyDeferred ? (
                        <>
                            Temporarily deferred <br />
                            Reason:{" "}
                            {lastDonation?.physical_exam?.deferral_reason ||
                                "Medical assessment"}
                            <br />
                            You can try again at the next appointment.
                        </>
                    ) : eligibilityCountdown === null ? (
                        "Complete your first donation to track eligibility"
                    ) : eligibilityCountdown === 0 ? (
                        "🎉 You're cleared to donate! Book your appointment now."
                    ) : (
                        "Countdown to your next eligible donation date."
                    )
                }
                gradient={
                    isPermanentlyDeferred
                        ? "from-gray-500 to-gray-600"
                        : isTemporarilyDeferred
                        ? "from-yellow-500 to-orange-600"
                        : eligibilityCountdown === 0
                        ? "from-green-500 to-emerald-600"
                        : "from-purple-500 to-indigo-600"
                }
                color={
                    isPermanentlyDeferred
                        ? "border-gray-300 dark:border-gray-500"
                        : isTemporarilyDeferred
                        ? "border-yellow-300 dark:border-yellow-500"
                        : eligibilityCountdown === 0
                        ? "border-green-300 dark:border-green-500"
                        : "border-purple-300 dark:border-purple-500"
                }
                isHighlight={eligibilityCountdown === 0}
            />
        </div>
    );
};

export default SummaryCards;
