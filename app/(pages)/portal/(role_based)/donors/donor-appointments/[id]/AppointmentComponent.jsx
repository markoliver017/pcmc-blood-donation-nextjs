"use client"
import { getBookedAppointmentById } from '@/action/donorAppointmentAction';
import EventCard from '@components/events/EventCard';
import WrapperHeadMain from '@components/layout/WrapperHeadMain';
import Skeleton_form from '@components/ui/Skeleton_form';
import { formatFormalName } from '@lib/utils/string.utils';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeftCircleIcon, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'

export default function AppointmentComponent({ id }) {
    const router = useRouter()
    const {
        data: event,
        isLoading,
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

    if (isLoading) return <Skeleton_form />

    if (isError) {
        return <div className="alert alert-error">{JSON.stringify(error)}</div>
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
            <div className='max-w-6/10 mx-auto py-5'>
                <button
                    onClick={() => router.back()}
                    className='btn btn-neutral mb-2'
                    type='button'
                >
                    <ArrowLeftCircleIcon />
                    Back
                </button>
                <EventCard event={event} />
                {/* <pre>
                {JSON.stringify(event, null, 3)}
            </pre> */}
            </div>
        </>
    )
}
