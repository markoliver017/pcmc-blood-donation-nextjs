"use client"
import { getBookedAppointmentById, getBookedAppointmentsByDonor } from '@/action/donorAppointmentAction';
import EventCard from '@components/events/EventCard';
import LoadingModal from '@components/layout/LoadingModal';
import WrapperHeadMain from '@components/layout/WrapperHeadMain';
import Skeleton_form from '@components/ui/Skeleton_form';
import { formatFormalName } from '@lib/utils/string.utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeftCircleIcon, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

export default function AppointmentComponent({ id }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const queryClient = useQueryClient();
    const {
        data: appointment,
        isLoading: appointmentIsLoading,
        error,
        isError,
    } = useQuery({
        queryKey: ["appointment", id],
        queryFn: async () => {
            const res = await getBookedAppointmentById(id);

            if (!res.success) {
                throw res?.message || "unknown error";
            }
            return res.data;
        },
    });
    const {
        data: donor_booked_appointments,
        isLoading: donorBookedAppointmentIsLoading,
        error: donorBookedAppointmentError,
        isError: donorBookedAppointmentIsError,
    } = useQuery({
        queryKey: ["donor_booked_appointments"],
        queryFn: async () => {
            const res = await getBookedAppointmentsByDonor();

            if (!res.success) {
                throw res?.message || "unknown error";
            }
            return res.data;
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });

    const onLoad = () => {
        setIsLoading(true);
    };

    const handleProcessedBooking = () => {
        setIsLoading(false);
        queryClient.invalidateQueries({
            queryKey: ["donor-appointments"],
        });
        queryClient.invalidateQueries({
            queryKey: ["donor_booked_appointments"],
        });
        router.replace("/portal/donors/donor-appointments");
    };

    if (appointmentIsLoading || donorBookedAppointmentIsLoading) return <Skeleton_form />

    if (isError) {
        return <div className="alert alert-error">{JSON.stringify(error)}</div>
    }
    if (donorBookedAppointmentIsError) {
        return <div className="alert alert-error">{JSON.stringify(donorBookedAppointmentError)}</div>
    }

    const event = appointment?.event;

    const booked_appointments = donor_booked_appointments.map(
        (app) => ({
            appointment_id: app.id,
            time_schedule_id: app.time_schedule_id,
            event_id: app.event_id
        })
    )

    const isAlreadyBooked = (schedId) => {
        return booked_appointments.find(
            (appointment) => appointment.time_schedule_id === schedId
        );
    };

    if (appointment.status === "cancelled") {
        router.back()
    }

    return (
        <>
            <WrapperHeadMain
                icon={<Calendar />}
                pageTitle="My Appointment Details"
                breadcrumbs={[
                    {
                        path: "/portal/donors/donor-appointments",
                        icon: <Calendar className="w-4" />,
                        title: `My Appointments`,
                    },
                    {
                        path: `/portal/donors/donor-appointment/${id}`,
                        icon: <Calendar className="w-4" />,
                        title: formatFormalName(event?.title),
                    },
                ]}
            />
            <div className='p-1 w-full md:max-w-8/10 lg:max-w-6/10 mx-auto py-5'>
                <button
                    onClick={() => router.back()}
                    className='btn btn-neutral mb-2'
                    type='button'
                >
                    <ArrowLeftCircleIcon />
                    Back
                </button>
                <LoadingModal imgSrc="/loader_3.gif" isLoading={isLoading} />
                <EventCard
                    event={event}
                    onFinish={handleProcessedBooking}
                    onLoad={onLoad}
                    isRegistrationOpen={true}
                    isAlreadyBooked={isAlreadyBooked}
                    appointmentId={id}
                />
                {/* <pre>
                {JSON.stringify(event, null, 3)}
            </pre> */}
            </div>
        </>
    )
}
