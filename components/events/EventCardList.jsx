"use client";

import EventCard from "./EventCard";


export default function EventCardList({
    events,
    booked_appointments,
    onLoad,
    onFinish,
    isRegistrationOpen = false,
}) {
    if (!events || events.length === 0)
        return (
            <Card className="col-span-full flex flex-col justify-center items-center text-center py-16">
                <FileClock className="w-12 h-12 mb-4 text-primary" />
                <h2 className="text-xl font-semibold">
                    No Ongoing Blood Drives
                </h2>
                <p className="text-gray-500 mt-2">
                    Stay tuned — upcoming drives will be announced here. 🎉
                </p>
            </Card>
        );

    const isAlreadyBooked = (id) => booked_appointments.includes(id);

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
                />
            ))}
        </>
    );
}
