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

import ApprovalRejectComponent from "@components/coordinators/ApprovalRejectComponent";
import { getHostCoordinatorsByStatus } from "@/action/hostCoordinatorAction";
import { FileClock } from "lucide-react";

export default function ForApprovalCoordinatorList() {
    const { data: coordinators, isLoading: coordinatorIsFetching } = useQuery({
        queryKey: ["coordinators", "for approval"],
        queryFn: async () => getHostCoordinatorsByStatus("for approval"),
        staleTime: 0,
        cacheTime: 0,
    });

    if (coordinatorIsFetching)
        return (
            <>
                <Skeleton_user />
                <Skeleton_user />
                <Skeleton_user />
            </>
        );

    if (!coordinators || coordinators.length === 0)
        return (
            <Card className="col-span-full flex flex-col justify-center items-center text-center py-16">
                <FileClock className="w-12 h-12 mb-4 text-primary dark:text-white" />
                <h2 className="text-xl font-semibold">No Pending Approvals</h2>
                <p className="text-gray-500 mt-2">You're all caught up! 🎉</p>
            </Card>
        );

    return (
        <>
            {coordinators.map((coor) => (
                <Card
                    key={coor.id}
                    className="hover:ring-2 hover:ring-blue-400 group transition shadow-lg/40"
                >
                    <CardHeader>
                        <CardTitle className="flex flex-wrap justify-between">
                            <span className="text-xl">{coor.agency.name}</span>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                {moment(coor.createdAt).format("MMM DD, YYYY")}
                            </span>
                        </CardTitle>
                        <CardDescription className="flex flex-wrap flex-col gap-1">
                            <span>{coor.agency.agency_address}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-center justify-center gap-4 px-2 md:px-15 transform transition-transform duration-300 group-hover:scale-105 md:group-hover:scale-110">
                        <div>
                            <CustomAvatar
                                avatar={
                                    coor.user?.image || "/default_avatar.png"
                                }
                                className="flex-none w-[150px] h-[150px] "
                            />
                        </div>
                        <div className="md:flex-1 flex flex-col gap-2">
                            <span className="text-lg text-slate-800 dark:text-slate-100 font-semibold">
                                {coor.user.full_name}
                            </span>
                            <span className="text-blue-700 dark:text-blue-400 italic">
                                {coor.user.email.toLowerCase()}
                            </span>
                            <span className=" text-slate-700 dark:text-slate-400 italic">
                                +63{coor.contact_number}
                            </span>
                        </div>
                    </CardContent>
                    <ApprovalRejectComponent
                        coordinator={coor}
                        callbackUrl="/portal/hosts/manage-coordinators"
                    />
                </Card>
            ))}
        </>
    );
}
