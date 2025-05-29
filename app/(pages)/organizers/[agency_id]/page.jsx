import { fetchAgencyByName } from "@/action/agencyAction";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { formatFormalName } from "@lib/utils/string.utils";
import { Calendar, DropletIcon, User2 } from "lucide-react";
import moment from "moment";
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
                    <CardTitle className="flex justify-between">
                        <h1 className="text-2xl flex-items-center gap-2"><User2 /> New Donor Registration</h1>
                        <span className="text-slate-700 flex-items-center gap-2"><Calendar /> {moment().format("MMM DD, YYYY | dddd hh:mm A")}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4">
                    <div className="border p-5 rounded-2xl max-w-80">
                        {/* Avatar + Agency Name */}
                        <div className="flex-none flex flex-wrap items-center gap-4">
                            <Image
                                width={150}
                                height={150}
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
                        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1 flex-1 mt-5">
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
                    <Card className="flex-1">
                        <CardContent>

                            Registration Form
                        </CardContent>
                    </Card>

                </CardContent>
            </Card>
            <pre>{JSON.stringify(agency, null, 3)}</pre>
        </>
    );
}
