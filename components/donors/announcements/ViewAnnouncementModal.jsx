"use client";

import { useQuery } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@components/ui/dialog";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { formatDistanceToNowStrict } from "date-fns";
import { Calendar, Building, FileText, User, X } from "lucide-react";
import { fetchAnnouncement } from "@action/announcementAction";
import Skeleton from "@components/ui/skeleton";
import Image from "next/image";
import CustomAvatar from "@components/reusable_components/CustomAvatar";

export default function ViewAnnouncementModal({
    announcementId,
    isOpen,
    onClose,
}) {
    console.log("announcementId", announcementId);
    const { data: announcement, isLoading } = useQuery({
        queryKey: ["announcement", announcementId],
        queryFn: async () => {
            const res = await fetchAnnouncement(announcementId);
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
        enabled: !!announcementId && isOpen,
    });

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto dark:text-white">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-semibold">
                            Announcement Details
                        </DialogTitle>
                    </div>
                </DialogHeader>

                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                ) : announcement ? (
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex items-start gap-4">
                            <div>
                                <CustomAvatar
                                    avatar={
                                        announcement.agency?.file_url ||
                                        announcement.user?.image ||
                                        "/default_avatar.png"
                                    }
                                    className="w-16 h-16"
                                />
                            </div>

                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-2">
                                    {announcement.title}
                                </h2>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Building className="w-4 h-4" />
                                        <span>
                                            {announcement.agency?.name ||
                                                announcement.user?.name ||
                                                "System"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            {formatDistanceToNowStrict(
                                                new Date(
                                                    announcement.createdAt
                                                ),
                                                { addSuffix: true }
                                            )}
                                        </span>
                                    </div>
                                    {announcement.is_public && (
                                        <Badge variant="secondary">
                                            Public
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Image */}
                        {announcement.file_url && (
                            <div className="relative w-full max-w-full overflow-hidden rounded-lg">
                                <Image
                                    src={announcement.file_url}
                                    alt={announcement.title}
                                    width={800}
                                    height={400}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        )}

                        {/* Content */}
                        <Card>
                            <CardContent className="pt-6">
                                <div
                                    className="prose max-w-none [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:overflow-wrap-break-word [&_pre]:max-w-full [&_code]:whitespace-pre-wrap [&_code]:break-words [&_code]:overflow-wrap-break-word [&_code]:max-w-full [&_*]:max-w-full [&_*]:break-words [&_*]:overflow-wrap-break-word"
                                    dangerouslySetInnerHTML={{
                                        __html: announcement.body,
                                    }}
                                />
                            </CardContent>
                        </Card>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <User className="w-4 h-4" />
                                <span>
                                    Posted by {announcement.user?.full_name}
                                </span>
                            </div>
                            <Button variant="outline" onClick={onClose}>
                                Close
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Announcement not found</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
