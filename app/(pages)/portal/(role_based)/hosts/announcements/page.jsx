"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Bell, List, Plus } from "lucide-react";
import { Dialog, DialogContent } from "@components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { fetchAnnouncements } from "@action/announcementAction";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ToastContainer } from "react-toastify";
import HostAnnouncementsList from "@components/hosts/announcements/AnnouncementsList";
import CreateAnnouncementForm from "@components/hosts/announcements/CreateAnnouncementForm";
import UpdateAnnouncementForm from "@components/hosts/announcements/UpdateAnnouncementForm";
import ViewAnnouncementModal from "@components/hosts/announcements/ViewAnnouncementModal";
import Skeleton from "@components/ui/skeleton";
import { fetchAgencyByRole } from "@/action/agencyAction";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";

export default function HostAnnouncementsPage() {
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

    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false);
    };

    const handleUpdateSuccess = () => {
        setIsUpdateModalOpen(false);
        setAnnouncementId(null);
    };

    const handleViewClose = () => {
        setIsViewModalOpen(false);
        setAnnouncementId(null);
    };

    const { data: response, isLoading } = useQuery({
        queryKey: ["host-announcements"],
        queryFn: fetchAnnouncements,
    });

    const { data: agency, isLoading: isLoadingAgency } = useQuery({
        queryKey: ["current-agency"],
        queryFn: async () => {
            const result = await fetchAgencyByRole();
            if (!result.success) {
                throw result;
            }
            return result.data;
        },
        staleTime: 1000 * 60 * 5,
    });

    const announcements = response?.success ? response.data : [];

    if (isLoading || isLoadingAgency) return <Skeleton />;

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
        <div className="container mx-auto p-2 md:p-6 space-y-2 md:space-y-6">
            <WrapperHeadMain
                icon={<Bell />}
                pageTitle="Announcements"
                breadcrumbs={[
                    {
                        path: "/portal/hosts/announcements",
                        icon: <List className="w-4" />,
                        title: "List of Announcements",
                    },
                ]}
            />
            <div className="flex md:justify-end">
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Announcement
                </Button>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
                <Card>
                    <CardHeader className="px-2 md:px-8">
                        <h3 className="text-xs md:text-lg font-semibold line-clamp-2 text-ellipsis">
                            Total Announcements
                        </h3>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs md:text-3xl font-bold text-blue-500">
                            {stats.total}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="px-2 md:px-8">
                        <h3 className="text-xs md:text-lg font-semibold line-clamp-2 text-ellipsis">
                            Public Announcements
                        </h3>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs md:text-3xl font-bold text-green-500">
                            {stats.public}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="px-2 md:px-8">
                        <h3 className="text-xs md:text-lg font-semibold line-clamp-2 text-ellipsis">
                            Agency-Specific
                        </h3>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs md:text-3xl font-bold text-orange-500">
                            {stats.agency_specific}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <HostAnnouncementsList
                handleUpdate={handleUpdate}
                handleView={handleView}
            />

            {/* Create Announcement Modal */}
            <Dialog
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            >
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto dark:text-white">
                    <DialogTitle className="hidden"></DialogTitle>
                    <ToastContainer />
                    <CreateAnnouncementForm
                        agency={agency}
                        onSuccess={handleCreateSuccess}
                    />
                </DialogContent>
            </Dialog>

            {/* Update Announcement Modal */}
            <Dialog
                open={isUpdateModalOpen}
                onOpenChange={setIsUpdateModalOpen}
            >
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto dark:text-white">
                    <DialogTitle className="hidden"></DialogTitle>
                    <ToastContainer />
                    {announcementId && (
                        <UpdateAnnouncementForm
                            announcementId={announcementId}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* View Announcement Modal */}
            {announcementId && (
                <ViewAnnouncementModal
                    announcementId={announcementId}
                    isOpen={isViewModalOpen}
                    onClose={handleViewClose}
                    onEdit={handleEditFromView}
                />
            )}

            <ToastContainer />
        </div>
    );
}
