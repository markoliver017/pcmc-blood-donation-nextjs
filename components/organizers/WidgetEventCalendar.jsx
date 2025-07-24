"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getAgencyId, getDonorEventCalendar } from "@/action/hostEventAction";
import parse from "html-react-parser";
import { CalendarCheck2 } from "lucide-react";
import Skeleton_line from "@components/ui/skeleton_line";
import notify from "@components/ui/notify";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function WidgetEventCalendar() {
    const session = useSession();
    // console.log("session", session);
    const { data: events, isLoading } = useQuery({
        queryKey: ["agency_event_schedules"],
        queryFn: getDonorEventCalendar,
    });

    const { data: agency_id, isLoading: agencyIdIsLoading } = useQuery({
        queryKey: ["agency_id"],
        queryFn: getAgencyId,
    });

    if (isLoading || agencyIdIsLoading || session.status === "loading")
        return <Skeleton_line />;

    const currentRole = session?.data?.user?.role_name;

    return (
        <Card>
            <CardHeader>
                <CardTitle></CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-full">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin]}
                        initialView="dayGridMonth"
                        events={
                            events?.map((event) => ({
                                title: event?.title,

                                start: `${event.date}T08:00:00`,
                                end: `${event.date}T17:00:00`,
                                allDay: false,
                                backgroundColor:
                                    event?.status == "approved"
                                        ? "green"
                                        : "orange",
                                extendedProps: {
                                    isCurrentAgency:
                                        agency_id == event?.agency_id,
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
                            <div className="flex flex-col text-left gap-1 pt-5 rounded-2xl p-2 truncate relative cursor-pointer">
                                {/* <CalendarCheck2 size={20} /> */}
                                {eventInfo.event.title}
                                <>
                                    <span>
                                        {
                                            eventInfo.event.extendedProps
                                                .agency_name
                                        }
                                    </span>
                                    <div className="absolute w-7 h-7 top-0 right-0 ">
                                        <Image
                                            src={
                                                eventInfo.event
                                                    .extendedProps
                                                    .agency_avatar
                                            }
                                            alt={
                                                eventInfo.event
                                                    .extendedProps
                                                    .agency_name
                                            }
                                            fill
                                            className="object-cover rounded-full"
                                        />
                                    </div>
                                </>

                            </div>
                        )}
                        headerToolbar={{
                            start: "title", // Show title at the top
                            center: "", // Clear the center area
                            end: "prev,next today dayGridMonth", // Show buttons at the end
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
                </div>
            </CardContent>
        </Card>
    );
}
