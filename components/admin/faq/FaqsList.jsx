"use client";

import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SweetAlert from "@components/ui/SweetAlert";
import notify from "@components/ui/notify";
import { deleteFaq } from "@action/faqAction";
import DataTableColumnHeader from "@components/reusable_components/DataTableColumnHeader";
import FaqCategoryBadge from "./FaqCategoryBadge";
import { DataTable } from "./Datatable";

const getColumns = (handleUpdate, handleView) => {
    const queryClient = useQueryClient();

    const { mutate: deleteFaqMutation, isPending: isDeleting } = useMutation({
        mutationFn: async (id) => {
            const res = await deleteFaq(id);
            if (!res.success) throw res;
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
            notify({ message: "FAQ deleted successfully" });
        },
        onError: (error) => {
            notify({
                error: true,
                message: error?.message || "Failed to delete FAQ",
            });
        },
    });

    const handleDelete = (id, question) => {
        SweetAlert.fire({
            title: "Are you sure?",
            text: `This will deactivate the FAQ: "${question.substring(
                0,
                50
            )}..."`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteFaqMutation(id);
            }
        });
    };

    return [
        {
            accessorKey: "question",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Question" />
            ),
            cell: ({ row }) => {
                const question = row.original.question;
                return (
                    <div className="max-w-md">
                        <p className="font-medium truncate" title={question}>
                            {question}
                        </p>
                    </div>
                );
            },
        },
        {
            accessorKey: "category",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Category" />
            ),
            cell: ({ row }) => {
                const category = row.original.category;
                return <FaqCategoryBadge category={category} />;
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id));
            },
        },
        {
            accessorKey: "is_active",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" />
            ),
            cell: ({ row }) => {
                const isActive = row.original.is_active;
                return (
                    <Badge variant={isActive ? "default" : "secondary"}>
                        {isActive ? "Active" : "Inactive"}
                    </Badge>
                );
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id));
            },
        },
        {
            accessorKey: "display_order",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Order" />
            ),
            cell: ({ row }) => {
                const order = row.original.display_order;
                return (
                    <Badge variant="outline" className="font-mono">
                        {order}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "keywords",
            header: "Keywords",
            cell: ({ row }) => {
                const keywords = row.original.keywords || [];
                if (keywords.length === 0) {
                    return (
                        <span className="text-sm text-muted-foreground">
                            None
                        </span>
                    );
                }
                return (
                    <div className="flex flex-wrap gap-1 max-w-xs">
                        {keywords.slice(0, 3).map((keyword, index) => (
                            <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                            >
                                {keyword}
                            </Badge>
                        ))}
                        {keywords.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                                +{keywords.length - 3}
                            </Badge>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Created" />
            ),
            cell: ({ row }) => {
                const date = new Date(row.original.createdAt);
                return (
                    <span className="text-sm text-muted-foreground">
                        {date.toLocaleDateString()}
                    </span>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const faq = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(faq.id)}
                            title="View FAQ"
                        >
                            <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdate(faq.id)}
                            title="Edit FAQ"
                        >
                            <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(faq.id, faq.question)}
                            disabled={isDeleting}
                            title="Delete FAQ"
                        >
                            <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                    </div>
                );
            },
        },
    ];
};

export default function FaqsList({ faqs, onView, onEdit }) {
    const columns = getColumns(onEdit, onView);

    return (
        <div className="space-y-4">
            <DataTable
                columns={columns}
                data={faqs}
                searchKey="question"
                searchPlaceholder="Search FAQs..."
            />
        </div>
    );
}
