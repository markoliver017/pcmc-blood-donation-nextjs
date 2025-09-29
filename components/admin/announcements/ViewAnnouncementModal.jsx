"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@components/ui/dialog";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { formatDistanceToNowStrict } from "date-fns";
import {
    Eye,
    Calendar,
    Building,
    User,
    FileText,
    Pencil,
    User2,
} from "lucide-react";
import { fetchAnnouncement } from "@action/announcementAction";
import { fetchAgency, fetchAgencyById } from "@action/agencyAction";
import Skeleton_line from "@components/ui/skeleton_line";
import Image from "next/image";
import ImagePreviewComponent from "@components/reusable_components/ImagePreviewComponent";
import CustomAvatar from "@components/reusable_components/CustomAvatar";
import { BiMicrophone } from "react-icons/bi";

export default function ViewAnnouncementModal({
    announcementId,
    isOpen,
    onClose,
    onEdit,
}) {
    const { data: announcement, isLoading: isLoadingAnnouncement } = useQuery({
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

    if (isLoadingAnnouncement) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-4xl max-h-[90vh] p-1 md:p-5 overflow-y-auto dark:text-white">
                    <DialogHeader>
                        <DialogTitle>View Announcement</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Skeleton_line />
                        <Skeleton_line />
                        <Skeleton_line />
                        <Skeleton_line />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (!announcement) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="p-1 md:p-5 max-w-4xl dark:text-white">
                    <DialogHeader>
                        <DialogTitle>View Announcement</DialogTitle>
                    </DialogHeader>
                    <div className="text-center py-8">
                        <p className="text-gray-500">Announcement not found</p>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="px-1 md:px-5 max-w-4xl max-h-[90vh] overflow-y-auto dark:text-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                        <BiMicrophone className="h-6 w-6" />
                        View Announcement
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Header Information */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <CardTitle className="text-xl">
                                    {announcement.title}
                                </CardTitle>

                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant={
                                            announcement.is_public
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {announcement.is_public
                                            ? "Public"
                                            : "Private"}
                                    </Badge>
                                    {onEdit && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEdit(announcement)}
                                        >
                                            Edit
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    <span>
                                        Posted by:{" "}
                                        {announcement?.user?.full_name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        Created:{" "}
                                        {formatDistanceToNowStrict(
                                            new Date(announcement.createdAt),
                                            { addSuffix: true }
                                        )}
                                    </span>
                                </div>
                                {announcement.updatedAt !==
                                    announcement.createdAt && (
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            Updated:{" "}
                                            {formatDistanceToNowStrict(
                                                new Date(
                                                    announcement.updatedAt
                                                ),
                                                { addSuffix: true }
                                            )}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Agency Information */}
                    {!announcement.is_public && announcement.agency_id && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Building className="h-5 w-5" />
                                    Target Agency
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-lg flex items-center justify-center">
                                        <CustomAvatar
                                            avatar={
                                                announcement?.agency
                                                    ?.file_url ||
                                                "/default_company_avatar.png"
                                            }
                                            className="h-12 w-12"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">
                                            {announcement?.agency?.name}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {
                                                announcement?.agency
                                                    ?.agency_address
                                            }
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Content */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Content
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="prose prose-sm max-w-none dark:prose-invert"
                                dangerouslySetInnerHTML={{
                                    __html: announcement.body,
                                }}
                            />
                        </CardContent>
                    </Card>

                    {/* Image Attachment */}
                    {announcement.file_url && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Attachment
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <div className="h-32 w-32 relative">
                                        <Image
                                            src={announcement.file_url}
                                            alt="Announcement attachment"
                                            fill
                                            className="object-cover rounded-lg"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <ImagePreviewComponent
                                            imgSrc={announcement.file_url}
                                            className="btn-sm btn-outline"
                                        />
                                        <p className="text-sm text-gray-600">
                                            Click to view full size
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                        {onEdit && (
                            <Button
                                variant="default"
                                onClick={() => onEdit(announcement)}
                            >
                                <Pencil className="h-4 w-4" />
                                Edit Announcement
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
