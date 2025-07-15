import React from "react";
import { Calendar, Gift, Clock, ShieldCheck } from "lucide-react";

const Card = ({ icon, label, value, subtext, color }) => (
  <div className={`flex flex-col items-center p-4 rounded-lg shadow bg-white border ${color || ''}`}>
    <div className="mb-2">{icon}</div>
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
    {subtext && <div className="text-xs text-gray-400 mt-1">{subtext}</div>}
  </div>
);

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const SummaryCards = ({ nextAppointment, totalDonations, lastDonation, eligibilityCountdown }) => {
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
        subtext={totalDonations > 0 ? "Thank you for donating!" : "No donations yet"}
        color="border-red-200"
      />
      {/* Last Donation */}
      <Card
        icon={<Clock className="w-7 h-7 text-green-500" />}
        label="Last Donation"
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
        color="border-green-200"
      />
      {/* Eligibility Countdown */}
      <Card
        icon={<ShieldCheck className="w-7 h-7 text-purple-500" />}
        label="Eligibility"
        value={
          eligibilityCountdown === null
            ? "-"
            : eligibilityCountdown === 0
            ? "Eligible"
            : `${eligibilityCountdown} day${eligibilityCountdown === 1 ? '' : 's'}`
        }
        subtext={
          eligibilityCountdown === null
            ? "No donation yet"
            : eligibilityCountdown === 0
            ? "You can donate now!"
            : "Until next eligible donation"
        }
        color="border-purple-200"
      />
    </div>
  );
};

export default SummaryCards; 