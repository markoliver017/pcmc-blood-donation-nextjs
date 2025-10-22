"use client";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { Calendar, CalendarCheck } from "lucide-react";
import SummaryCards from "./SummaryCards";
import UpcomingAppointmentsList from "./UpcomingAppointmentsList";
import PastAppointmentsList from "./PastAppointmentsList";
import AnalyticsChart from "./AnalyticsChart";
import ImpactMetrics from "./ImpactMetrics";
// import BookAppointmentButton from "./BookAppointmentButton";
import AppointmentDetailModal from "./AppointmentDetailModal";
import { useState } from "react";
import { getAllAppointmentsByDonor } from "@/action/donorAppointmentAction";
import Skeleton_line from "@components/ui/skeleton_line";
import { useQuery } from "@tanstack/react-query";
import { startOfToday } from "date-fns";
import moment from "moment";
import { MdDashboard } from "react-icons/md";

export default function Page() {
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const { data: donor_data, isLoading } = useQuery({
        queryKey: ["donor-appointments"],
        queryFn: async () => {
            const res = await getAllAppointmentsByDonor();
            if (!res.success) {
                throw res;
            }
            return res;
        },
    });

    const appointments = donor_data?.data || [];
    const last_donation_date = donor_data?.last_donation_date || null;
    const donor = donor_data?.donor || null;

    if (isLoading) return <Skeleton_line />;

    // Data extraction for dashboard components

    const today = startOfToday();
    const sortedAppointments = [...appointments].sort(
        (a, b) =>
            new Date(a.time_schedule?.event?.date) -
            new Date(b.time_schedule?.event?.date)
    );
    const upcoming = sortedAppointments.filter(
        (a) =>
            new Date(a.time_schedule?.event?.date) >= today &&
            a.status !== "cancelled"
    );
    const past = sortedAppointments.filter(
        (a) =>
            new Date(a.time_schedule?.event?.date) < today ||
            a.status === "cancelled"
    );
    const nextAppointment = upcoming[0] || null;

    const lastDonation =
        [...sortedAppointments]
            .reverse()
            .find((a) => a.status === "collected" || a.status === "deferred") ||
        null;
    let totalDonations = appointments.filter(
        (a) => a.status === "collected"
    ).length;

    if (donor?.blood_history) {
        totalDonations += donor.blood_history.previous_donation_count;
    }

    // Eligibility: 90 days after last donation
    let eligibilityCountdown = last_donation_date;
    if (lastDonation && lastDonation.status === "collected") {
        const lastDate = moment(
            lastDonation.time_schedule?.event?.date
        ).startOf("day");

        const nextEligible = lastDate.clone().add(90, "days");
        eligibilityCountdown = nextEligible.diff(
            moment().startOf("day"),
            "days"
        );
        if (eligibilityCountdown < 0) {
            eligibilityCountdown = 0;
        }
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
                        path: "/portal",
                        icon: <MdDashboard className="w-4" />,
                        title: "Dashboard",
                    },
                    {
                        path: "/portal/donors/donor-appointments",
                        icon: <Calendar className="w-4" />,
                        title: "Appointments",
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
                {/* <div className="flex">
                    <BookAppointmentButton />
                </div> */}

                <div className="divider"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                        {/* Upcoming Appointments (2/3 width) */}
                        <h3 className="text-lg flex-items-center font-extrabold text-blue-600 dark:text-blue-400">
                            <CalendarCheck /> Upcoming Appointments
                        </h3>
                        <UpcomingAppointmentsList
                            appointments={upcoming}
                            onViewDetails={handleViewDetails}
                        />
                        <div className="divider"></div>
                        {/* Past Appointments and Impact Metrics */}
                        <h3 className="text-lg flex-items-center font-extrabold text-orange-600 dark:text-orange-400">
                            <CalendarCheck /> Past Appointments
                        </h3>
                        <PastAppointmentsList
                            appointments={past}
                            onViewDetails={handleViewDetails}
                        />
                    </div>
                    {/* Analytics Chart (1/3 width) */}
                    <div className="flex flex-col gap-4">
                        <AnalyticsChart appointments={appointments} />
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
