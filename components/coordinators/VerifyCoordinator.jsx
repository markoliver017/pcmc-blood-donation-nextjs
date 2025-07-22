"use client";
import { updateAgencyStatus } from "@/action/agencyAction";
import { updateCoordinatorStatus } from "@/action/coordinatorAction";

import { Form } from "@components/ui/form";
import notify from "@components/ui/notify";
import SweetAlert from "@components/ui/SweetAlert";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";

export default function VerifyCoordinator({
    agencyData,
    icon = <Save />,
    label = "Save",
    className = "btn-neutral",
    formClassName = "",
}) {
    const queryClient = useQueryClient();

    const {
        // data: newAgencyData,
        mutate,
        isPending,
    } = useMutation({
        mutationFn: async (formData) => {
            const res = await updateCoordinatorStatus(formData);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            return res;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["coordinator"] });
            queryClient.invalidateQueries({ queryKey: ["coordinators"] });
            queryClient.invalidateQueries({
                queryKey: ["verified-coordinators"],
            });
            queryClient.invalidateQueries({
                queryKey: ["agency"],
            });

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
        defaultValues: agencyData,
    });

    const { handleSubmit, reset } = form;

    const onSubmit = async (data) => {
        console.log("verfiy agency", data);
        const text =
            data?.status == "activated"
                ? `Are you sure you want to activate this coordinator application?`
                : `Are you sure you want to deactivate this coordinator application?`;
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
