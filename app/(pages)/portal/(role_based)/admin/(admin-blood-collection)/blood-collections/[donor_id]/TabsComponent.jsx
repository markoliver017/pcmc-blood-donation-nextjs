"use client";
import React from "react";
import { Calendar, List } from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import Skeleton_user from "@components/ui/Skeleton_user";

import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import SideComponent from "./SideComponent";
import { MdBloodtype } from "react-icons/md";
import { useRouter } from "next/navigation";
import { getDonorBloodCollections } from "@/action/bloodCollectionAction";
import TabContent from "./TabContent";
import {
    getAllAgencyOptions,
    getAllEventOptions,
} from "@/action/adminEventAction";

export default function TabsComponent({ donorId }) {
    const router = useRouter();
    const { data: donor, isLoading } = useQuery({
        queryKey: ["donor-blood-collections", donorId],
        queryFn: async () => {
            const res = await getDonorBloodCollections(donorId);
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
    });

    if (isLoading)
        return (
            <div className="p-5">
                <Skeleton_user />
            </div>
        );
    const user = donor?.user;

    return (
        <>
            <WrapperHeadMain
                icon={<MdBloodtype />}
                pageTitle={`Donation Details - ${user?.full_name}`}
                breadcrumbs={[
                    {
                        path: `/portal/admin/blood-collections`,
                        icon: <List className="w-4" />,
                        title: "Blood Donations",
                    },
                    {
                        path: `/portal/admin/blood-collections/${donorId}`,
                        icon: <InfoCircledIcon className="w-4" />,
                        title: "Donation Details",
                    },
                ]}
            />
            <div className="w-full md:w-95/100 mx-auto p-1 md:p-2 grid grid-cols-1 md:grid-cols-4 gap-2">
                {/* Side panel: Event Details */}
                <SideComponent donor={donor} />
                {/* Right Panel: Main Content Area */}
                <TabContent donor={donor} />
            </div>
        </>
    );
}
