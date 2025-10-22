"use client";
import { Button } from "@components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@components/ui/drawer";
import { AlertCircle, Check, Cog } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import FormLogger from "@lib/utils/FormLogger";
import dynamic from "next/dynamic";
const CreatableSelectNoSSR = dynamic(() => import("react-select/creatable"), {
    ssr: false,
});

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import FieldError from "@components/form/FieldError";
import { getSingleStyle } from "@/styles/select-styles";
import { useTheme } from "next-themes";
import { fetchAllAgencies } from "@/action/agencyAction";
import { useEffect, useState } from "react";
import { updateDonorAgencySchema } from "@lib/zod/donorSchema";
import { updateDonorAgency } from "@/action/donorAction";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    toastCatchError,
    toastOnDialogCatchError,
} from "@lib/utils/toastError.utils";
import { toast, Toaster } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@components/ui/alert-dialog";
import SweetAlert from "@components/ui/SweetAlert";
import { useModalToastContainer } from "@lib/hooks/useModalToastContainer";
import { signOut } from "next-auth/react";

export default function AgencySettings({ userData }) {
    useModalToastContainer("alert-dialog-overlay");
    const { resolvedTheme } = useTheme();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [confirmationText, setConfirmationText] = useState("");
    const {
        data: agencies,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ["agencies"],
        queryFn: async () => {
            const res = await fetchAllAgencies();
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
    });

    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(updateDonorAgencySchema),
        defaultValues: {
            user_id: userData?.id,
            status: "for approval",
            agency_id: userData?.donor?.agency_id,
        },
    });
    // alert(userData.donor.agency_id);

    const {
        watch,
        handleSubmit,
        setValue,
        setError,
        control,
        reset,
        formState: { errors, isDirty },
    } = form;

    const { mutate: mutateDonorAgency, isPending } = useMutation({
        mutationFn: async (formData) => {
            const res = await updateDonorAgency(userData?.id, formData);
            if (!res.success) {
                throw res;
            }
            return res;
        },
        onSuccess: (data) => {
            toast.success("Donor agency updated successfully!");
            setOpenAlert(false);
            setTimeout(() => {
                queryClient.invalidateQueries({
                    queryKey: ["user", userData?.id],
                });

                signOut({ callbackUrl: "/" });
            }, 1000);
        },
        onError: (error) => {
            setOpenAlert(false);
            reset();
            toastOnDialogCatchError(error, setError);
            if (error.type === "validation" && error.errorObj) {
                Object.entries(error.errorObj).forEach(([field, messages]) => {
                    setError(field, {
                        type: "manual",
                        message: Array.isArray(messages)
                            ? messages[0]
                            : messages,
                    });
                });
            }
        },
    });

    const onSubmit = (data) => {
        mutateDonorAgency(data);
    };

    useEffect(() => {
        if (open && userData?.donor?.agency_id !== undefined) {
            // Pass the default values explicitly to ensure the reset works,
            // especially if you rely on values that might load asynchronously.
            reset({
                user_id: userData?.id,
                agency_id: userData?.donor?.agency_id,
                status: "for approval",
            });
        }
    }, [open]);

    useEffect(() => {
        if (openAlert) {
            setConfirmationText("");
        }
    }, [openAlert]);

    if (isLoading || isFetching) {
        return <div className="skeleton h-12 w-20"></div>;
    }

    const agencyOptions = agencies?.map((agency) => ({
        value: agency.id,
        label: agency.name,
    }));

    return (
        <Drawer direction="right" open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline" onClick={() => setOpen(true)}>
                    <Cog className="w-4 h-4" />
                    <span className="hidden md:inline-block">
                        Agency Settings
                    </span>
                </Button>
            </DrawerTrigger>
            <DrawerContent
                id="form-modal"
                className=" dark:text-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800"
            >
                <Toaster />
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mx-auto w-full max-w-sm">
                            <DrawerHeader>
                                <DrawerTitle className="dark:text-slate-200">
                                    Agency Settings
                                </DrawerTitle>
                                <DrawerDescription className="dark:text-slate-400">
                                    Set your agency settings.
                                </DrawerDescription>
                            </DrawerHeader>
                            <div className="p-4 pb-0">
                                <div className="mt-3 h-[120px]">
                                    {/* <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    > */}
                                    {/* <FormField
                                        control={control}
                                        name="user_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    User ID{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </FormLabel>
                                                <Input
                                                    {...field}
                                                    placeholder="Enter the User ID"
                                                />
                                                <FormMessage />
                                                <FieldError
                                                    error={errors.user_id}
                                                />
                                            </FormItem>
                                        )}
                                    /> */}

                                    <FormField
                                        control={control}
                                        name="agency_id"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel className="font-semibold text-xl">
                                                        Your current agency:
                                                    </FormLabel>
                                                    <CreatableSelectNoSSR
                                                        isMulti={false}
                                                        value={agencyOptions?.find(
                                                            (option) =>
                                                                option.value ===
                                                                field.value
                                                        )}
                                                        options={agencyOptions}
                                                        onChange={(
                                                            selected
                                                        ) => {
                                                            const value =
                                                                selected
                                                                    ? selected.value
                                                                    : null;

                                                            field.onChange(
                                                                value
                                                            );
                                                        }}
                                                        isValidNewOption={() =>
                                                            false
                                                        }
                                                        placeholder="Select Agency"
                                                        styles={getSingleStyle(
                                                            resolvedTheme
                                                        )}
                                                        isClearable
                                                    />

                                                    <FormMessage />
                                                    <FieldError
                                                        error={errors.agency_id}
                                                    />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                    {/* </ResponsiveContainer> */}
                                </div>
                            </div>
                            <DrawerFooter>
                                <AlertDialog
                                    open={openAlert}
                                    onOpenChange={setOpenAlert}
                                >
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            disabled={!isDirty || isPending}
                                        >
                                            <AlertCircle />
                                            Change
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Change Agency?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to change
                                                your agency? You will be
                                                temporarily deactivated until
                                                approved by your new agency.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <div className="mt-4">
                                            <p className="text-sm">
                                                Please type{" "}
                                                <strong>CHANGE</strong> to
                                                confirm.
                                            </p>
                                            <input
                                                type="text"
                                                value={confirmationText}
                                                onChange={(e) =>
                                                    setConfirmationText(
                                                        e.target.value
                                                    )
                                                }
                                                className="border p-2 rounded w-full mt-2"
                                            />
                                        </div>
                                        {Object.keys(errors).length > 0 && (
                                            <div className="alert alert-error">
                                                {Object.values(errors).map(
                                                    (error) => error.message
                                                )}
                                            </div>
                                        )}
                                        <AlertDialogFooter>
                                            <Button
                                                disabled={
                                                    confirmationText !==
                                                        "CHANGE" ||
                                                    !isDirty ||
                                                    isPending
                                                }
                                                onClick={() => {
                                                    handleSubmit(onSubmit)();
                                                }}
                                            >
                                                {isPending ? (
                                                    <span className="loading loading-bars loading-xs"></span>
                                                ) : (
                                                    <Check />
                                                )}
                                                Confirm
                                            </Button>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                <DrawerClose
                                    asChild
                                    onClick={() => setOpen(false)}
                                >
                                    <Button variant="outline">Cancel</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </div>

                        {/* <FormLogger
                            watch={watch}
                            errors={errors}
                            initialData={userData.donor}
                        /> */}
                    </form>
                </Form>
            </DrawerContent>
        </Drawer>
    );
}
