"use client";

import { useState, useEffect } from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Badge } from "@components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import {
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    Plus,
    Search,
    Filter,
} from "lucide-react";
import {
    TEMPLATE_CATEGORIES,
    formatCategoryName,
    getCategoryColor,
} from "@lib/utils/emailTemplateUtils";

const EmailTemplateList = ({
    templates: propTemplates,
    onEdit,
    onDelete,
    onView,
    onCreate,
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: "",
        category: "",
        is_active: "",
    });

    // Filter templates based on current filters
    const filteredTemplates = (propTemplates || []).filter((template) => {
        // Search filter
        if (
            filters.search &&
            !template.name.toLowerCase().includes(filters.search.toLowerCase())
        ) {
            return false;
        }

        // Category filter
        if (filters.category && template.category !== filters.category) {
            return false;
        }

        // Status filter
        if (
            filters.is_active !== "" &&
            template.is_active.toString() !== filters.is_active
        ) {
            return false;
        }

        return true;
    });

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    // Handle template actions
    const handleAction = async (action, templateId, userId = null) => {
        try {
            switch (action) {
                case "delete":
                    if (
                        confirm(
                            "Are you sure you want to delete this template?"
                        )
                    ) {
                        // For mock data, just show a message
                        alert("Delete functionality would be implemented here");
                        console.log("Delete template:", templateId);
                    }
                    break;

                case "toggle":
                    // For mock data, just show a message
                    alert(
                        "Toggle status functionality would be implemented here"
                    );
                    console.log("Toggle template status:", templateId);
                    break;

                default:
                    break;
            }
        } catch (err) {
            console.error("Template action error:", err);
            alert("Failed to perform action");
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Email Templates</CardTitle>
                    <Button
                        onClick={onCreate}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Create Template
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search templates..."
                                value={filters.search}
                                onChange={(e) =>
                                    handleFilterChange("search", e.target.value)
                                }
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <Select
                        value={filters.category || "all"}
                        onValueChange={(value) =>
                            handleFilterChange(
                                "category",
                                value === "all" ? "" : value
                            )
                        }
                    >
                        <SelectTrigger className="w-full sm:w-48">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {TEMPLATE_CATEGORIES.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {formatCategoryName(category)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.is_active || "all"}
                        onValueChange={(value) =>
                            handleFilterChange(
                                "is_active",
                                value === "all" ? "" : value
                            )
                        }
                    >
                        <SelectTrigger className="w-full sm:w-32">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="true">Active</SelectItem>
                            <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Templates Table */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTemplates.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center py-8 text-gray-500"
                                    >
                                        No templates found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredTemplates.map((template) => (
                                    <TableRow key={template.id}>
                                        <TableCell className="font-medium">
                                            {template.name}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={getCategoryColor(
                                                    template.category
                                                )}
                                            >
                                                {formatCategoryName(
                                                    template.category
                                                )}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {template.subject}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    template.is_active
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {template.is_active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                template.createdAt
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            onView(template)
                                                        }
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            onEdit(template)
                                                        }
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleAction(
                                                                "toggle",
                                                                template.id
                                                            )
                                                        }
                                                        className="text-orange-600"
                                                    >
                                                        {template.is_active
                                                            ? "Deactivate"
                                                            : "Activate"}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleAction(
                                                                "delete",
                                                                template.id
                                                            )
                                                        }
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Results count */}
                <div className="mt-4 text-sm text-gray-500">
                    {filteredTemplates.length} template
                    {filteredTemplates.length !== 1 ? "s" : ""} found
                </div>
            </CardContent>
        </Card>
    );
};

export default EmailTemplateList;
