"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Plus } from "lucide-react";
import BloodRequestList from "./BloodRequestList";
import CreateBloodRequestForm from "./CreateBloodRequestForm";
import { Dialog, DialogContent, DialogOverlay } from "@components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { fetchBloodRequests } from "@action/bloodRequestAction";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ToastContainer } from "react-toastify";
import UpdateBloodRequestForm from "./UpdateBloodRequestForm";
import { getAgencyId } from "@/action/hostEventAction";
import Skeleton_line from "@components/ui/skeleton_line";
import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { GrEmergency } from "react-icons/gr";

export default function EmergencyRequestPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [bloodRequestId, setBloodRequestId] = useState(null);

    const handleUpdate = (id) => {
        setBloodRequestId(id);
        setIsUpdateModalOpen(true);
    };

    const { data: response } = useQuery({
        queryKey: ["blood-requests"],
        queryFn: fetchBloodRequests,
    });

    const { data: agency_id, isLoading: isLoadingAgencyId } = useQuery({
        queryKey: ["agency_id"],
        queryFn: getAgencyId,
    });

    const requests = response?.success ? response.data : [];

    if (isLoadingAgencyId) return <Skeleton_line />;

    // Calculate statistics
    const stats = {
        pending: requests.filter((req) => req.status === "pending").length,
        fulfilled: requests.filter((req) => req.status === "fulfilled").length,
        rejected: requests.filter((req) => req.status === "rejected").length,
    };

    return (
        <div className="mb-5">
            <WrapperHeadMain
                icon={<GrEmergency />}
                pageTitle="Emergency Blood Requests"
                breadcrumbs={[
                    {
                        path: "/portal/hosts/emergency-requests",
                        icon: <GrEmergency className="w-4" />,
                        title: "List of Blood Requests",
                    },
                ]}
            />
            <div className="container mx-auto p-2 md:p-6 space-y-6">
                <div className="flex md:justify-end">
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        <Plus className="w-4 h-4" />
                        New Request
                    </Button>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                    <Card>
                        <CardHeader className="pb-2 md:pb-4">
                            <h3 className="text-xs md:text-lg font-semibold">
                                Pending Requests
                            </h3>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs md:text-3xl font-bold text-center text-orange-500">
                                {stats.pending}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2 md:pb-4">
                            <h3 className="text-xs md:text-lg font-semibold">
                                Approved Requests
                            </h3>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs md:text-3xl font-bold text-center text-green-500">
                                {stats.fulfilled}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2 md:pb-4">
                            <h3 className="text-xs md:text-lg font-semibold">
                                Rejected Requests
                            </h3>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs md:text-3xl font-bold text-center text-red-500">
                                {stats.rejected}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <BloodRequestList handleUpdate={handleUpdate} />

                <Dialog
                    open={isCreateModalOpen}
                    onOpenChange={setIsCreateModalOpen}
                >
                    <DialogContent
                        className="max-w-3xl max-h-[90vh] overflow-y-auto dark:text-white"
                        onInteractOutside={(event) => event.preventDefault()}
                    >
                        <DialogTitle className="text-xl font-bold">
                            New Blood Request
                        </DialogTitle>
                        <CreateBloodRequestForm
                            agency_id={agency_id}
                            onSuccess={() => setIsCreateModalOpen(false)}
                        />
                    </DialogContent>
                </Dialog>

                <Dialog
                    open={isUpdateModalOpen}
                    onOpenChange={setIsUpdateModalOpen}
                >
                    <DialogContent
                        className="max-w-3xl max-h-[90vh] overflow-y-auto dark:text-white"
                        onInteractOutside={(event) => event.preventDefault()}
                    >
                        <DialogTitle className="hidden"></DialogTitle>
                        <UpdateBloodRequestForm
                            bloodRequestId={bloodRequestId}
                            onSuccess={() => setIsUpdateModalOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
