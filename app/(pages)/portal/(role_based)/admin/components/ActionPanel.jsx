"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import ForApprovalEventList from "../(admin-events)/events/(index)/ForApprovalEventList";
import ForApprovalAgencyList from "../(agencies)/agencies/(index)/ForApprovalAgencyList";

export default function ActionPanel({ events, agencies, isLoading }) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-xl">Action Needed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Link
                        href="/portal/admin/events?tab=for-approval"
                        className="btn btn-block justify-between text-orange-800 dark:text-orange-400"
                    >
                        For Approval - Blood Drives ({events?.length || 0})
                        <FaArrowRight />
                    </Link>
                    <div className="max-h-72 overflow-y-auto mt-2 flex flex-col gap-4 p-2">
                        <ForApprovalEventList
                            events={events}
                            eventsIsFetching={isLoading}
                        />
                    </div>
                </div>
                <div className="divider" />
                <div>
                    <Link
                        href="/portal/admin/agencies?tab=for-approval"
                        className="btn btn-block justify-between text-orange-800 dark:text-orange-400"
                    >
                        For Approval - Agencies ({agencies?.length || 0})
                        <FaArrowRight />
                    </Link>
                    <div className="max-h-72 overflow-y-auto mt-2 flex flex-col gap-4 p-2">
                        <ForApprovalAgencyList
                            agencies={agencies}
                            isFetching={isLoading}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
