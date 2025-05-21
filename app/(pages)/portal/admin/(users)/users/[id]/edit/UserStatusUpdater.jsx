"use client";
import { updateUserStatus } from "@/action/userAction";
import Toggle from "@components/reusable_components/Toggle";

import { Form, FormField, FormItem } from "@components/ui/form";
import notify from "@components/ui/notify";
import SweetAlert from "@components/ui/SweetAlert";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";

export default function UserStatusUpdater({ userData, formClassName = "" }) {
    const queryClient = useQueryClient();

    const {
        // data: userData,
        mutate,
    } = useMutation({
        mutationFn: async (formData) => {
            const res = await updateUserStatus(formData);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            return res.data;
        },
        onSuccess: (data) => {
            // console.log("onSuccess", data);
            // alert(JSON.stringify(data));
            queryClient.invalidateQueries({ queryKey: ["users"] });

            SweetAlert({
                title: "Updated Status",
                text: "The user's status has been successfully updated.",
                icon: "info",
                confirmButtonText: "Done",
            });
        },
        onError: (error) => {
            notify({ error: true, message: error?.message });
        },
    });

    const form = useForm({
        mode: "onChange",
        defaultValues: userData,
    });

    const { handleSubmit } = form;

    const onSubmit = async (data) => {
        mutate(data);
    };

    const handleOnChange = (onChange, value) => {
        const text = value
            ? "Are you sure you want to deactivate the user?"
            : "Are you sure you want to activate this user?";
        SweetAlert({
            title: "Confirm your action?",
            text: text,
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Proceed",
            onConfirm: () => {
                onChange(!value);
                handleSubmit(onSubmit)();
            },
        });
    };

    return (
        <Form {...form}>
            <div
                className={`${formClassName}`}
                // onSubmit={handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field: { value, onChange } }) => (
                        <FormItem className="mt-5 flex flex-col items-center font-semibold md:justify-end">
                            <Toggle
                                value={value}
                                onChange={() => handleOnChange(onChange, value)}
                            />
                        </FormItem>
                    )}
                />
                {/* <button
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
                </button> */}
            </div>
        </Form>
    );
}
