import { useRef } from 'react';
import { toast } from 'react-toastify';
import { notifyRegistrationOpen } from '@/action/donorAction';

export const NotifyEventRegistration = ({ donors = [
    "oliver", "neo", "vane"
] }) => {
    const toastId = useRef(null);
    const failedDonors = useRef([]);

    const notify = () => {
        toastId.current = toast.info(`Sending emails to ${donors.length} donors...`, {
            autoClose: false,
            position: "bottom-right"
        });
        donors.forEach((donor, index) => {
            (async () => {
                const res = await notifyRegistrationOpen(donor)
                if (!res.success) {
                    failedDonors.current.push(donor);
                    toast.update(toastId.current, {
                        render: `Sending... ${index + 1} out of ${donors.length} (Failed: ${failedDonors.current.length})`,
                        type: 'error',
                        autoClose: false,

                    });
                } else {
                    toast.update(toastId.current, {
                        render: `Sending... ${index + 1} out of ${donors.length} (Failed: ${failedDonors.current.length})`,
                        type: 'info',
                        autoClose: false,

                    });
                }
                if (index === donors.length - 1) {
                    const toastMessage = (
                        <div className="flex flex-col">
                            <span>Email sending complete! Success: {donors.length} - {failedDonors.current.length}, Failed: {failedDonors.current.length}</span>
                            <div>
                                {failedDonors.current.length && (
                                    <button className="btn btn-warning" onClick={() => handleResendFailedEmails(failedDonors.current)}>Resend failed emails</button>
                                )}
                            </div>
                        </div>
                    )
                    toast.update(toastId.current, {
                        render: toastMessage,
                        type: failedDonors.current.length === 0 ? 'success' : 'warning',
                        autoClose: false,


                    });
                }
            })();
        });
    }

    const handleResendFailedEmails = async (failedDonorNotif) => {
        failedDonors.current = [];
        toast.dismiss(toastId.current);
        const newToastId = toast.info(`Resending ${failedDonorNotif.length} failed emails...`, {
            autoClose: false,
            position: "bottom-right"
        });
        failedDonorNotif.forEach((donor, index) => {
            (async () => {
                const res = await notifyRegistrationOpen(donor)
                if (!res.success) {
                    toast.update(newToastId, {
                        render: `Resending... ${index + 1} out of ${failedDonorNotif.length} (Failed: ${failedDonorNotif.length - index - 1})`,
                        type: 'info',
                        autoClose: false,

                    });
                } else {
                    toast.update(newToastId, {
                        render: `Resending... ${index + 1} out of ${failedDonorNotif.length}`,
                        type: 'info',
                        autoClose: false,

                    });
                }
                if (index === failedDonorNotif.length - 1) {
                    toast.update(newToastId, {
                        render: `Resend complete!`,
                        type: 'success',
                        autoClose: true,

                    });
                }
            })();
        });
    }

    return (
        <div className='p-2'>
            <button className='btn btn-neutral' onClick={notify}>Send Emails</button>
        </div>
    );
};
