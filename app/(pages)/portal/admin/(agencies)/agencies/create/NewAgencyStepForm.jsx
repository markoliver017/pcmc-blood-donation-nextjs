"use client";
import { createAgency } from "@/action/agencyAction";

import { useMutation, useQueryClient } from "@tanstack/react-query";

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
import FirstForm from "./FirstForm";
import SecondForm from "./SecondForm";
import FormLogger from "@lib/utils/FormLogger";
import { IoArrowUndoCircle } from "react-icons/io5";
import { formatFormalName } from "@lib/utils/string.utils";

const form_sections = [
    {
        title: "Organizer Details",
        class: "progress-info",
        percent: 30,
    },
    {
        title: "Location Details",
        class: "progress-info",
        percent: 70,
    },
    {
        title: "Confirm",
        class: "progress-success",
        percent: 100,
        bg: "/bg-5.jpg",
    },
];

export default function NewAgencyStepForm({
    title = "Blood Drive Agency Registration",
    description = "Step Up to Host a Blood Drive",
}) {
    const router = useRouter();
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
            name: "PCMC",
            contact_number: "+639663603172",
            // agency_email: "",
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
            text: "Submit request for agency registration? Approval is required.",
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

    return (
        <Card className="p-0 md:p-5 bg-slate-100">
            <CardHeader className="text-2xl font-bold">
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    <div>{description}</div>
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
                            <FirstForm
                                details={form_sections[sectionNo]}
                                onNext={handleNext}
                            />
                        ) : (
                            ""
                        )}

                        {sectionNo == 1 ? (
                            <SecondForm
                                details={form_sections[sectionNo]}
                                onNext={handleNext}
                            />
                        ) : (
                            ""
                        )}
                        {sectionNo == 2 ? (
                            <div className="card shadow-md mt-2">
                                <div className="card-body overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                                    <table className="table table-zebra border mb-5">
                                        <tbody>
                                            <tr className="bg-gray-200 dark:bg-gray-900 border-b border-gray-300">
                                                <th colSpan={2}>
                                                    Organizer Details
                                                </th>
                                            </tr>
                                            <tr className="hover:bg-base-300">
                                                <th width="20%">Name:</th>
                                                <td>
                                                    {watch(
                                                        "name"
                                                    ).toUpperCase()}
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-base-300">
                                                <th>Contact Number:</th>
                                                <td>
                                                    {watch("contact_number")}
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-base-300">
                                                <th>Organization Type:</th>
                                                <td>
                                                    {formatFormalName(
                                                        watch(
                                                            "organization_type"
                                                        )
                                                    )}
                                                </td>
                                            </tr>
                                            <tr className="bg-gray-200 dark:bg-gray-900 border-b border-gray-300">
                                                <th colSpan={2}>
                                                    Location Details
                                                </th>
                                            </tr>
                                            <tr className="hover:bg-base-300">
                                                <th>Address:</th>
                                                <td>{watch("address")}</td>
                                            </tr>
                                            <tr className="hover:bg-base-300">
                                                <th>Barangay:</th>
                                                <td>{watch("barangay")}</td>
                                            </tr>
                                            <tr className="hover:bg-base-300">
                                                <th>City/Municipality:</th>
                                                <td>
                                                    {watch("city_municipality")}
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-base-300">
                                                <th>Area:</th>
                                                <td>{watch("province")}</td>
                                            </tr>
                                        </tbody>
                                    </table>
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
