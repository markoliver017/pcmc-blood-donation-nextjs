"use client";

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
import { MessageCircle, Phone, Send } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";

import SweetAlert from "@components/ui/SweetAlert";
import notify from "@components/ui/notify";
import InlineLabel from "@components/form/InlineLabel";
import { Form, FormField, FormItem } from "@components/ui/form";

import { uploadPicture } from "@/action/uploads";
import FieldError from "@components/form/FieldError";

import {
    redirect,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import FormLogger from "@lib/utils/FormLogger";
import { IoArrowUndoCircle } from "react-icons/io5";
import { getRole } from "@/action/registerAction";
import Skeleton from "@components/ui/skeleton";
import NewUserBasicInfoForm from "@components/user/NewUserBasicInfoForm";
import NewUserCredentialsForm from "@components/user/NewUserCredentialsForm";

import DisplayValidationErrors from "@components/form/DisplayValidationErrors";
import Preloader3 from "@components/layout/Preloader3";
import LoadingModal from "@components/layout/LoadingModal";

import CoordinatorConfirmTable from "./CoordinatorConfirmTable";
import { coordinatorRegistrationWithUser } from "@lib/zod/agencySchema";
import { storeCoordinator } from "@/action/agencyAction";

const form_sections = [
    {
        title: "New Account Details",
        class: "progress-info",
        percent: 35,
    },
    {
        title: "Account Credentials",
        class: "progress-info",
        percent: 70,
    },
    {
        title: "Confirm",
        class: "progress-success",
        percent: 100,
    },
];

export default function NewCoordinatorForm({ role_name, agency_id }) {
    const params = useSearchParams();

    const { data: user_role, isLoading: user_role_loading } = useQuery({
        queryKey: ["role", role_name],
        queryFn: async () => getRole(role_name),
        enabled: !!role_name,
        staleTime: 10 * 60 * 1000,
        cacheTime: 20 * 60 * 1000,
    });

    const [sectionNo, setSectionNo] = useState(
        Number(params?.get("step")) || 0
    );

    const queryClient = useQueryClient();

    const {
        data: newDonorData,
        mutate,
        isPending,
        error,
        isError,
    } = useMutation({
        mutationFn: async (formData) => {
            const res = await storeCoordinator(formData);
            if (!res.success) {
                throw res; // Throw the error response to trigger onError
            }
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            SweetAlert({
                title: "Registration Complete",
                text: "Thank you for registering as a coordinator with one of our partner agencies. Your application has been submitted successfully and is now pending approval from the agency. You will receive a notification via email or system alert once your registration has been approved.",
                icon: "success",
                confirmButtonText: "I understand.",
                onConfirm: () => window.location.reload(),
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

    // console.log("agencyRegistrationSchema", z.object(userSchema.shape))
    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(coordinatorRegistrationWithUser),
        defaultValues: {
            agency_id: agency_id,
            role_ids: [user_role?.id],
            profile_picture: null,
            image: null,
            email: "mark29@email.com",
            first_name: "Mark",
            last_name: "Roman",
            gender: "male",
            contact_number: "+639123456789",
            password: "User@1234",
            password_confirmation: "User@1234",
            comments: "",
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
            title: "Coordinator Registration",
            text: "Submit your request now? ",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Proceed",
            cancelButtonText: "Cancel",
            onConfirm: async () => {
                /* if no file_url but theres an uploaded file proceed to upload picture*/
                const fileImage = watch("image");
                if (data?.profile_picture && !fileImage) {
                    const result = await uploadPicture(data.profile_picture);
                    if (result?.success) {
                        data.image = result.file_data?.url || null;
                        setValue("image", result.file_data?.url);
                    }
                    console.log("Upload result:", result);
                }
                mutate(data);
            },
        });
    };
    const profilePic = watch("profile_picture");

    const profilePicFile = {
        name: profilePic?.name,
        size: profilePic?.size,
        type: profilePic?.type,
        lastModified: profilePic?.lastModified,
    };

    useEffect(() => {
        if (user_role_loading) return;
        setValue("role_ids", [user_role.id]);
    }, [user_role, user_role_loading]);

    if (user_role_loading) return <Skeleton />;

    return (
        <>
            <Card className="bg-slate-100 ">
                <CardHeader className="text-2xl font-bold">
                    <CardTitle></CardTitle>
                    <CardDescription>
                        <div className="flex justify-center rounded items-center dark:bg-slate-800 ">
                            <ul className="steps ">
                                {form_sections.map((sec, i) => (
                                    <li
                                        key={i}
                                        className={clsx(
                                            "step px-2 cursor-pointer hover:progress-primary",
                                            i <= sectionNo && sec.class
                                        )}
                                        onClick={() => {
                                            if (sectionNo < i) return;
                                            setSectionNo(i);
                                        }}
                                    >
                                        <small className="italic hover:text-blue-500">
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
                                    triggerFields={[
                                        "profile_picture",
                                        "role_ids",
                                        "first_name",
                                        "last_name",
                                        "gender",
                                        "contact_number",
                                    ]}
                                    details={form_sections[sectionNo]}
                                    onNext={handleNext}
                                >
                                    <FormField
                                        control={form.control}
                                        name="contact_number"
                                        render={({ field }) => (
                                            <FormItem>
                                                <InlineLabel>
                                                    Contact Number:{" "}
                                                </InlineLabel>
                                                <label
                                                    className={clsx(
                                                        "input w-full mt-1",
                                                        errors?.contact_number
                                                            ? "input-error"
                                                            : "input-info"
                                                    )}
                                                >
                                                    <Phone className="h-3" />
                                                    <input
                                                        type="text"
                                                        tabIndex={4}
                                                        {...field}
                                                        placeholder="+63#########"
                                                    />
                                                </label>

                                                <FieldError
                                                    field={
                                                        errors?.contact_number
                                                    }
                                                />
                                            </FormItem>
                                        )}
                                    />
                                </NewUserBasicInfoForm>
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
                                <>
                                    <Preloader3 />
                                    <LoadingModal isLoading={isPending}>
                                        Errors
                                    </LoadingModal>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-2xl">
                                                Registration Summary
                                            </CardTitle>
                                            <CardDescription>
                                                <DisplayValidationErrors
                                                    errors={errors}
                                                />
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <CoordinatorConfirmTable
                                                watch={watch}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="comments"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <InlineLabel
                                                            required={false}
                                                            optional={true}
                                                        >
                                                            <span className="flex-items-center">
                                                                <MessageCircle />
                                                                Any Message:{" "}
                                                            </span>
                                                        </InlineLabel>

                                                        <textarea
                                                            className="textarea border border-gray-300 textarea-info h-24 w-full"
                                                            placeholder="Your message"
                                                            {...field}
                                                        />
                                                        <FieldError
                                                            field={
                                                                errors?.comments
                                                            }
                                                        />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="flex justify-between mt-4">
                                                <button
                                                    onClick={() =>
                                                        handleNext(-1)
                                                    }
                                                    className="btn btn-default"
                                                    tabIndex={-1}
                                                >
                                                    <IoArrowUndoCircle />{" "}
                                                    <span className="hidden sm:inline-block">
                                                        Back
                                                    </span>
                                                </button>
                                                <button
                                                    disabled={
                                                        !isDirty || isPending
                                                    }
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
                                        </CardContent>
                                    </Card>
                                </>
                            ) : (
                                ""
                            )}

                            {/* <FormLogger
                                watch={watch}
                                errors={errors}
                                data={newDonorData}
                            />
                            <pre>
                                <b>User profile File: </b>{" "}
                                {JSON.stringify(profilePicFile)}
                            </pre> */}
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    );
}
