"use client";
import { updateEventRegistrationStatus } from "@/action/adminEventAction";
import { updateAgencyStatus } from "@/action/agencyAction";
import LoadingModal from "@components/layout/LoadingModal";

import { Form } from "@components/ui/form";
import notify from "@components/ui/notify";
import SweetAlert from "@components/ui/SweetAlert";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { Save, XIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GiOpenBook } from "react-icons/gi";

export default function EventRegistrationStatus({
    data,
    formClassName = "",
    setIsLoading
}) {
    let registration_status = "ongoing";
    let confirmText = `Are you sure you want to <b>OPEN</b> the registration for <b><i>"${data?.title}"</i></b>? All registered donors will be notified.`;
    let label = "Open the Registration";
    let icon = <GiOpenBook />
    let className = "btn btn-ghost btn-success";

    if (data?.registration_status == "ongoing") {
        registration_status = "closed";
        confirmText = `Are you sure you want to <b>CLOSE</b> now the registration for <b><i>"${data?.title}"</i></b>?`;
        label = "Close the Registration";
        icon = <XIcon />
        className = "btn btn-ghost btn-warning";
    }

    const queryClient = useQueryClient();


    const {
        mutate,
        isPending
    } = useMutation({
        mutationFn: async (formData) => {
            const res = await updateEventRegistrationStatus(formData);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            return res;
        },
        onSuccess: (data) => {
            setIsLoading(false);
            queryClient.invalidateQueries({ queryKey: ["events"] });
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
            setIsLoading(false);
            notify({ error: true, message: error?.message });
        },
    });

    const form = useForm({
        mode: "onChange",
        defaultValues: {
            id: data.id,
            registration_status
        },
    });

    const { handleSubmit, reset } = form;

    const onSubmit = async (data) => {

        SweetAlert({
            title: "Confirm your action?",
            html: confirmText,
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Proceed",
            onConfirm: async () => {
                setIsLoading(true);
                mutate(data);
            },
        });
    };

    if (!data || data?.status !== "approved") {
        return null;
    }

    return (
        <Form {...form}>

            <form
                className={`${formClassName}`}
                onSubmit={handleSubmit(onSubmit)}
            >
                <button
                    type="submit"
                    disabled={isPending}
                    className={clsx(className)}
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
