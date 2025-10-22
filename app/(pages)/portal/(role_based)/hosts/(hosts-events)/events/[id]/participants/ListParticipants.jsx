"use client";

import { getEventParticipants } from "@/action/hostEventAction";
import { DataTable } from "@components/donors/Datatable";
import { useQuery } from "@tanstack/react-query";
import { hostsParticipantsColumns } from "./hostsParticipantsColumns";
import Skeleton_form from "@components/ui/Skeleton_form";
import { ArrowLeftCircle, CalendarCheck, Users2 } from "lucide-react";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";

import { useRouter } from "next/navigation";
import { ParticipantsDatatable } from "@components/donors/ParticipantsDatatable";

export default function ListParticipants({ eventId }) {
    const router = useRouter();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["event-participants", eventId],
        queryFn: async () => {
            const res = await getEventParticipants(eventId);
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
    });

    if (isLoading) {
        return (
            <div className="p-1 md:p-2">
                <Skeleton_form />
            </div>
        );
    }

    const event = data?.event;
    const participants = data?.donors || [];

    return (
        <div>
            <WrapperHeadMain
                icon={<Users2 />}
                pageTitle={`${event?.title || "Unknown"} - Participants`}
                breadcrumbs={[
                    {
                        path: `/portal/hosts/events/${event?.id || ""}`,
                        icon: <CalendarCheck className="w-4" />,
                        title: `${event?.title || "Unknown"} - Participants`,
                    },
                    {
                        path: `/portal/hosts/events/${
                            event?.id || ""
                        }/participants`,
                        icon: <Users2 className="w-4" />,
                        title: "Participants",
                    },
                ]}
            />
            <div className="px-1 md:px-5 py-2">
                <button
                    type="button"
                    className="btn btn-neutral ring-offset-2 hover:ring hover:ring-blue-500"
                    // href={`/portal/hosts/events/${event?.id}`}
                    onClick={() => router.back() || router.push(`/portal`)}
                >
                    <ArrowLeftCircle className="h-4" />
                    Back
                </button>
                {isError ? (
                    <div className="flex flex-items-center justify-center min-h-[500px]">
                        <div className="alert alert-error p-5 md:p-15 md:text-2xl ">
                            {error.message
                                ? error.message
                                : "An error occurred."}
                        </div>
                    </div>
                ) : (
                    <ParticipantsDatatable
                        columns={hostsParticipantsColumns}
                        data={participants}
                        event={event}
                        isLoading={isLoading}
                    />
                )}
            </div>
            {/* <pre>{JSON.stringify(data, null, 3)}</pre> */}
        </div>
    );
}
