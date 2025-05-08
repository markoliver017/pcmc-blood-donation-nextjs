"use client";

import { Button } from "@components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@components/ui/dialog";
import SweetAlert from "@components/ui/SweetAlert";
import { BadgeX, Check, Info, X } from "lucide-react";
import { useState } from "react";

export default function ShowRequest({ data, open, setOpen, onSave }) {
    const [isLoading, setIsLoading] = useState({
        rejected: false,
        approved: false,
    });
    if (!data) return;

    const handleUpdate = async (status) => {
        SweetAlert({
            title: "Data Request",
            text: "Are you sure you want to update this request?",
            icon: "question",
            showCancelButton: true,
            cancelButtonText: "Cancel",
            confirmButtonText: "Yes",
            onConfirm: async () => {
                setIsLoading((prev) => ({ ...prev, [status]: true }));
                try {
                    const response = await fetch(`/api/requests/${data?.id}`, {
                        method: "PUT",
                        body: JSON.stringify({ status: status }),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    const result = await response.json();

                    if (!result.error) {
                        if (status == "approved") {
                            SweetAlert({
                                title: "Request Approved",
                                text: "You have successfully approved the request. The requestor will be notified via email with attached INMERS reports.",
                                icon: "success",
                                confirmButtonText: "OK",
                                element_id: "requests_datatable",
                            });
                        } else {
                            SweetAlert({
                                title: "Request Rejected",
                                text: "You have successfully rejected the request. The requestor will be notified via email.",
                                icon: "success",
                                confirmButtonText: "OK",
                                element_id: "requests_datatable",
                            });
                        }
                        onSave(result.report);
                    } else {
                        SweetAlert({
                            title: "Server Error",
                            text: result.message,
                            icon: "error",
                            confirmButtonText: "Try Again",
                        });
                    }

                    console.log("result", result);
                } catch (err) {
                    console.error("result", result);
                } finally {
                    setIsLoading(() => ({ approve: false, reject: false }));
                }
            },
        });
    };

    const getStatus = (status) => {
        if (status == "approved") {
            return (
                <div className="badge p-2 font-semibold text-xs badge-success">
                    {status.toUpperCase()}
                </div>
            );
        }
        if (status == "rejected") {
            return (
                <div className="badge p-2 font-semibold text-xs badge-error">
                    {status.toUpperCase()}
                </div>
            );
        }
        return (
            <div className="badge p-2 font-semibold text-xs badge-primary">
                {status.toUpperCase()}
            </div>
        );
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent
                    id="form-modal"
                    className="min-w-3/4 dark:text-white"
                >
                    <DialogHeader>
                        <DialogTitle className="border-b p-3">
                            <div className="flex-items-center gap-5">
                                <Info />{" "}
                                <span className="block pr-5">
                                    Data Requests from <i>{data?.email}</i>
                                </span>
                                {getStatus(data?.status)}
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                        <table className="table table-zebra table-hovered table-bordered">
                            <thead>
                                <tr>
                                    <th>Fields</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th width="30%">Request Date</th>
                                    <td>{data?.request_date}</td>
                                </tr>
                                <tr>
                                    <th>Email</th>
                                    <td>{data?.email}</td>
                                </tr>
                                <tr>
                                    <th>Company/Agency/Institution</th>
                                    <td>{data?.company}</td>
                                </tr>
                                <tr>
                                    <th>Profession</th>
                                    <td>{data?.profession}</td>
                                </tr>
                                <tr>
                                    <th>Purpose</th>
                                    <td>{data?.purpose}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="flex gap-3 justify-end">
                        <Button
                            variant="outline"
                            // className="w-full"
                            onClick={() => setOpen(false)}
                        >
                            <X />
                            Close
                        </Button>
                        {data.status == "pending" && (
                            <>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleUpdate("rejected")}
                                >
                                    {isLoading.rejected ? (
                                        <>
                                            <span className="loading loading-bars loading-xs"></span>
                                            Submitting ...
                                        </>
                                    ) : (
                                        <>
                                            <BadgeX />
                                            Reject
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="default"
                                    className="bg-green-600"
                                    onClick={() => handleUpdate("approved")}
                                >
                                    {isLoading.approved ? (
                                        <>
                                            <span className="loading loading-bars loading-xs"></span>
                                            Submitting ...
                                        </>
                                    ) : (
                                        <>
                                            <Check />
                                            Approve
                                        </>
                                    )}
                                </Button>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
