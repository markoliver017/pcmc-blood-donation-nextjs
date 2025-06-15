"use client"

import { getEventParticipants } from "@/action/hostEventAction";
import { useQuery } from "@tanstack/react-query";

export default function ListParticipants({ eventId }) {
    const { data, isLoading } = useQuery({
        queryKey: ["event-participants", eventId],
        queryFn: async () => {
            const res = await getEventParticipants(eventId);
            if (!res.success) {
                throw res;
            }
            return res.data
        }
    });

    return (
        <div>
            <pre>
                {JSON.stringify(data, null, 3)}
            </pre>
        </div>
    )
}
