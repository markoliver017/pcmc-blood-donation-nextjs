"use client";
import React from "react";
import CoordinatorList from "./CoordinatorList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import ForApprovalCoordinatorList from "./ForApprovalCoordinatorList";
import {
    getHostCoordinatorsByStatus,
    getVerifiedCoordinatorsByAgency,
} from "@/action/hostCoordinatorAction";
import { useQuery } from "@tanstack/react-query";

export default function Container() {
    const coordinators_query = useQuery({
        queryKey: ["verified-coordinators"],
        queryFn: getVerifiedCoordinatorsByAgency,
        staleTime: 1 * 60 * 1000, // Data is fresh for 1 minute
        cacheTime: 2 * 60 * 1000, // Cache persists for 2 minute
    });

    const for_approval_coordinators_query = useQuery({
        queryKey: ["coordinators", "for approval"],
        queryFn: async () => getHostCoordinatorsByStatus("for approval"),
        staleTime: 0,
        cacheTime: 0,
    });

    return (
        <Tabs defaultValue="all" className="p-2 md:p-5">
            <TabsList>
                <TabsTrigger value="all">
                    All ({coordinators_query?.data?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="for-approval">
                    For Approval (
                    {for_approval_coordinators_query?.data?.length || 0})
                </TabsTrigger>
            </TabsList>
            <TabsContent value="all">
                <div className="w-full h-full 2xl:px-5 mx-auto shadow-lg space-y-3">
                    <CoordinatorList coordinators_query={coordinators_query} />
                </div>
            </TabsContent>
            <TabsContent value="for-approval">
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 p-3 w-full">
                    <ForApprovalCoordinatorList
                        for_approval_coordinators_query={
                            for_approval_coordinators_query
                        }
                    />
                </div>
            </TabsContent>
        </Tabs>
    );
}
