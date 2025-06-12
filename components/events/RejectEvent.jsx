"use client";
import { updateEventStatus } from "@/action/adminEventAction";
import { updateAgencyStatus } from "@/action/agencyAction";

import {
    Dialog,
    DialogContent,
    DialogContentNoX,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@components/ui/form";
import SweetAlert from "@components/ui/SweetAlert";

import { Cross2Icon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Send, XIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";

export default function RejectEvent({ eventId, className = "btn-error" }) {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const {
        // data: newAgencyData,
        mutate,
        isPending,
    } = useMutation({
        mutationFn: async (formData) => {
            const res = await updateEventStatus(formData);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["all_events"] });

            setOpen(false);
            SweetAlert({
                title: "Rejection Successful",
                text: "Blood donation event rejected successfully.",
                icon: "info",
                confirmButtonText: "Done",
                onConfirm: reset,
            });
        },
        onError: (error) => {
            setError("remarks", {
                type: "custom",
                message: error?.message,
            });
        },
    });

    const form = useForm({
        mode: "onChange",
        // resolver: zodResolver(agencySchema),
        defaultValues: {
            id: eventId,
            status: "rejected",
            remarks: "",
        },
    });

    const {
        handleSubmit,
        reset,
        setError,
        formState: { errors, isDirty },
    } = form;

    const onSubmit = async (data) => {
        mutate(data);
    };

    return (
        <Dialog
            // id="form-rejection-modal"
            open={open}
            onOpenChange={(value) => {
                // Only allow closing through specific logic, not outside clicks
                if (value === false) return; // block closing
                setOpen(value);
            }}
            modal={true} // enables modal behavior (trap focus, prevent close on escape by default)
        >
            <DialogTrigger
                className={`btn ${className} hover:btn-neutral hover:text-red-400`}
            >
                <XIcon /> Reject
            </DialogTrigger>
            <DialogContent>
                <ToastContainer />
                <DialogHeader>
                    <div
                        onClick={() => {
                            reset();
                            setOpen(false);
                        }}
                        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-500 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 dark:data-[state=open]:bg-neutral-800 dark:data-[state=open]:text-neutral-400"
                    >
                        <Cross2Icon className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </div>
                    <DialogTitle className="dark:text-white">
                        Are you sure you want to reject this blood drive event?
                    </DialogTitle>
                    <DialogDescription className="dark:text-slate-200">
                        This action cannot be undone.
                    </DialogDescription>
                    <Form {...form}>
                        <form
                            // onSubmit={handleSubmit(onSubmit)}
                            className="space-y-2"
                        >
                            <FormField
                                control={form.control}
                                name="remarks"
                                render={({ field }) => (
                                    <FormItem>
                                        <label className="block mb-5">
                                            Please provide reason for rejection:{" "}
                                        </label>

                                        <textarea
                                            className="textarea dark:text-white textarea-info h-24 w-full border"
                                            placeholder="Your reason"
                                            {...field}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end">

                                <button
                                    type="button"
                                    onClick={() => handleSubmit(onSubmit)()}
                                    disabled={!isDirty || isPending}
                                    className="btn btn-neutral mt-4 space-x-2 hover:bg-neutral-800 hover:text-red-300"
                                >
                                    {isPending ? (
                                        <>
                                            <span className="loading loading-bars loading-xs"></span>
                                            Submitting ...
                                        </>
                                    ) : (
                                        <>
                                            <Save />
                                            Reject
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </Form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
