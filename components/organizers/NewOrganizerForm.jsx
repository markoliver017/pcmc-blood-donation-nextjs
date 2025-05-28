"use client";
import { createAgency } from "@/action/agencyAction";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import clsx from "clsx";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { Send } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";

import SweetAlert from "@components/ui/SweetAlert";
import notify from "@components/ui/notify";
import InlineLabel from "@components/form/InlineLabel";
import { Form, FormField, FormItem } from "@components/ui/form";

import { uploadPicture } from "@/action/uploads";
import FieldError from "@components/form/FieldError";
import { agencySchema } from "@lib/zod/agencySchema";

import { useRouter } from "next/navigation";
import FirstForm from "./AgencyDetailsForm";
import SecondForm from "./AgencyLocationForm";
import FormLogger from "@lib/utils/FormLogger";
import { IoArrowUndoCircle } from "react-icons/io5";
import { formatFormalName } from "@lib/utils/string.utils";
import { getRole } from "@/action/registerAction";
import Skeleton from "@components/ui/skeleton";
import NewUserBasicInfoForm from "@components/user/NewUserBasicInfoForm";
import NewUserCredentialsForm from "@components/user/NewUserCredentialsForm";
import ConfirmTable from "./ConfirmTable";

const form_sections = [
    {
        title: "Agency Administrator",
        class: "progress-info",
        percent: 20,
    },
    {
        title: "Account Credentials",
        class: "progress-info",
        percent: 40,
    },
    {
        title: "Agency Details",
        class: "progress-info",
        percent: 60,
    },
    {
        title: "Location Details",
        class: "progress-info",
        percent: 80,
    },
    {
        title: "Confirm",
        class: "progress-success",
        percent: 100,
        bg: "/bg-5.jpg",
    },
];

export default function AgencyLocationForm({ role_name }) {
    const router = useRouter();

    const { data: user_role, isLoading: user_role_loading } = useQuery({
        queryKey: ["role", role_name],
        queryFn: async () => getRole(role_name),
        enabled: !!role_name,
        staleTime: 10 * 60 * 1000,
        cacheTime: 20 * 60 * 1000,
    });

    const [sectionNo, setSectionNo] = useState(0);

    const queryClient = useQueryClient();

    const {
        data: newAgencyData,
        mutate,
        isPending,
        error,
        isError,
    } = useMutation({
        mutationFn: async (formData) => {
            const res = await createAgency(formData);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            return res.data;
        },
        onSuccess: () => {
            /** note: the return data will be accessible in the debugger
             *so no need to console the onSuccess(data) here **/
            // Invalidate the posts query to refetch the updated list
            queryClient.invalidateQueries({ queryKey: ["users"] });
            SweetAlert({
                title: "Registration Complete",
                text: "You've successfully submitted a request to become one of our partner agencies. You'll be notified once your application is approved.",
                icon: "success",
                confirmButtonText: "I understand.",
                onConfirm: () => router.push("/portal"),
            });
        },
        onError: (error) => {
            if (error?.type === "validation" && error?.errorArr.length) {
                let detailContent = "";
                const { errorArr: details, message } = error;

                detailContent = (
                    <ul className="list-disc list-inside">
                        {details.map((err, index) => (
                            <li key={index}>{err}</li>
                        ))}
                    </ul>
                );
                notify({
                    error: true,
                    message: (
                        <div tabIndex={0} className="collapse">
                            <input type="checkbox" />
                            <div className="collapse-title font-semibold">
                                {message}
                                <br />
                                <small className="link link-warning">
                                    See details
                                </small>
                            </div>
                            <div className="collapse-content text-sm">
                                {detailContent}
                            </div>
                        </div>
                    ),
                });
            } else {
                // Handle server errors
                notify({
                    error: true,
                    message: error?.message,
                });
            }
        },
    });


    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(agencySchema),
        defaultValues: {
            profile_picture: null, // or some default value
            role_ids: [user_role?.id],
            email: "mark@email.com",
            first_name: "Mark",
            last_name: "Roman",
            gender: "male",
            isChangePassword: true,
            password: "User@1234",
            password_confirmation: "User@1234",
            name: "PCMC",
            contact_number: "+639663603172",
            organization_type: "government",
            file: null,
            address: "PCMC Building",
            barangay: "",
            city_municipality: "",
            province: "Metro Manila",
            comments: "",
            selected_province_option: {
                code: "130000000",
                name: "Metro Manila",
                is_ncr: true,
            },
        },
    });

    const {
        watch,
        handleSubmit,
        setValue,
        formState: { errors, isDirty },
    } = form;

    const handleNext = (n) => {
        setSectionNo((prev) => prev + n);
    };

    const onSubmit = async (data) => {
        SweetAlert({
            title: "Blood Drive Agency Registration",
            text: "Submit your agency registration request now? It will be subject to approval.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Proceed",
            cancelButtonText: "Cancel",
            onConfirm: async () => {
                const fileUrl = watch("file_url");
                if (data?.file && !fileUrl) {
                    const result = await uploadPicture(data.file);
                    if (result?.success) {
                        data.file_url = result.file_data?.url || null;
                        setValue("file_url", result.file_data?.url);
                    }
                    console.log("Upload result:", result);
                }
                mutate(data);
            },
        });
    };

    const uploaded_avatar = watch("file");

    useEffect(() => {
        setValue("file_url", null);
    }, [uploaded_avatar]);

    useEffect(() => {
        if (user_role_loading) return;
        setValue("role_ids", [user_role.id]);
    }, [user_role, user_role_loading]);

    if (user_role_loading) return <Skeleton />;

    return (
        <Card className="p-0 md:p-5 bg-slate-100">
            <CardHeader className="text-2xl font-bold">
                <CardTitle></CardTitle>
                <CardDescription>
                    <div></div>
                    <div className="flex pt-2 justify-center rounded items-center dark:bg-slate-800 ">
                        <ul className="steps ">
                            {form_sections.map((sec, i) => (
                                <li
                                    key={i}
                                    className={clsx(
                                        "step px-2",
                                        i <= sectionNo && sec.class
                                    )}
                                // onClick={() => setSectionNo(i)}
                                >
                                    <small className="italic">
                                        {sec.title}
                                    </small>
                                </li>
                            ))}
                        </ul>
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent id="form-modal">
                <Form {...form}>
                    {isError && (
                        <div className="alert alert-error text-gray-700 mb-5">
                            Error: {error.message}
                        </div>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {sectionNo == 0 ? (
                            <NewUserBasicInfoForm
                                details={form_sections[sectionNo]}
                                onNext={handleNext}
                            />
                        ) : (
                            ""
                        )}

                        {sectionNo == 1 ? (
                            <NewUserCredentialsForm
                                details={form_sections[sectionNo]}
                                onNext={handleNext}
                            />
                        ) : (
                            ""
                        )}

                        {sectionNo == 2 ? (
                            <FirstForm
                                details={form_sections[sectionNo]}
                                onNext={handleNext}
                            />
                        ) : (
                            ""
                        )}

                        {sectionNo == 3 ? (
                            <SecondForm
                                details={form_sections[sectionNo]}
                                onNext={handleNext}
                            />
                        ) : (
                            ""
                        )}
                        {sectionNo == 4 ? (
                            <div className="card shadow-md mt-2">
                                <div className="card-body overflow-x-auto rounded-box border border-base-content/5 bg-base-100">

                                    <ConfirmTable watch={watch} />

                                    <FormField
                                        control={form.control}
                                        name="comments"
                                        render={({ field }) => (
                                            <FormItem>
                                                <InlineLabel>
                                                    Any Message:{" "}
                                                    <sup className="italic">
                                                        (optional)
                                                    </sup>
                                                </InlineLabel>

                                                <textarea
                                                    className="textarea textarea-info h-24 w-full"
                                                    placeholder="Your message"
                                                    {...field}
                                                />
                                                <FieldError
                                                    field={errors?.comments}
                                                />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex justify-between mt-4">
                                        <button
                                            onClick={() => handleNext(-1)}
                                            className="btn btn-default"
                                            tabIndex={-1}
                                        >
                                            <IoArrowUndoCircle />{" "}
                                            <span className="hidden sm:inline-block">
                                                Back
                                            </span>
                                        </button>
                                        <button
                                            disabled={!isDirty || isPending}
                                            className="btn btn-neutral hover:bg-neutral-800 hover:text-green-300"
                                        >
                                            {isPending ? (
                                                <>
                                                    <span className="loading loading-bars loading-xs"></span>
                                                    Submitting ...
                                                </>
                                            ) : (
                                                <>
                                                    <Send />
                                                    Submit
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            ""
                        )}

                        <FormLogger
                            watch={watch}
                            errors={errors}
                            data={newAgencyData}
                        />
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
