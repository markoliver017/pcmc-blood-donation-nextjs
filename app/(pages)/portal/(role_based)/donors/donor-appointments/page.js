"use client"
import { DataTable } from "@components/reusable_components/Datatable";

import { useQuery } from "@tanstack/react-query";
import Skeleton_line from "@components/ui/skeleton_line";
import { getAllAppointmentsByDonor } from "@/action/donorAppointmentAction";
import { donorAppointmentColumns } from "./donorAppointmentColumns";

export default function page() {
    const { data, isLoading } = useQuery({
        queryKey: ["donor-appointments"],
        queryFn: async () => {
            const res = await getAllAppointmentsByDonor();
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
    });

    if (isLoading) return <Skeleton_line />

    return (
        <>
            List of Appointments
            <DataTable
                columns={donorAppointmentColumns}
                data={data}
                isLoading={isLoading}
            />
        </>
    );
}
