import { useRef } from "react";
import { toast } from "react-toastify";
import { notifyRegistrationOpen } from "@/action/donorAction";
import { Mail } from "lucide-react";
import { useToastStore } from "@/store/toastStore";

export const NotifyEventRegistration = ({ donorsData, eventData }) => {
    const toastId = useRef(null);
    const failedDonors = useRef([]);
    const donors = donorsData || [];
    const containerId = useToastStore.getState().containerId;

    const notify = () => {
        toastId.current = toast.info(
            `Sending emails to ${donors.length} donors...`,
            {
                autoClose: false,
                position: "bottom-right",
                containerId,
            }
        );
        donors.forEach((donor, index) => {
            (async () => {
                const res = await notifyRegistrationOpen(donor, eventData);
                console.log("Notification response:", res);
                if (!res.success) {
                    failedDonors.current.push(donor);
                    toast.update(toastId.current, {
                        render: `Sending ${donor?.user?.full_name}... ${
                            index + 1
                        } out of ${donors.length} (Failed: ${
                            failedDonors.current.length
                        })`,
                        type: "error",
                        autoClose: false,
                        containerId,
                    });
                } else {
                    toast.update(toastId.current, {
                        render: `Sending  ${donor?.user?.full_name}... ${
                            index + 1
                        } out of ${donors.length} (Failed: ${
                            failedDonors.current.length
                        })`,
                        type: "info",
                        autoClose: false,
                        containerId,
                    });
                }
                if (index === donors.length - 1) {
                    const toastMessage = (
                        <div className="flex flex-col">
                            <span>
                                Email sending complete! Success:{" "}
                                {donors.length - failedDonors.current.length},
                                Failed: {failedDonors.current.length}
                            </span>
                            <div>
                                {failedDonors.current.length && (
                                    <button
                                        className="btn btn-warning"
                                        onClick={() =>
                                            handleResendFailedEmails(
                                                failedDonors.current
                                            )
                                        }
                                    >
                                        Resend failed emails
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                    toast.update(toastId.current, {
                        render: toastMessage,
                        type:
                            failedDonors.current.length === 0
                                ? "success"
                                : "warning",
                        autoClose: false,
                        containerId,
                    });
                }
            })();
        });
    };

    const handleResendFailedEmails = async (failedDonorNotif) => {
        failedDonors.current = [];
        toast.dismiss(toastId.current);
        const newToastId = toast.info(
            `Resending ${failedDonorNotif.length} failed emails...`,
            {
                autoClose: false,
                position: "bottom-right",
                containerId,
            }
        );
        failedDonorNotif.forEach((donor, index) => {
            (async () => {
                const res = await notifyRegistrationOpen(donor, eventData);
                if (!res.success) {
                    toast.update(newToastId, {
                        render: `Resending... ${index + 1} out of ${
                            failedDonorNotif.length
                        } (Failed: ${failedDonorNotif.length - index - 1})`,
                        type: "info",
                        autoClose: false,
                        containerId,
                    });
                } else {
                    toast.update(newToastId, {
                        render: `Resending... ${index + 1} out of ${
                            failedDonorNotif.length
                        }`,
                        type: "info",
                        autoClose: false,
                        containerId,
                    });
                }
                if (index === failedDonorNotif.length - 1) {
                    toast.update(newToastId, {
                        render: `Resend complete!`,
                        type: "success",
                        autoClose: true,
                        containerId,
                    });
                }
            })();
        });
    };

    return (
        <button
            type="button"
            className="btn btn-ghost btn-block"
            disabled={!donorsData}
            onClick={notify}
        >
            <Mail className="h-4 w-4" />
            Invite Donors ({donorsData?.length})
        </button>
    );
};
