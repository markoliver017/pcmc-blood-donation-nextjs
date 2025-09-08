"use client";

import { Card, CardContent, CardHeader } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { formatDistanceToNowStrict } from "date-fns";
import { Eye, Calendar, Building, FileText, UserCog } from "lucide-react";
import Image from "next/image";
import CustomAvatar from "@components/reusable_components/CustomAvatar";

export default function AnnouncementCard({ announcement, onView }) {
    const isPublic = announcement.is_public;
    const hasImage = announcement.file_url;

    return (
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <CustomAvatar
                            avatar={
                                announcement.agency?.file_url ||
                                announcement.user?.image ||
                                "/default_avatar.png"
                            }
                            className="w-10 h-10"
                        />
                        <div>
                            <h3 className="font-semibold text-lg line-clamp-2">
                                {announcement.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                {isPublic ? (
                                    <UserCog className="w-4 h-4" />
                                ) : (
                                    <Building className="w-4 h-4" />
                                )}
                                <span>
                                    {announcement.agency?.name ||
                                        announcement.user?.full_name ||
                                        "System"}
                                </span>
                                {isPublic && (
                                    <Badge
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        Public
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>
                            {formatDistanceToNowStrict(
                                new Date(announcement.createdAt),
                                { addSuffix: true }
                            )}
                        </span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                {hasImage && (
                    <div className="mb-3">
                        <Image
                            src={announcement.file_url}
                            alt={announcement.title}
                            width={300}
                            height={200}
                            className="w-full h-32 object-cover rounded-md"
                            unoptimized={
                                process.env.NEXT_PUBLIC_NODE_ENV ===
                                "production"
                            }
                        />
                    </div>
                )}

                <div
                    className="text-sm text-gray-600 line-clamp-3 mb-3"
                    dangerouslySetInnerHTML={{ __html: announcement.body }}
                />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <FileText className="w-3 h-3" />
                        <span>By {announcement.user?.full_name}</span>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onView(announcement.id)}
                        className="text-xs"
                    >
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
