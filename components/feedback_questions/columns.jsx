"use client";

import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns = [
    {
        accessorKey: "question_text",
        header: "Question",
    },
    {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ row }) => {
            const isActive = row.getValue("is_active");
            return <Badge variant={isActive ? "success" : "destructive"}>{isActive ? "Active" : "Inactive"}</Badge>;
        },
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const question = row.original;
            const { meta } = table.options;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => meta.openEditDialog(question)}>Edit</DropdownMenuItem>
                        {question.is_active ? (
                            <DropdownMenuItem onClick={() => meta.updateStatus(question.id, "inactive")}>Deactivate</DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem onClick={() => meta.updateStatus(question.id, "active")}>Activate</DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600" onClick={() => meta.handleDelete(question.id)}>
                            Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(question.id)}
                        >
                            Copy Question ID
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
