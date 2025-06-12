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
import { MessageCircle, Send } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";

import SweetAlert from "@components/ui/SweetAlert";
import notify from "@components/ui/notify";
import InlineLabel from "@components/form/InlineLabel";
import { Form, FormField, FormItem } from "@components/ui/form";

import { uploadPicture } from "@/action/uploads";
import FieldError from "@components/form/FieldError";

import { useRouter } from "next/navigation";
import FormLogger from "@lib/utils/FormLogger";
import { IoArrowUndoCircle } from "react-icons/io5";
import { getRole } from "@/action/registerAction";
import Skeleton from "@components/ui/skeleton";
import NewUserBasicInfoForm from "@components/user/NewUserBasicInfoForm";
import NewUserCredentialsForm from "@components/user/NewUserCredentialsForm";

import DisplayValidationErrors from "@components/form/DisplayValidationErrors";
import Preloader3 from "@components/layout/Preloader3";
import LoadingModal from "@components/layout/LoadingModal";
import DonorBasicInfoForm from "./DonorBasicInfoForm";
import AgencyLocationForm from "@components/organizers/AgencyLocationForm";
import DonorBloodDonationInfoForm from "./DonorBloodDonationInfoForm";
import ConfirmTable from "./ConfirmTable";
import { donorRegistrationWithUser } from "@lib/zod/donorSchema";
import { storeDonor } from "@/action/donorAction";

const form_sections = [
    {
        title: "New Account Details",
        class: "progress-info",
        percent: 15,
    },
    {
        title: "Account Credentials",
        class: "progress-info",
        percent: 30,
    },
    {
        title: "Donor's Profile",
        class: "progress-info",
        percent: 45,
    },
    {
        title: "Location Details",
        class: "progress-info",
        percent: 60,
    },
    {
        title: "Blood Donation History",
        class: "progress-info",
        percent: 75,
    },
    {
        title: "Confirm",
        class: "progress-success",
        percent: 100,
    },
];

export default function NewDonorForm({ role_name, agency_id }) {
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
        data: newDonorData,
        mutate,
        isPending,
        error,
        isError,
    } = useMutation({
        mutationFn: async (formData) => {
            const res = await storeDonor(formData);
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
                text: "Thank you for registering as a blood donor with one of our partner agencies.Your application has been successfully submitted and is now pending agency approval. You’ll be notified via email or system notification once your registration is approved.",
                icon: "success",
                confirmButtonText: "I understand.",
                onConfirm: () => router.push("/"),
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
        resolver: zodResolver(donorRegistrationWithUser),
        defaultValues: {
            agency_id: agency_id,
            role_ids: [user_role?.id],
            profile_picture: null,
            file: "",
            image: null,
            id_url: null,
            email: "mark29@email.com",
            first_name: "Mark",
            last_name: "Roman",
            gender: "male",
            password: "User@1234",
            password_confirmation: "User@1234",
            date_of_birth: "1993-04-23",
            civil_status: "single",
            contact_number: "+639663603172",
            nationality: "Filipino",
            occupation: "Programmer",
            address: "#1 Bonifacio Street",
            barangay: "",
            city_municipality: "",
            province: "Metro Manila",
            selected_province_option: {
                code: "130000000",
                name: "Metro Manila",
                is_ncr: true,
            },
            is_regular_donor: false,
            blood_type_id: "",
            blood_type_label: "",
            last_donation_date: "",
            blood_service_facility: "",
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
            title: "Blood Donor Registration",
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

                const fileUrl = watch("id_url");
                if (data?.file && !fileUrl) {
                    const result = await uploadPicture(data.file);
                    if (result?.success) {
                        data.id_url = result.file_data?.url || null;
                        setValue("id_url", result.file_data?.url);
                    }
                    console.log("Upload result:", result);
                }

                mutate(data);
            },
        });
    };

    const govtId = watch("file");
    const profilePic = watch("profile_picture");
    const govtIdFile = {
        name: govtId?.name,
        size: govtId?.size,
        type: govtId?.type,
        lastModified: govtId?.lastModified,
    };
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
                                <DonorBasicInfoForm
                                    details={form_sections[sectionNo]}
                                    onNext={handleNext}
                                />
                            ) : (
                                ""
                            )}

                            {sectionNo == 3 ? (
                                <AgencyLocationForm
                                    details={form_sections[sectionNo]}
                                    onNext={handleNext}
                                />
                            ) : (
                                ""
                            )}

                            {sectionNo == 4 ? (
                                <DonorBloodDonationInfoForm
                                    details={form_sections[sectionNo]}
                                    onNext={handleNext}
                                />
                            ) : (
                                ""
                            )}

                            {sectionNo == 5 ? (
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
                                            <ConfirmTable watch={watch} />

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
                            </pre>
                            <pre>
                                <b>Govt ID File: </b>{" "}
                                {JSON.stringify(govtIdFile)}
                            </pre> */}
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    );
}
