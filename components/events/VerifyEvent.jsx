"use client";
import { updateEventStatus } from "@/action/adminEventAction";
import { updateAgencyStatus } from "@/action/agencyAction";

import { Form } from "@components/ui/form";
import notify from "@components/ui/notify";
import SweetAlert from "@components/ui/SweetAlert";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";

export default function VerifyEvent({
    eventData,
    icon = <Save />,
    label = "Save",
    className = "btn-neutral",
    formClassName = "",
}) {
    const queryClient = useQueryClient();

    const {
        // data: eventData,
        mutate,
        isPending,
    } = useMutation({
        mutationFn: async (formData) => {
            const res = await updateEventStatus(formData);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            return res;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["all_events"] });
            queryClient.invalidateQueries({ queryKey: ["agency_events"] });

            SweetAlert({
                title: data?.title,
                text: data?.text,
                icon: "info",
                confirmButtonText: "Done",
                onConfirm: reset,
            });
        },
        onError: (error) => {
            notify({ error: true, message: error?.message });
        },
    });

    const form = useForm({
        mode: "onChange",
        defaultValues: eventData,
    });

    const { handleSubmit, reset } = form;

    const onSubmit = async (data) => {
        const text =
            data?.status == "approved"
                ? `Are you sure you want to approve the blood donation event?`
                : `Are you sure you want to cancel the blood donation event?`;
        SweetAlert({
            title: "Confirm your action?",
            text,
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
                    disabled={isPending}
                    className={clsx(
                        "hover:bg-neutral-800 hover:text-green-300",
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
