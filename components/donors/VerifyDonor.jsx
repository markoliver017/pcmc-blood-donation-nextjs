"use client";
import { updateAgencyStatus } from "@/action/agencyAction";
import { updateCoordinatorStatus } from "@/action/coordinatorAction";
import { updateDonorStatus } from "@/action/donorAction";

import { Form } from "@components/ui/form";
import notify from "@components/ui/notify";
import SweetAlert from "@components/ui/SweetAlert";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";

export default function VerifyDonor({
    donorData,
    icon = <Save />,
    label = "Save",
    className = "btn-neutral",
    formClassName = "",
}) {
    const queryClient = useQueryClient();

    const {
        // data: donorData,
        mutate,
        isPending,
    } = useMutation({
        mutationFn: async (formData) => {
            const res = await updateDonorStatus(formData);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            return res;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["donors"] });
            queryClient.invalidateQueries({
                queryKey: ["verified-donors"],
            });
            queryClient.invalidateQueries({
                queryKey: ["donor"],
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
        defaultValues: donorData,
    });

    const { handleSubmit, reset } = form;

    const onSubmit = async (data) => {
        console.log("verfiy donor", data);
        const text =
            data?.status == "activated"
                ? `Are you sure you want to activate this donor?`
                : `Are you sure you want to deactivate this donor?`;
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
            <form className={`${formClassName}`}>
                <button
                    type="button"
                    disabled={isPending}
                    className={clsx(
                        "hover:bg-neutral-800 hover:text-green-300",
                        className
                    )}
                    onClick={(e) => {
                        // e.preventDefault();
                        // e.stopPropagation();
                        handleSubmit(onSubmit)();
                    }}
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
