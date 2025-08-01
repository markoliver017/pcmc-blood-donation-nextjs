import React from "react";
import { Calendar, Gift, Clock, ShieldCheck, ShieldAlert } from "lucide-react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

const Card = ({ icon, label, value, subtext, color }) => (
    <div
        className={`flex flex-col items-center justify-center p-4 rounded-lg shadow border ${
            color || ""
        }`}
    >
        <div className="mb-2">{icon}</div>
        <div className="text-2xl font-bold text-center">{value}</div>
        <div className="text-sm text-gray-600 text-center">{label}</div>
        {subtext && (
            <div className="text-xs text-gray-400 mt-1 text-center">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Next Appointment */}
            <Card
                icon={<Calendar className="w-7 h-7 text-blue-500" />}
                label="Next Appointment"
                value={
                    nextAppointment
                        ? formatDate(nextAppointment.time_schedule?.event?.date)
                        : "None"
                }
                subtext={
                    nextAppointment
                        ? nextAppointment.time_schedule?.event?.title || "-"
                        : "No upcoming appointment"
                }
                color="border-blue-200"
            />
            {/* Total Donations */}
            <Card
                icon={<Gift className="w-7 h-7 text-red-500" />}
                label="Total Donations"
                value={totalDonations || 0}
                subtext={
                    totalDonations > 0
                        ? "Thank you for donating!"
                        : "No donations yet"
                }
                color="border-red-200"
            />
            {/* Last Donation */}
            <Card
                icon={
                    isLastDonationSuccess ? (
                        <Clock className="w-7 h-7 text-green-500" />
                    ) : (
                        <ExclamationTriangleIcon className="w-7 h-7 text-red-500" />
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
                        : "No past donation"
                }
                color={
                    isLastDonationSuccess
                        ? "border-green-200"
                        : "border-red-200"
                }
            />

            {/* Eligibility Countdown */}
            <Card
                icon={
                    isLastDonationSuccess ? (
                        <ShieldCheck className="w-7 h-7 text-purple-500" />
                    ) : isPermanentlyDeferred ? (
                        <ShieldAlert className="w-7 h-7 text-gray-500" />
                    ) : (
                        <ShieldAlert className="w-7 h-7 text-yellow-500" />
                    )
                }
                label="Eligibility"
                value={
                    isPermanentlyDeferred
                        ? "Status: Permanently Deferred"
                        : isTemporarilyDeferred
                        ? "Status: Temporarily Deferred"
                        : eligibilityCountdown === null
                        ? "-"
                        : eligibilityCountdown === 0
                        ? "Eligible to Donate"
                        : `${eligibilityCountdown} day${
                              eligibilityCountdown === 1 ? "" : "s"
                          } remaining`
                }
                subtext={
                    isPermanentlyDeferred ? (
                        "We appreciate your willingness to donate. Although you can’t donate blood anymore, there are many ways you can still make a difference."
                    ) : isTemporarilyDeferred ? (
                        <>
                            You’re temporarily deferred. <br />
                            Remarks:{" "}
                            {lastDonation?.physical_exam?.deferral_reason}
                            <br />
                            Please try again for the next available appointment.
                        </>
                    ) : eligibilityCountdown === null ? (
                        "No donation history yet"
                    ) : eligibilityCountdown === 0 ? (
                        "You're good to go. Thank you for being a hero!"
                    ) : (
                        "You can donate again once the countdown reaches zero."
                    )
                }
                color={
                    isPermanentlyDeferred
                        ? "border-gray-300"
                        : isTemporarilyDeferred
                        ? "border-yellow-200"
                        : isLastDonationSuccess
                        ? "border-green-200"
                        : "border-purple-200"
                }
            />
        </div>
    );
};

export default SummaryCards;
