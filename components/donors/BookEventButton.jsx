"use client";
import { updateEventStatus } from "@/action/adminEventAction";
import { updateAgencyStatus } from "@/action/agencyAction";
import { bookDonorAppointment } from "@/action/donorAppointmentAction";

import { Form } from "@components/ui/form";
import notify from "@components/ui/notify";
import SweetAlert from "@components/ui/SweetAlert";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { CalendarPlus } from "lucide-react";
import moment from "moment";
import { useForm } from "react-hook-form";

export default function BookEventButton({
    event,
    schedule,
    isDisabled = false,
    icon = <CalendarPlus />,
    label = "Book",
    className = "btn-neutral",
    formClassName = "",
    onLoad = () => {},
    onFinish = () => {},
}) {
    const queryClient = useQueryClient();

    const {
        // data: eventData,
        mutate,
        isPending,
    } = useMutation({
        mutationFn: async (formData) => {
            onLoad();
            const res = await bookDonorAppointment(formData);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            return res;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["blood_drives"] });
            SweetAlert({
                title: "Blood Donation Booked",
                text: `You have successfully booked an appointment for ${
                    event?.title
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
            console.log(">>>>>>>>>>>>>>>>>", error);
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
            time_schedule_id: schedule?.id,
            event_id: schedule?.blood_donation_event_id,
        },
    });

    const { handleSubmit, reset } = form;

    const onSubmit = async (data) => {
        SweetAlert({
            title: "Confirm your action?",
            html: `Are you sure you want to book an appointment on <b>${moment(
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

    return (
        <Form {...form}>
            <form
                className={`${formClassName}`}
                onSubmit={handleSubmit(onSubmit)}
            >
                <button
                    type="submit"
                    disabled={isPending || isDisabled}
                    className={clsx(
                        "btn btn-neutral hover:bg-neutral-800 hover:text-green-300",
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
                            {label}
                        </>
                    )}
                </button>
            </form>
        </Form>
    );
}
