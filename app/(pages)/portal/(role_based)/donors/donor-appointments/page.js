"use client";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { Calendar } from "lucide-react";
import SummaryCards from "./SummaryCards";
import UpcomingAppointmentsList from "./UpcomingAppointmentsList";
import PastAppointmentsList from "./PastAppointmentsList";
import AnalyticsChart from "./AnalyticsChart";
import ImpactMetrics from "./ImpactMetrics";
import BookAppointmentButton from "./BookAppointmentButton";
import AppointmentDetailModal from "./AppointmentDetailModal";
import { useEffect, useState } from "react";
import { getAllAppointmentsByDonor } from "@/action/donorAppointmentAction";
import Skeleton_line from "@components/ui/skeleton_line";

export default function Page() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getAllAppointmentsByDonor()
      .then((res) => {
        if (mounted) {
          if (res.success) {
            setAppointments(res.data || []);
            setError(null);
          } else {
            setError(res.message || "Failed to fetch appointments");
          }
        }
      })
      .catch((err) => {
        if (mounted) setError(err?.message || "Unknown error");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <Skeleton_line />;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  // Data extraction for dashboard components
  const now = new Date();
  const sortedAppointments = [...appointments].sort((a, b) => new Date(a.time_schedule?.event?.date) - new Date(b.time_schedule?.event?.date));
  const upcoming = sortedAppointments.filter(a => new Date(a.time_schedule?.event?.date) >= now);
  const past = sortedAppointments.filter(a => new Date(a.time_schedule?.event?.date) < now);
  const nextAppointment = upcoming[0] || null;
  const lastDonation = past.reverse().find(a => a.status === "donated") || null;
  const totalDonations = appointments.filter(a => a.status === "donated").length;
  // Eligibility: 90 days after last donation
  let eligibilityCountdown = null;
  if (lastDonation) {
    const lastDate = new Date(lastDonation.time_schedule?.event?.date);
    const nextEligible = new Date(lastDate.getTime() + 90 * 24 * 60 * 60 * 1000);
    eligibilityCountdown = Math.max(0, Math.ceil((nextEligible - now) / (1000 * 60 * 60 * 24)));
  }

  // Handler for opening appointment details modal
  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAppointment(null);
  };

  return (
    <>
      <WrapperHeadMain
        icon={<Calendar />}
        pageTitle="My Appointments"
        breadcrumbs={[
          {
            path: "/portal/donors/donor-appointments",
            icon: <Calendar className="w-4" />,
            title: "My Appointments",
          },
        ]}
      />
      <div className="p-2 md:p-5 space-y-6">
        {/* Dashboard Summary Cards */}
        <SummaryCards
          nextAppointment={nextAppointment}
          totalDonations={totalDonations}
          lastDonation={lastDonation}
          eligibilityCountdown={eligibilityCountdown}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Upcoming Appointments (2/3 width) */}
          <div className="md:col-span-2 space-y-4">
            <UpcomingAppointmentsList appointments={upcoming} onViewDetails={handleViewDetails} />
          </div>
          {/* Analytics Chart (1/3 width) */}
          <div>
            <AnalyticsChart appointments={appointments} />
          </div>
        </div>

        {/* Past Appointments and Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <PastAppointmentsList appointments={past} onViewDetails={handleViewDetails} />
          </div>
          <div>
            <ImpactMetrics totalDonations={totalDonations} appointments={appointments} />
          </div>
        </div>

        {/* Book Appointment Button */}
        <div className="flex justify-end">
          <BookAppointmentButton />
        </div>

        {/* Appointment Details Modal (to be conditionally shown) */}
        <AppointmentDetailModal isOpen={modalOpen} appointment={selectedAppointment} onClose={handleCloseModal} />
      </div>
    </>
  );
}
