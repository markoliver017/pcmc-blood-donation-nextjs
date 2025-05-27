import { fetchAgencyByName } from "@/action/agencyAction";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { formatFormalName } from "@lib/utils/string.utils";
import Image from "next/image";
import { redirect } from "next/navigation";

import React from "react";

export default async function Page({ params }) {
    const { agency_name } = await params;
    const agency = await fetchAgencyByName(agency_name);

    if (!agency.success) {
        redirect("/register/donors");
    }
    const { data } = agency;
    return (
        <>
            <Card className="p-4">
                <CardHeader>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        {/* Avatar + Agency Name */}
                        <div className="flex-none border p-5 rounded-2xl flex items-center gap-4">
                            <Image
                                width={64}
                                height={64}
                                className="rounded-md object-cover border"
                                src={
                                    data.file_url ||
                                    "/default_company_avatar.png"
                                }
                                alt="Agency Avatar"
                            />
                            <h2 className="text-2xl font-bold">
                                {data.name.toUpperCase()}
                            </h2>
                        </div>

                        {/* Agency Details */}
                        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1 flex-1">
                            <div>
                                <span className="font-semibold">
                                    Email Address:{" "}
                                </span>
                                <span>{data.head.email}</span>
                            </div>
                            <div>
                                <span className="font-semibold">Address: </span>
                                <span>
                                    {data.address}, {data.barangay},{" "}
                                    {data.city_municipality}, {data.province},{" "}
                                    {formatFormalName(data.region)}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>
            <pre>{JSON.stringify(agency, null, 3)}</pre>
        </>
    );
}
