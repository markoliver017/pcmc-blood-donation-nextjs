"use client";

import { getEventParticipants } from "@/action/hostEventAction";
import { DataTable } from "@components/donors/Datatable";
import { useQuery } from "@tanstack/react-query";
import { hostsParticipantsColumns } from "./hostsParticipantsColumns";
import Skeleton_form from "@components/ui/Skeleton_form";
import { ArrowLeftCircle, CalendarCheck, Users2 } from "lucide-react";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import Link from "next/link";
import { BiLeftArrow, BiSolidLeftArrow } from "react-icons/bi";
import { useRouter } from "next/navigation";

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
        return <Skeleton_form />;
    }

    if (isError) {
        return (
            <div className="alert alert-error">
                <pre>{JSON.stringify(error)}</pre>
            </div>
        );
    }

    const event = data?.event;
    const participants = data?.donors || [];

    return (
        <div>
            <WrapperHeadMain
                icon={<Users2 />}
                pageTitle={`${event?.title} - Participants`}
                breadcrumbs={[
                    {
                        path: `/portal/hosts/events/${event?.id}`,
                        icon: <CalendarCheck className="w-4" />,
                        title: `${event?.title} - Participants`,
                    },
                    {
                        path: `/portal/hosts/events/${event?.id}/participants`,
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
                    onClick={() => router.back()}
                >
                    <ArrowLeftCircle className="h-4" />
                    Back
                </button>
                <DataTable
                    columns={hostsParticipantsColumns}
                    data={participants}
                    isLoading={isLoading}
                />
            </div>
            <pre>{JSON.stringify(data, null, 3)}</pre>
        </div>
    );
}
