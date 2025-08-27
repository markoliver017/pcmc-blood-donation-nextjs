"use client";

import { Card } from "@components/ui/card";
import EventCard from "./EventCard";
import { FileClock } from "lucide-react";

export default function EventCardList({
    events,
    booked_appointments = [],
    onLoad,
    onFinish,
    isRegistrationOpen = false,
}) {
    const isAlreadyBooked = (schedId) => {
        return booked_appointments.find(
            (appointment) => appointment.time_schedule_id === schedId
        );
    };

    const getAppointmentId = (eventId) => {
        const data = booked_appointments.find(
            (appointment) => appointment.event_id === eventId
        );
        if (data) return data.appointment_id;
        return null;
    };

    if (!events || events.length === 0)
        return (
            <Card className="col-span-full flex flex-col justify-center items-center text-center py-16">
                <FileClock className="w-12 h-12 mb-4" />
                <h2 className="text-lg md:text-xl font-semibold">
                    No Available Blood Drives
                </h2>
                <p className="text-gray-500 mt-2">
                    Stay tuned — upcoming drives will be announced here. 🎉
                </p>
            </Card>
        );

    return (
        <>
            {events.map((event) => (
                <EventCard
                    key={event.id}
                    event={event}
                    onLoad={onLoad}
                    onFinish={onFinish}
                    isRegistrationOpen={isRegistrationOpen}
                    isAlreadyBooked={isAlreadyBooked}
                    appointmentId={getAppointmentId(event.id)}
                />
            ))}
        </>
    );
}
