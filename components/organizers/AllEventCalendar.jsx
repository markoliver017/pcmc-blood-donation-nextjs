"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getAgencyId, getAllEvents } from "@/action/hostEventAction";
import parse from "html-react-parser";
import { CalendarCheck2 } from "lucide-react";
import Skeleton_line from "@components/ui/skeleton_line";
import notify from "@components/ui/notify";
import Image from "next/image";

export default function AllEventCalendar() {
    const { data: events, isLoading } = useQuery({
        queryKey: ["all_event_schedules"],
        queryFn: getAllEvents,
    });
    const { data: agency_id, isLoading: agencyIdIsLoading } = useQuery({
        queryKey: ["agency_id"],
        queryFn: getAgencyId,
    });

    if (isLoading || agencyIdIsLoading) return <Skeleton_line />;

    return (
        <Card>
            <CardHeader>
                <CardTitle></CardTitle>
            </CardHeader>
            <CardContent>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin]}
                    initialView="dayGridMonth"
                    events={
                        events?.map((event) => ({
                            title: event?.title,
                            // agency_id == event?.agency_id
                            //     ? event?.title
                            //     : "",
                            start: `${event.date}T08:00:00`,
                            end: `${event.date}T17:00:00`,

                            // new Date(event.from_date).getTime() ===
                            // new Date(event.to_date).getTime()
                            //     ? new Date(
                            //           `${event.to_date}T17:00:00`
                            //       ).toISOString()
                            //     : new Date(
                            //           new Date(event.to_date).setMinutes(
                            //               new Date(
                            //                   event.to_date
                            //               ).getMinutes() + 1
                            //           )
                            //       ).toISOString(),

                            allDay: false,
                            backgroundColor:
                                event?.status == "approved"
                                    ? "green"
                                    : "orange",
                            extendedProps: {
                                isCurrentAgency: agency_id == event?.agency_id,
                                status: event?.status,
                                description: event?.description,
                                agency_name: event?.agency.name,
                                agency_avatar:
                                    event?.agency?.file_url ||
                                    "/default_company_avatar.png",
                            },
                        })) || []
                    }
                    eventDisplay="block"
                    eventContent={(eventInfo) => (
                        <div className="flex text-left gap-1 pt-5 rounded-2xl p-2 truncate relative cursor-pointer">
                            {/* <CalendarCheck2 size={20} /> */}
                            {eventInfo.event.title}
                            {eventInfo.event.extendedProps.isCurrentAgency && (
                                <Image
                                    src={
                                        eventInfo.event.extendedProps
                                            .agency_avatar
                                    }
                                    alt={
                                        eventInfo.event.extendedProps
                                            .agency_name
                                    }
                                    width={50}
                                    height={50}
                                    className="absolute top-0 right-0 rounded-full max-w-6 max-h-6"
                                />
                            )}
                        </div>
                    )}
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
                        alert(`Event Title: ${info.event?.title} `)
                    }
                    height="100%"
                    contentHeight="auto"
                    // aspectRatio={3} //Sets the aspect ratio of the calendar. A higher value will make the calendar wider, while a lower value will make it taller.
                />
            </CardContent>
        </Card>
    );
}
