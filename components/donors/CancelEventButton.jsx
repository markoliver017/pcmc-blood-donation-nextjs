"use client";
import { updateEventStatus } from "@/action/adminEventAction";
import { updateAgencyStatus } from "@/action/agencyAction";
import { bookDonorAppointment, cancelDonorAppointment } from "@/action/donorAppointmentAction";

import { Form } from "@components/ui/form";
import notify from "@components/ui/notify";
import SweetAlert from "@components/ui/SweetAlert";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { XIcon } from "lucide-react";
import moment from "moment";
import { useForm } from "react-hook-form";

export default function CancelEventButton({
    event,
    schedule,
    appointmentId,
    icon = <XIcon />,
    label = "Cancel",
    className = "btn-error",
    formClassName = "",
    onLoad = () => { },
    onFinish = () => { },
}) {
    const queryClient = useQueryClient();

    const {
        // data: eventData,
        mutate,
        isPending,
    } = useMutation({
        mutationFn: async (formData) => {
            onLoad();
            const res = await cancelDonorAppointment(appointmentId, formData);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            return res;
        },
        onSuccess: (data) => {

            SweetAlert({
                title: "Cancel Blood Donation Appointment",
                text: `You have successfully cancelled an appointment for ${event?.title
                    } on ${moment(schedule?.date).format(
                        "MMM DD, YYYY"
                    )} from ${moment(schedule?.time_start, "HH:mm:ss").format(
                        "hh:mm A"
                    )} to ${moment(schedule?.time_end, "HH:mm:ss").format(
                        "hh:mm A"
                    )}.`,

                icon: "info",
                confirmButtonText: "Done",
            });
        },
        onError: (error) => {
            notify({ error: true, message: error?.message });
            onFinish();
        },
        onSettled: () => {
            onFinish();
        },
    });

    const form = useForm({
        mode: "onChange",
        defaultValues: {
            status: "cancelled",
            time_schedule_id: schedule?.id,
            event_id: schedule?.blood_donation_event_id,
        },
    });

    const { handleSubmit, reset } = form;

    const onSubmit = async (data) => {
        SweetAlert({
            title: "Confirm your action?",
            html: `Are you sure you want to cancel your appointment on <b>${moment(
                event?.date
            ).format("MMM DD, YYYY")}</b> from <b>${moment(
                schedule?.time_start,
                "HH:mm:ss"
            ).format("hh:mm A")}</b> to <b>${moment(
                schedule?.time_end,
                "HH:mm:ss"
            ).format("hh:mm A")}</b> in <b>${event?.title}</b>?`,
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Proceed",
            onConfirm: () => {
                mutate(data);
            },
        });
    };

    if (!appointmentId) return null;

    return (
        <Form {...form}>
            <form
                className={`${formClassName}`}
                onSubmit={handleSubmit(onSubmit)}
            >
                <button
                    type="submit"
                    disabled={isPending}
                    className={clsx(
                        "btn hover:bg-neutral-800 hover:text-green-300",
                        className
                    )}
                >
                    {isPending ? (
                        <>
                            <span className="loading loading-bars loading-xs"></span>
                            Submitting ...
                        </>
                    ) : (
                        <>
                            {icon}
                            <span className="hidden md:inline-block">{label}</span>
                        </>
                    )}
                </button>
            </form>
        </Form>
    );
}
