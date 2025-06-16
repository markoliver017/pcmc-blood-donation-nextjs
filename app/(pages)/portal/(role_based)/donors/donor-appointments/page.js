"use client";
import { DataTable } from "@components/reusable_components/Datatable";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";

import { useQuery } from "@tanstack/react-query";
import Skeleton_line from "@components/ui/skeleton_line";
import { getAllAppointmentsByDonor } from "@/action/donorAppointmentAction";
import { donorAppointmentColumns } from "./donorAppointmentColumns";
import { Card } from "@components/ui/card";
import { Calendar, Calendar1 } from "lucide-react";
import Link from "next/link";

export default function Page() {
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

    if (isLoading) return <Skeleton_line />;

    return (
        <>
            <WrapperHeadMain
                icon={<Calendar />}
                pageTitle="My Appointments"
                breadcrumbs={[
                    {
                        path: "/portal/donors/donor-appointments",
                        icon: <Calendar className="w-4" />,
                        title: "My Appointments",
                    },
                ]}
            />
            <div className="p-2 md:p-5">

                {data.length === 0 ? (

                    <Card className="col-span-full flex flex-col justify-center items-center text-center py-16 ">
                        <Calendar1 className="w-12 h-12 mb-4" />
                        <h2 className="text-xl font-semibold">No Appointments Yet</h2>
                        <p className="text-gray-500 mt-2">
                            Ready to donate? Book your first appointment to get started.
                        </p>
                        <Link
                            href="/portal/donors/events"
                            className="btn btn-primary mt-2"
                        >
                            Go to Donation Drives
                        </Link>
                    </Card>)
                    : (

                        <DataTable
                            columns={donorAppointmentColumns}
                            data={data}
                            isLoading={isLoading}
                        />
                    )}
            </div>
        </>
    );
}
