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
import moment from "moment";

import { FileClock, MessageCircle } from "lucide-react";
import { calculateAge } from "@lib/utils/string.utils";
import ApprovalRejectComponent from "@components/donors/ApprovalRejectComponent";
import clsx from "clsx";

export default function ForApprovalDonorList({
    donors = [],
    isFetching = false,
    avatarClassName = "",
}) {
    if (isFetching)
        return (
            <>
                <Skeleton_user />
                <Skeleton_user />
                <Skeleton_user />
            </>
        );

    if (!donors || donors.length === 0)
        return (
            <Card className="col-span-full flex flex-col justify-center items-center text-center py-5 md:py-16">
                <FileClock className="md:w-12 md:h-12 md:mb-4" />
                <h2 className="text-xl font-semibold">No Pending Approvals</h2>
                <p className="text-gray-500 mt-2">You're all caught up! 🎉</p>
            </Card>
        );

    return (
        <>
            {donors.map((donor) => (
                // <Link href={`/portal/hosts/donors/${donor.id}`} key={donor.id}>
                <Card
                    key={donor.id}
                    className="hover:ring-2 hover:ring-blue-400 group transition shadow-lg/40"
                >
                    <CardHeader>
                        <CardTitle className="flex flex-wrap justify-between">
                            <span className="text-xl">
                                {donor.user.full_name}
                            </span>
                            <span className="text-sm text-slate-600 dark:text-slate-300">
                                {moment(donor.createdAt).format("MMM DD, YYYY")}
                            </span>
                        </CardTitle>
                        <CardDescription className="flex flex-wrap flex-col gap-1 dark:text-slate-300">
                            <span>
                                Age: {calculateAge(donor.date_of_birth)}
                            </span>
                            <span>
                                Blood Type:{" "}
                                {donor?.blood_type?.blood_type || "N/A"}
                            </span>
                            <span>Address: {donor.full_address}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-center justify-center gap-4 px-2 md:px-15 text-slate-800 dark:text-slate-200 transform transition-transform duration-300 group-hover:scale-105 md:group-hover:scale-110">
                        <div>
                            <CustomAvatar
                                avatar={
                                    donor.user?.image || "/default_avatar.png"
                                }
                                className={clsx(
                                    "flex-none w-[50px] h-[50px]",
                                    avatarClassName
                                )}
                            />
                        </div>
                        <div className="md:flex-1 flex flex-col items-center gap-2">
                            <span className="text-blue-700">
                                {donor.user.email.toLowerCase()}
                            </span>
                            <span>+63{donor.contact_number}</span>
                            <span className="flex-items-center gap-1 italic">
                                {donor.comments && (
                                    <>
                                        <MessageCircle className="h-4" />
                                        {donor.comments}
                                    </>
                                )}
                            </span>
                        </div>
                    </CardContent>
                    <ApprovalRejectComponent
                        data={donor}
                        callbackUrl={`/portal/hosts/donors/${donor.id}`}
                    />
                </Card>
                // </Link>
            ))}
        </>
    );
}
