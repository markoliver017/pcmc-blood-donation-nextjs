"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFaqs } from "@action/faqAction";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Plus, HelpCircle, List, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";
import { Input } from "@components/ui/input";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import FaqsList from "@components/admin/faq/FaqsList";
import CreateFaqForm from "@components/admin/faq/CreateFaqForm";
import UpdateFaqForm from "@components/admin/faq/UpdateFaqForm";
import ViewFaqModal from "@components/admin/faq/ViewFaqModal";
import Skeleton_line from "@components/ui/skeleton_line";
import { ToastContainer } from "react-toastify";

const CATEGORY_OPTIONS = [
    { value: "all", label: "All Categories" },
    { value: "general", label: "General" },
    { value: "donation_process", label: "Donation Process" },
    { value: "eligibility", label: "Eligibility" },
    { value: "health_safety", label: "Health & Safety" },
    { value: "appointments", label: "Appointments" },
    { value: "account", label: "Account" },
    { value: "blood_types", label: "Blood Types" },
    { value: "after_donation", label: "After Donation" },
];

export default function AdminFaqPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedFaqId, setSelectedFaqId] = useState(null);
    const [filters, setFilters] = useState({
        category: null,
        is_active: null,
        search: "",
    });

    // Fetch FAQs with filters
    const { data: response, isLoading } = useQuery({
        queryKey: ["admin-faqs", filters],
        queryFn: () => fetchFaqs(filters),
    });

    const faqs = response?.success ? response.data : [];

    // Calculate statistics
    const stats = {
        total: faqs.length,
        active: faqs.filter((f) => f.is_active).length,
        inactive: faqs.filter((f) => !f.is_active).length,
        byCategory: faqs.reduce((acc, faq) => {
            acc[faq.category] = (acc[faq.category] || 0) + 1;
            return acc;
        }, {}),
    };

    // Handlers
    const handleCreate = () => setIsCreateModalOpen(true);

    const handleUpdate = (id) => {
        setSelectedFaqId(id);
        setIsUpdateModalOpen(true);
    };

    const handleView = (id) => {
        setSelectedFaqId(id);
        setIsViewModalOpen(true);
    };

    const handleEditFromView = (faq) => {
        setSelectedFaqId(faq.id);
        setIsViewModalOpen(false);
        setIsUpdateModalOpen(true);
    };

    const handleCategoryFilter = (value) => {
        setFilters((prev) => ({
            ...prev,
            category: value === "all" ? null : value,
        }));
    };

    const handleStatusFilter = (value) => {
        setFilters((prev) => ({
            ...prev,
            is_active: value === "all" ? null : value === "active",
        }));
    };

    if (isLoading) return <Skeleton_line />;

    return (
        <>
            <ToastContainer />
            <WrapperHeadMain
                icon={<HelpCircle />}
                pageTitle="FAQ Management"
                breadcrumbs={[
                    {
                        path: "/portal/admin/faq",
                        icon: <List className="w-4" />,
                        title: "Manage FAQs",
                    },
                ]}
            />

            <div className="container mx-auto px-1 pb-2 md:px-6 space-y-4">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total FAQs
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Active FAQs
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {stats.active}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Inactive FAQs
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-500">
                                {stats.inactive}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Categories
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {Object.keys(stats.byCategory).length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                        {/* Category Filter */}
                        <Select
                            onValueChange={handleCategoryFilter}
                            defaultValue="all"
                        >
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORY_OPTIONS.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Status Filter */}
                        <Select
                            onValueChange={handleStatusFilter}
                            defaultValue="all"
                        >
                            <SelectTrigger className="w-full sm:w-[150px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">
                                    Inactive
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Create Button */}
                    <Button
                        variant="secondary"
                        className="font-semibold text-green-600"
                        onClick={handleCreate}
                    >
                        <Plus className="w-4 h-4" />
                        New FAQ
                    </Button>
                </div>

                {/* FAQs List */}
                <Card>
                    <CardContent className="pt-6">
                        <FaqsList
                            faqs={faqs}
                            onView={handleView}
                            onEdit={handleUpdate}
                        />
                    </CardContent>
                </Card>

                {/* Create Modal */}
                <Dialog
                    open={isCreateModalOpen}
                    onOpenChange={setIsCreateModalOpen}
                >
                    <DialogTitle>Create New FAQ</DialogTitle>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <CreateFaqForm
                            onSuccess={() => setIsCreateModalOpen(false)}
                        />
                    </DialogContent>
                </Dialog>

                {/* Update Modal */}
                <Dialog
                    open={isUpdateModalOpen}
                    onOpenChange={setIsUpdateModalOpen}
                >
                    <DialogTitle>Update FAQ</DialogTitle>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <UpdateFaqForm
                            faqId={selectedFaqId}
                            onSuccess={() => setIsUpdateModalOpen(false)}
                        />
                    </DialogContent>
                </Dialog>

                {/* View Modal */}
                <ViewFaqModal
                    faqId={selectedFaqId}
                    isOpen={isViewModalOpen}
                    onClose={() => setIsViewModalOpen(false)}
                    onEdit={handleEditFromView}
                />
            </div>
        </>
    );
}
