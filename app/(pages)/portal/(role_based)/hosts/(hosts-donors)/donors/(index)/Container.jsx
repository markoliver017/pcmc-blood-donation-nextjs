"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import DonorList from "./DonorList";
import ForApprovalDonorList from "../(index)/ForApprovalDonorList";
import {
    getHostDonorsByStatus,
    getVerifiedDonorsByAgency,
} from "@/action/hostDonorAction";

export default function Container() {
    const donors_query = useQuery({
        queryKey: ["verified-donors"],
        queryFn: getVerifiedDonorsByAgency,
        staleTime: 1 * 60 * 1000, // Data is fresh for 1 minute
        cacheTime: 2 * 60 * 1000, // Cache persists for 2 minute
    });

    const { data: donorsForApproval, isLoading: donorsIsFetching } = useQuery({
        queryKey: ["donors", "for approval"],
        queryFn: async () => getHostDonorsByStatus("for approval"),
        staleTime: 0,
        cacheTime: 0,
    });
    return (
        <Tabs defaultValue="all" className="p-1 md:p-5">
            <TabsList>
                <TabsTrigger value="all">
                    All ({donors_query?.data?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="for-approval">
                    For Approval ({donorsForApproval?.length || 0})
                </TabsTrigger>
            </TabsList>
            <TabsContent value="all">
                <div className="w-full h-full 2xl:px-5 mx-auto shadow-lg space-y-3">
                    <DonorList donors_query={donors_query} />
                </div>
            </TabsContent>
            <TabsContent value="for-approval">
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 p-3 w-full">
                    <ForApprovalDonorList
                        donors={donorsForApproval}
                        isFetching={donorsIsFetching}
                        avatarClassName="md:w-[150px] md:h-[150px]"
                    />
                </div>
            </TabsContent>
        </Tabs>
    );
}
