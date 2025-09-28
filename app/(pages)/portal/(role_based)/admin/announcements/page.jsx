"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { List, Megaphone, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogOverlay } from "@components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { fetchAnnouncements } from "@action/announcementAction";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ToastContainer } from "react-toastify";
import Skeleton_line from "@components/ui/skeleton_line";
import AnnouncementsList from "@components/admin/announcements/AnnouncementsList";
import CreateAnnouncementForm from "@components/admin/announcements/CreateAnnouncementForm";
import UpdateAnnouncementForm from "@components/admin/announcements/UpdateAnnouncementForm";
import ViewAnnouncementModal from "@components/admin/announcements/ViewAnnouncementModal";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";

export default function AdminAnnouncementsPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [announcementId, setAnnouncementId] = useState(null);

    const handleUpdate = (id) => {
        setAnnouncementId(id);
        setIsUpdateModalOpen(true);
    };

    const handleView = (id) => {
        setAnnouncementId(id);
        setIsViewModalOpen(true);
    };

    const handleEditFromView = (announcement) => {
        setAnnouncementId(announcement.id);
        setIsViewModalOpen(false);
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
        <>
            <WrapperHeadMain
                icon={<Megaphone />}
                pageTitle="Announcements"
                breadcrumbs={[
                    {
                        path: "/portal/admin/announcements",
                        icon: <List className="w-4" />,
                        title: "List of Announcements",
                    },
                ]}
            />
            <div className="container mx-auto px-1 pb-2 md:px-6 space-y-2">
                <div className="flex md:justify-end items-center">
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        New Announcement
                    </Button>
                </div>

                <div className="grid grid-cols-3 gap-1">
                    <Card>
                        <CardHeader className="p-2 md:p-5">
                            <h3 className="text-sm md:text-lg font-semibold">
                                Total Announcements
                            </h3>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg md:text-3xl font-bold text-blue-500">
                                {stats.total}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="p-2 md:p-5">
                            <h3 className="text-sm md:text-lg font-semibold">
                                Public Announcements
                            </h3>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg md:text-3xl font-bold text-green-500">
                                {stats.public}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="p-2 md:p-5">
                            <h3 className="text-sm md:text-lg font-semibold">
                                Agency-Specific
                            </h3>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg md:text-3xl font-bold text-orange-500">
                                {stats.agency_specific}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <AnnouncementsList
                    handleUpdate={handleUpdate}
                    handleView={handleView}
                />

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
                        />
                    </DialogContent>
                </Dialog>

                {/* View Announcement Modal */}
                <ViewAnnouncementModal
                    announcementId={announcementId}
                    isOpen={isViewModalOpen}
                    onClose={() => setIsViewModalOpen(false)}
                    onEdit={handleEditFromView}
                />
            </div>
        </>
    );
}
