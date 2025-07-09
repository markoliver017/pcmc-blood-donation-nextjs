"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogOverlay } from "@components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { fetchAnnouncements } from "@action/announcementAction";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ToastContainer } from "react-toastify";
import Skeleton_line from "@components/ui/skeleton_line";
import AnnouncementsList from "@components/admin/announcements/AnnouncementsList";
import CreateAnnouncementForm from "@components/admin/announcements/CreateAnnouncementForm";
import UpdateAnnouncementForm from "@components/admin/announcements/UpdateAnnouncementForm";

export default function AdminAnnouncementsPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [announcementId, setAnnouncementId] = useState(null);

    const handleUpdate = (id) => {
        setAnnouncementId(id);
        setIsUpdateModalOpen(true);
    };

    const { data: response, isLoading } = useQuery({
        queryKey: ["admin-announcements"],
        queryFn: fetchAnnouncements,
    });

    const announcements = response?.success ? response.data : [];

    if (isLoading) return <Skeleton_line />;

    // Calculate statistics
    const stats = {
        total: announcements.length,
        public: announcements.filter((announcement) => announcement.is_public)
            .length,
        agency_specific: announcements.filter(
            (announcement) => !announcement.is_public
        ).length,
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Announcements Management</h1>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Announcement
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold">
                            Total Announcements
                        </h3>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-500">
                            {stats.total}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold">
                            Public Announcements
                        </h3>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-500">
                            {stats.public}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold">
                            Agency-Specific
                        </h3>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-500">
                            {stats.agency_specific}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <AnnouncementsList handleUpdate={handleUpdate} />

            <Dialog
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            >
                <DialogContent
                    className="max-w-4xl max-h-[90vh] overflow-y-auto dark:text-white"
                    onInteractOutside={(event) => event.preventDefault()}
                >
                    <DialogTitle className="hidden"></DialogTitle>
                    <ToastContainer />
                    <CreateAnnouncementForm
                        onSuccess={() => setIsCreateModalOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <Dialog
                open={isUpdateModalOpen}
                onOpenChange={setIsUpdateModalOpen}
            >
                <DialogContent
                    className="max-w-4xl max-h-[90vh] overflow-y-auto dark:text-white"
                    onInteractOutside={(event) => event.preventDefault()}
                >
                    <DialogTitle className="hidden"></DialogTitle>
                    <ToastContainer />
                    <UpdateAnnouncementForm
                        announcementId={announcementId}
                        onSuccess={() => setIsUpdateModalOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
