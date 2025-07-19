"use client";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { Calendar, CalendarCheck } from "lucide-react";
import SummaryCards from "./SummaryCards";
import UpcomingAppointmentsList from "./UpcomingAppointmentsList";
import PastAppointmentsList from "./PastAppointmentsList";
import AnalyticsChart from "./AnalyticsChart";
import ImpactMetrics from "./ImpactMetrics";
import BookAppointmentButton from "./BookAppointmentButton";
import AppointmentDetailModal from "./AppointmentDetailModal";
import { useState } from "react";
import { getAllAppointmentsByDonor } from "@/action/donorAppointmentAction";
import Skeleton_line from "@components/ui/skeleton_line";
import { useQuery } from "@tanstack/react-query";
import { startOfToday } from "date-fns";
import moment from "moment";

export default function Page() {
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const { data: appointments, isLoading } = useQuery({
        queryKey: ["donor-appointments"],
        queryFn: async () => {
            const res = await getAllAppointmentsByDonor();
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
    });

    if (isLoading) return <Skeleton_line />;

    // Data extraction for dashboard components

    const today = startOfToday();
    const sortedAppointments = [...appointments].sort(
        (a, b) =>
            new Date(a.time_schedule?.event?.date) -
            new Date(b.time_schedule?.event?.date)
    );
    const upcoming = sortedAppointments.filter(
        (a) => new Date(a.time_schedule?.event?.date) >= today
    );
    const past = sortedAppointments.filter(
        (a) => new Date(a.time_schedule?.event?.date) < today
    );
    const nextAppointment = upcoming[0] || null;

    const lastDonation =
        [...sortedAppointments].reverse().find((a) => a.status === "collected") || null;
    const totalDonations = appointments.filter(
        (a) => a.status === "collected"
    ).length;
    // Eligibility: 90 days after last donation
    let eligibilityCountdown = null;
    if (lastDonation) {
        const lastDate = moment(lastDonation.time_schedule?.event?.date).startOf("day");

        const nextEligible = lastDate.clone().add(90, "days");
        eligibilityCountdown = nextEligible.diff(moment().startOf("day"), "days");
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
            <div className="p-2 md:p-5 space-y-3">
                {/* Dashboard Summary Cards */}
                <SummaryCards
                    nextAppointment={nextAppointment}
                    totalDonations={totalDonations}
                    lastDonation={lastDonation}
                    eligibilityCountdown={eligibilityCountdown}
                />

                {/* Book Appointment Button */}
                <div className="flex">
                    <BookAppointmentButton />
                </div>

                <h3 className="text-lg font-semibold flex-items-center text-blue-600 dark:text-blue-400">
                    <CalendarCheck /> Upcoming Appointments
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Upcoming Appointments (2/3 width) */}
                    <div className="md:col-span-2 space-y-4">
                        <UpcomingAppointmentsList
                            appointments={upcoming}
                            onViewDetails={handleViewDetails}
                        />
                    </div>
                    {/* Analytics Chart (1/3 width) */}
                    <div>
                        <AnalyticsChart appointments={appointments} />
                    </div>
                </div>

                {/* Past Appointments and Impact Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                        <PastAppointmentsList
                            appointments={past}
                            onViewDetails={handleViewDetails}
                        />
                    </div>
                    <div>
                        <ImpactMetrics
                            totalDonations={totalDonations}
                            appointments={appointments}
                        />
                    </div>
                </div>

                {/* Appointment Details Modal (to be conditionally shown) */}
                <AppointmentDetailModal
                    isOpen={modalOpen}
                    appointment={selectedAppointment}
                    onClose={handleCloseModal}
                />
            </div>
        </>
    );
}
