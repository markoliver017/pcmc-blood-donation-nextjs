"use client";
import CustomAvatar from "@components/reusable_components/CustomAvatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import Skeleton_user from "@components/ui/Skeleton_user";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

import { FileClock } from "lucide-react";
import { getDonorsByStatus } from "@/action/donorAction";
import { calculateAge } from "@lib/utils/string.utils";
import ApprovalRejectComponent from "@components/donors/ApprovalRejectComponent";

export default function ForApprovalDonorList() {
    const { data: donors, isLoading: donorsIsFetching } = useQuery({
        queryKey: ["donors", "for approval"],
        queryFn: async () => getDonorsByStatus("for approval"),
        staleTime: 0,
        cacheTime: 0,
    });

    if (donorsIsFetching)
        return (
            <>
                <Skeleton_user />
                <Skeleton_user />
                <Skeleton_user />
            </>
        );

    if (!donors || donors.length === 0)
        return (
            <Card className="col-span-full flex flex-col justify-center items-center text-center py-16">
                <FileClock className="w-12 h-12 mb-4 text-primary" />
                <h2 className="text-xl font-semibold">No Pending Approvals</h2>
                <p className="text-gray-500 mt-2">You're all caught up! 🎉</p>
            </Card>
        );

    return (
        <>
            {donors.map((donor) => (
                <Card
                    key={donor.id}
                    className="hover:ring-2 hover:ring-blue-400 group transition shadow-lg/40"
                >
                    <CardHeader>
                        <CardTitle className="flex flex-wrap justify-between">
                            <span className="text-xl">
                                {donor.user.full_name}
                            </span>
                            <span className="text-sm text-slate-600">
                                {moment(donor.createdAt).format("MMM DD, YYYY")}
                            </span>
                        </CardTitle>
                        <CardDescription className="flex flex-wrap flex-col gap-1">
                            <span>
                                Age: {calculateAge(donor.date_of_birth)}
                            </span>
                            <span>
                                Blood Type:{" "}
                                {donor?.blood_type?.blood_type || "N/A"}
                            </span>
                            <span>Address: {donor.full_address}</span>
                            <ApprovalRejectComponent
                                data={donor}
                                callbackUrl={`/portal/admin/donors/${donor.id}`}
                            />
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-center justify-center gap-4 px-2 md:px-15 transform transition-transform duration-300 group-hover:scale-105 md:group-hover:scale-110">
                        <div>
                            <CustomAvatar
                                avatar={
                                    donor.user?.image || "/default_avatar.png"
                                }
                                className="flex-none w-[150px] h-[150px] "
                            />
                        </div>
                        <div className="md:flex-1 flex flex-col gap-2">
                            <span className="text-lg text-slate-800 font-semibold">
                                {donor.agency.name}
                            </span>
                            <span className="text-blue-700">
                                {donor.user.email.toLowerCase()}
                            </span>
                            <span className=" text-slate-700">
                                {donor.contact_number}
                            </span>
                            <span className=" text-slate-700 italic">
                                {donor.comments}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </>
    );
}
