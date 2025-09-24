"use client";

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@components/ui/badge";
import { formatDistanceToNowStrict } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@components/ui/table";
import { fetchAnnouncements } from "@action/announcementAction";
import { DataTable } from "@components/reusable_components/Datatable";
import { Button } from "@components/ui/button";
import { Eye, Pencil, Trash2, FileText } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SweetAlert from "@components/ui/SweetAlert";
import notify from "@components/ui/notify";
import { deleteAnnouncement } from "@action/announcementAction";
import DataTableColumnHeader from "@components/reusable_components/DataTableColumnHeader";

const getColumns = (handleUpdate, handleView) => {
    const queryClient = useQueryClient();
    const { mutate: deleteAnnouncementMutation, isPending: isDeleting } =
        useMutation({
            mutationFn: async (id) => {
                const res = await deleteAnnouncement(id);
                if (!res.success) throw res;
                return res;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["host-announcements"],
                });
                queryClient.invalidateQueries({ queryKey: ["announcements"] });
                notify({ message: "Announcement deleted successfully" });
            },
            onError: (error) => {
                notify({
                    error: true,
                    message: error?.message || "Failed to delete announcement",
                });
            },
        });

    return [
        {
            accessorKey: "title",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Title" />
            ),
            cell: ({ row }) => {
                const title = row.original.title;
                return (
                    <div className="max-w-xs">
                        <p className="font-medium truncate" title={title}>
                            {title}
                        </p>
                    </div>
                );
            },
        },
        {
            accessorKey: "is_public",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Visibility" />
            ),
            cell: ({ row }) => {
                const isPublic = row.original.is_public;
                return (
                    <Badge
                        className={
                            isPublic
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                        }
                    >
                        {isPublic ? "Public" : "Agency"}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Created" />
            ),
            cell: ({ row }) =>
                formatDistanceToNowStrict(new Date(row.original.createdAt), {
                    addSuffix: true,
                }),
        },
        {
            accessorKey: "file_url",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Attachment" />
            ),
            cell: ({ row }) => {
                const fileUrl = row.original.file_url;
                return fileUrl ? (
                    <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className="text-xs text-blue-600 dark:text-blue-400">
                            Has file
                        </span>
                    </div>
                ) : (
                    <span className="text-xs text-gray-400">No file</span>
                );
            },
        },
        {
            accessorKey: "actions",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Actions" />
            ),
            cell: ({ row }) => {
                const data = row.original;
                const id = data.id;
                const isPublic = data.is_public;
                return (
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(id)}
                            className="flex items-center gap-1"
                        >
                            <Eye className="w-4 h-4" />
                            <span className="hidden md:inline">View</span>
                        </Button>
                        {!isPublic && (
                            <>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUpdate(id)}
                                    className="flex items-center gap-1"
                                >
                                    <Pencil className="w-4 h-4" />
                                    <span className="hidden md:inline">
                                        Edit
                                    </span>
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    disabled={isDeleting}
                                    onClick={() => {
                                        SweetAlert({
                                            title: "Delete Announcement?",
                                            text: `Are you sure you want to delete "${data.title}"? This action cannot be undone.`,
                                            icon: "warning",
                                            showCancelButton: true,
                                            confirmButtonText: "Yes, delete",
                                            cancelButtonText: "Cancel",
                                            onConfirm: () =>
                                                deleteAnnouncementMutation(id),
                                        });
                                    }}
                                    className="flex items-center gap-1"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span className="hidden md:inline">
                                        Delete
                                    </span>
                                </Button>
                            </>
                        )}
                    </div>
                );
            },
        },
    ];
};

export default function HostAnnouncementsList({ handleUpdate, handleView }) {
    const { data: response, isLoading } = useQuery({
        queryKey: ["host-announcements"],
        queryFn: fetchAnnouncements,
        staleTime: 0,
    });

    const announcements = response?.success ? response.data : [];
    const columns = getColumns(handleUpdate, handleView);

    if (isLoading) {
        return <div className="text-center py-4">Loading announcements...</div>;
    }

    if (!response?.success) {
        return (
            <div className="text-center py-4 text-red-500">
                {response?.message || "Failed to load announcements"}
            </div>
        );
    }

    if (announcements.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
                <div className="text-center py-8">
                    <h3 className="text-lg font-semibold mb-2">
                        No Announcements
                    </h3>
                    <p className="text-gray-500">
                        You haven't created any announcements yet. Create your
                        first announcement to get started.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-1 md:p-6">
            <DataTable columns={columns} data={announcements} />
        </div>
    );
}
