"use client";

import { getEventParticipants } from "@/action/hostEventAction";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftCircle, CalendarCheck, Users2 } from "lucide-react";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { useRouter } from "next/navigation";
import { ParticipantsDatatable } from "@components/donors/ParticipantsDatatable";
import Skeleton from "@components/ui/skeleton";
import { appointmentsColumns } from "./appointmentsColumns";

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
        return <Skeleton />;
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
                <ParticipantsDatatable
                    columns={appointmentsColumns}
                    data={participants}
                    isLoading={isLoading}
                />
            </div>
            {/* <pre>{JSON.stringify(data, null, 3)}</pre> */}
        </div>
    );
}
