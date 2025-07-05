"use client";
import { updateCoordinatorStatus } from "@/action/coordinatorAction";
import { updateDonorStatus } from "@/action/donorAction";

import {
    Dialog,
    DialogContentNoX,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@components/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "@components/ui/form";
import SweetAlert from "@components/ui/SweetAlert";

import { Cross2Icon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, XIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";

export default function RejectDonor({ donorId, className = "btn-error" }) {
    const [open, setOpen] = useState(false);
    const [isTriggered, setIsTriggered] = useState(false);
    const queryClient = useQueryClient();
    const textareaRef = useRef(null);

    // Function to close any open dropdowns
    const closeDropdowns = () => {
        // Find and close any open dropdown menus
        const dropdowns = document.querySelectorAll('[data-state="open"]');
        dropdowns.forEach(dropdown => {
            const event = new Event('click', { bubbles: true });
            dropdown.dispatchEvent(event);
        });
    };

    const {
        // data: newAgencyData,
        mutate,
        isPending,
    } = useMutation({
        mutationFn: async (formData) => {
            const res = await updateDonorStatus(formData);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["donors"] });
            queryClient.invalidateQueries({
                queryKey: ["verified-donors"],
            });
            setOpen(false);
            setIsTriggered(false);
            SweetAlert({
                title: "Rejection Successful",
                text: "The donor application was rejected successfully .",
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
            id: donorId,
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

    // Reset triggered state when dialog closes and focus textarea when dialog opens
    useEffect(() => {
        if (!open) {
            setIsTriggered(false);
        } else {
            // Focus the textarea when dialog opens
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus();
                }
            }, 100);
        }
    }, [open]);

    // Add global event listener to handle space key when dialog is open
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (open && e.target.tagName === 'TEXTAREA' && e.key === ' ') {
                e.stopPropagation();
            }
        };

        if (open) {
            document.addEventListener('keydown', handleKeyDown, true);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);
        };
    }, [open]);

    return (
        <Dialog
            // id="form-rejection-modal"
            open={open}
            onOpenChange={(value) => {
                if (isTriggered && !value) {
                    // If we triggered the dialog and it's trying to close, allow it
                    setOpen(value);
                    setIsTriggered(false);
                } else if (value) {
                    // If trying to open, allow it
                    setOpen(value);
                }
                // If not triggered and trying to close, ignore
            }}
            modal={true} // enables modal behavior (trap focus, prevent close on escape by default)
        >
            <DialogTrigger
                className={`btn ${className} hover:btn-neutral hover:text-red-400`}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    closeDropdowns(); // Close any open dropdowns
                    setIsTriggered(true);
                    setOpen(true);
                }}
            >
                <XIcon /> Reject
            </DialogTrigger>
            <DialogContentNoX 
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                    // Prevent dialog from interfering with textarea input
                    if (e.target.tagName === 'TEXTAREA') {
                        e.stopPropagation();
                    }
                }}
            >
                <ToastContainer />
                <DialogHeader>
                    <div
                        onClick={() => {
                            reset();
                            setOpen(false);
                            setIsTriggered(false);
                        }}
                        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-500 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 dark:data-[state=open]:bg-neutral-800 dark:data-[state=open]:text-neutral-400"
                    >
                        <Cross2Icon className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </div>
                    <DialogTitle>
                        Are you sure you want to reject this application?
                    </DialogTitle>
                    <DialogDescription>
                        This action cannot be undone.
                    </DialogDescription>
                    <Form {...form}>
                        <form
                            // onSubmit={handleSubmit(onSubmit)}
                            className="space-y-2"
                            onKeyDown={(e) => {
                                // Prevent form from interfering with textarea input
                                if (e.target.tagName === 'TEXTAREA') {
                                    e.stopPropagation();
                                }
                            }}
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
                                            ref={textareaRef}
                                            className="textarea textarea-info h-24 w-full border"
                                            placeholder="Your reason"
                                            {...field}
                                            onKeyDown={(e) => {
                                                // Prevent space key from being intercepted
                                                if (e.key === ' ') {
                                                    e.stopPropagation();
                                                }
                                            }}
                                            onKeyUp={(e) => {
                                                // Prevent space key from being intercepted
                                                if (e.key === ' ') {
                                                    e.stopPropagation();
                                                }
                                            }}
                                            onFocus={(e) => {
                                                // Ensure textarea gets proper focus
                                                e.target.select();
                                            }}
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
                                    className="btn btn-neutral mt-4 hover:bg-neutral-800 hover:text-green-300"
                                >
                                    {isPending ? (
                                        <>
                                            <span className="loading loading-bars loading-xs"></span>
                                            Submitting ...
                                        </>
                                    ) : (
                                        <>
                                            <Save />
                                            Submit
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </Form>
                </DialogHeader>
            </DialogContentNoX>
        </Dialog>
    );
}
