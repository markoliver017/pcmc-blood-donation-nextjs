"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Textarea } from "@components/ui/textarea";
import { Label } from "@components/ui/label";
import { Badge } from "@components/ui/badge";
import {
    User,
    Droplets,
    Building,
    Clock,
    AlertTriangle,
    CheckCircle,
    XCircle,
    UserSearch,
    UserX,
} from "lucide-react";
import { updateAppointmentStatus } from "@action/adminEventAction";
import notify from "@components/ui/notify";
import { FaExclamationCircle } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import { toast, Toaster } from "sonner";

export default function UpdateStatusModal({
    isOpen,
    onClose,
    appointment,
    eventId,
}) {
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
        setValue,
    } = useForm({
        defaultValues: {
            status: "",
            comments: "",
        },
    });

    const selectedStatus = watch("status");

    // Mutation for updating appointment status
    const updateStatusMutation = useMutation({
        mutationFn: async (formData) => {
            const result = await updateAppointmentStatus(appointment.id, {
                appointmentId: appointment.id,
                eventId: eventId,
                status: formData.status,
                comments: formData.comments.trim() || null,
            });

            if (!result.success) {
                throw result;
            }

            return result;
        },
        onSuccess: (result) => {
            toast.success(result?.message || "Status updated successfully");

            // Invalidate and refetch dashboard data
            queryClient.invalidateQueries({
                queryKey: ["event-dashboard", eventId],
            });
            queryClient.invalidateQueries({
                queryKey: ["event-statistics", eventId],
            });

            setTimeout(() => {
                handleClose();
            }, 1000);
        },
        onError: (error) => {
            console.log("error on updateStatusMutation", error);
            toast.error(
                error?.message || "An error occurred while updating the status"
            );
        },
    });

    const onSubmit = (formData) => {
        if (!formData.status) {
            toast.error("Please select a status");
            return;
        }

        updateStatusMutation.mutate(formData);
    };

    const handleClose = () => {
        reset();
        updateStatusMutation.reset();
        onClose();
    };

    const getStatusOptions = () => {
        let currentStatus = "registered";
        if (appointment?.physical_exam) {
            currentStatus = "examined";
        }

        switch (currentStatus) {
            case "registered":
                return [
                    {
                        value: "no show",
                        label: "Mark as No Show",
                        icon: FaExclamationCircle,
                        color: "text-orange-600",
                    },
                    {
                        value: "examined",
                        label: "Mark as Examined",
                        icon: UserSearch,
                        color: "text-yellow-600",
                    },
                ];
            case "examined":
                return [
                    {
                        value: "collected",
                        label: "Mark as Collected",
                        icon: CheckCircle,
                        color: "text-green-600",
                    },
                    {
                        value: "deferred",
                        label: "Mark as Deferred",
                        icon: UserX,
                        color: "text-orange-600",
                    },
                ];
            default:
                return [];
        }
    };

    const statusOptions = getStatusOptions();

    if (!appointment) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose} modal={true}>
            <Toaster />
            <DialogContent
                className="sm:max-w-[500px]"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Update Donor Status</DialogTitle>
                    <DialogDescription>
                        Update the status for{" "}
                        {appointment.donor?.user?.name || "this donor"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Donor Information */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-medium">
                                    {appointment.donor?.user?.name ||
                                        "Unknown Donor"}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Appointment ID: {appointment.id}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-1">
                                <Droplets className="h-3 w-3" />
                                <span>
                                    {appointment.donor?.blood_type
                                        ?.blood_type || "Not specified"}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                <span>
                                    {appointment.donor?.agency?.name ||
                                        "Unknown Agency"}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>
                                    {appointment.time_schedule
                                        ?.formatted_time || "No time scheduled"}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="font-medium">
                                    Current Status:
                                </span>
                                <Badge variant="outline" className="text-xs">
                                    {appointment.status?.toUpperCase() ||
                                        "UNKNOWN"}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Status Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="status">Select New Status</Label>
                        <div className="grid grid-cols-1 gap-2">
                            {statusOptions.map((option) => {
                                const IconComponent = option.icon;
                                return (
                                    <Button
                                        key={option.value}
                                        type="button"
                                        variant={
                                            selectedStatus === option.value
                                                ? "default"
                                                : "outline"
                                        }
                                        className="justify-start h-auto p-3"
                                        onClick={() =>
                                            setValue("status", option.value)
                                        }
                                    >
                                        <IconComponent
                                            className={`h-4 w-4 mr-2 ${option.color}`}
                                        />
                                        <span>{option.label}</span>
                                    </Button>
                                );
                            })}
                        </div>
                        {errors.status && (
                            <p className="text-sm text-red-600">
                                {errors.status.message}
                            </p>
                        )}
                        {statusOptions.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                No status updates available for current status:{" "}
                                {appointment.status}
                            </p>
                        )}
                    </div>

                    {/* Comments */}
                    <div className="space-y-2">
                        <Label htmlFor="comments">Comments (Optional)</Label>
                        <Textarea
                            id="comments"
                            placeholder="Add any additional notes or comments..."
                            {...register("comments")}
                            rows={3}
                        />
                        {errors.comments && (
                            <p className="text-sm text-red-600">
                                {errors.comments.message}
                            </p>
                        )}
                    </div>

                    {/* Current Status Info */}
                    {appointment.physical_exam && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <h5 className="text-sm font-medium mb-2">
                                Current Examination Status
                            </h5>
                            <div className="text-xs space-y-1">
                                <div>
                                    <span className="font-medium">
                                        Eligibility:
                                    </span>
                                    <span className="ml-1">
                                        {appointment.physical_exam
                                            .eligibility_status === "ACCEPTED"
                                            ? "Eligible for donation"
                                            : "Deferred"}
                                    </span>
                                </div>
                                {appointment.physical_exam.deferral_reason && (
                                    <div>
                                        <span className="font-medium">
                                            Deferral Reason:
                                        </span>
                                        <span className="ml-1">
                                            {
                                                appointment.physical_exam
                                                    .deferral_reason
                                            }
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={updateStatusMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                !selectedStatus ||
                                updateStatusMutation.isPending
                            }
                        >
                            {updateStatusMutation.isPending
                                ? "Updating..."
                                : "Update Statuses"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
