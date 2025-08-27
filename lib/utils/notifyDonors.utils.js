// utils/notifyDonors.js
import { toast } from "react-toastify";
import { notifyRegistrationOpen } from "@/action/donorAction";
import { useToastStore } from "@/store/toastStore";

/**
 * Sends registration emails to donors and shows toast notifications.
 * @param {Array} donors - List of donor objects.
 * @param {Object} eventData - Event metadata.
 * @returns {Promise<void>}
 */
export async function notifyDonors(donors = [], eventData = {}) {
    const failedDonors = [];
    const containerId = useToastStore.getState().containerId;

    // console.log("notifyDonors", donors, eventData);

    const toastId = toast.info(`Sending emails to ${donors.length} donors...`, {
        autoClose: false,
        position: "bottom-right",
        containerId,
    });

    await Promise.all(
        donors.map(async (donor, index) => {
            const res = await notifyRegistrationOpen(donor, eventData);
            const name = donor?.user?.full_name;

            if (!res.success) {
                failedDonors.push(donor);
                toast.update(toastId, {
                    render: `Sending ${name}... ${index + 1} of ${
                        donors.length
                    } (Failed: ${failedDonors.length})`,
                    type: "error",
                    autoClose: false,
                    containerId,
                });
            } else {
                toast.update(toastId, {
                    render: `Sending ${name}... ${index + 1} of ${
                        donors.length
                    } (Failed: ${failedDonors.length})`,
                    type: "info",
                    autoClose: false,
                    containerId,
                });
            }
        })
    );

    const toastMessage = (
        <div className="flex flex-col">
            <span>
                Email sending complete! Success:{" "}
                {donors.length - failedDonors.length}, Failed:{" "}
                {failedDonors.length}
            </span>
            <div>
                {failedDonors.length > 0 && (
                    <button
                        className="btn btn-warning"
                        onClick={() =>
                            resendFailedDonors(failedDonors, eventData)
                        }
                    >
                        Resend failed emails
                    </button>
                )}
            </div>
        </div>
    );

    toast.update(toastId, {
        render: toastMessage,
        type: failedDonors.length === 0 ? "success" : "warning",
        autoClose: true,
        containerId,
    });
}

async function resendFailedDonors(failedDonors, eventData) {
    const newToastId = toast.info(
        `Resending ${failedDonors.length} failed emails...`,
        {
            autoClose: false,
            position: "bottom-right",
            containerId,
        }
    );

    let retryFailed = [];

    await Promise.all(
        failedDonors.map(async (donor, index) => {
            const res = await notifyRegistrationOpen(donor, eventData);
            const name = donor?.user?.full_name;

            if (!res.success) {
                retryFailed.push(donor);
                toast.update(newToastId, {
                    render: `Resending ${name}... ${index + 1} of ${
                        failedDonors.length
                    } (Still Failed: ${retryFailed.length})`,
                    type: "error",
                    autoClose: false,
                    containerId,
                });
            } else {
                toast.update(newToastId, {
                    render: `Resending ${name}... ${index + 1} of ${
                        failedDonors.length
                    }`,
                    type: "info",
                    autoClose: false,
                    containerId,
                });
            }
        })
    );

    toast.update(newToastId, {
        render: retryFailed.length
            ? `Resend complete with ${retryFailed.length} still failed.`
            : "Resend complete!",
        type: retryFailed.length ? "warning" : "success",
        autoClose: true,
        containerId,
    });
}
