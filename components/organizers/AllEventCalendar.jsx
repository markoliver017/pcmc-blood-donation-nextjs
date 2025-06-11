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
                            start: event.from_date,
                            end:
                                new Date(event.from_date).getTime() ===
                                new Date(event.to_date).getTime()
                                    ? event.to_date
                                    : new Date(
                                          new Date(event.to_date).setMinutes(
                                              new Date(
                                                  event.to_date
                                              ).getMinutes() + 1
                                          )
                                      ).toISOString(),
                            backgroundColor:
                                event?.status == "approved"
                                    ? "green"
                                    : "orange",
                            extendedProps: {
                                isCurrentAgency: agency_id == event?.agency_id,
                                status: event?.status,
                                description: event?.description,
                            },
                        })) || []
                    }
                    eventContent={(eventInfo) => (
                        <div className="flex justify-center items-center gap-1 rounded-2xl p-2">
                            <CalendarCheck2 size={20} /> {eventInfo.event.title}
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
                    eventClick={(info) => alert(`Event - ${info.event?.title}`)}
                    height="100%"
                    contentHeight="auto"
                    // aspectRatio={3} //Sets the aspect ratio of the calendar. A higher value will make the calendar wider, while a lower value will make it taller.
                />
            </CardContent>
        </Card>
    );
}
