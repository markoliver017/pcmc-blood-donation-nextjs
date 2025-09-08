"use client";

import { useQuery } from "@tanstack/react-query";
import { getDonorAnnouncements } from "@/action/donorAction";
import AnnouncementCard from "./AnnouncementCard";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Bell, ArrowRight } from "lucide-react";
import Link from "next/link";
import Skeleton from "@components/ui/skeleton";

export default function AnnouncementsFeed({ onViewAnnouncement }) {
    const {
        data: announcements,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["donor-announcements"],
        queryFn: () => getDonorAnnouncements(5), // Show latest 3
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl text-blue-500 flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Recent Announcements
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl text-blue-500 flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Recent Announcements
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-4 text-red-500">
                        Failed to load announcements
                    </div>
                </CardContent>
            </Card>
        );
    }

    const announcementsList = announcements?.success ? announcements.data : [];

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-orange-300 md:text-orange-500 flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Recent Announcements
                    </CardTitle>
                    {/* <Link href="/portal/donors/announcements">
                        <Button variant="outline" size="sm">
                            View All
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </Link> */}
                </div>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[1200px] overflow-y-auto pb-10 shadow-b-lg border-b rounded-lg">
                {announcementsList.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No announcements yet</p>
                        <p className="text-sm">Check back later for updates</p>
                    </div>
                ) : (
                    announcementsList.map((announcement) => (
                        <AnnouncementCard
                            key={announcement.id}
                            announcement={announcement}
                            onView={onViewAnnouncement}
                        />
                    ))
                )}
            </CardContent>
        </Card>
    );
}
