"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
// import { useQuery } from "@tanstack/react-query";

export default function EventCalendar() {
    // const {data, isLoading} = useQuery({
    //     queryKey: ["event_schedules"],
    //     queryFn:
    // })
    const events = [
        {
            title: "NRECA Community Blood Drive",
            start: "2025-05-14T10:00:00",
            end: "2025-05-15T16:00:00",
            extendedProps: {
                location: "Arlington, VA",
                organizer: "Inova Blood Donor Services",
            },
        },
        // Add more events
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle></CardTitle>
            </CardHeader>
            <CardContent>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    headerToolbar={{
                        start: "title", // Show title at the top
                        center: "", // Clear the center area
                        end: "prev,next today dayGridMonth timeGridWeek timeGridDay", // Show buttons at the end
                    }}
                    buttonText={{
                        today: "Today", // Customize button text
                        month: "Month",
                        week: "Week",
                        day: "Day",
                        list: "List",
                    }}
                    views={{
                        dayGridMonth: { buttonText: "Month" },
                        timeGridWeek: { buttonText: "Week" },
                        timeGridDay: { buttonText: "Day" },
                    }}
                    eventClick={(info) =>
                        alert(
                            `Event: ${info.event.title}, Location: ${info.event.extendedProps.location}`
                        )
                    }
                    height="100%"
                    contentHeight="auto"
                    // aspectRatio={3} //Sets the aspect ratio of the calendar. A higher value will make the calendar wider, while a lower value will make it taller.
                />
            </CardContent>
        </Card>
    );
}
