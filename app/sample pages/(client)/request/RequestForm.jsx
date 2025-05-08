"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { Building, Mail, Send, User2Icon } from "lucide-react";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { toast } from "react-toastify";
import { requestSchema } from "@lib/zod/requestSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { BiError } from "react-icons/bi";
import SweetAlert from "@components/ui/SweetAlert";
import notify from "@components/ui/notify";

export default function RequestForm() {
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        watch,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        resolver: zodResolver(requestSchema),
        defaultValues: {
            request_date: new Date().toISOString().slice(0, 10),
        },
    });

    const onSubmit = async (data) => {
        setIsLoading(true);

        SweetAlert({
            title: "Confirmation",
            text: "You are about to submit a request.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Submit",
            cancelButtonText: "Cancel",
            onConfirm: async () => {
                setIsLoading(true);

                try {
                    const response = await fetch("/api/requests", {
                        method: "POST",
                        body: JSON.stringify(data),
                        headers: { "Content-Type": "application/json" },
                    });

                    const result = await response.json();

                    if (!response.ok) {
                        throw result;
                    }

                    SweetAlert({
                        title: "Request Submitted",
                        text: "Your request has been received and is now pending approval. You will be notified once it has been reviewed.",
                        icon: "success",
                        confirmButtonText: "OK",
                    });

                    reset();
                } catch (err) {
                    if (
                        err?.message == "Validation failed" &&
                        Array.isArray(err.details)
                    ) {
                        const { error, details, message } = err;

                        let detailContent = null;

                        if (Array.isArray(details)) {
                            // If it's an array, show a list
                            detailContent = (
                                <ul className="list-disc list-inside">
                                    {details.map((err, index) => (
                                        <li key={index}>{err}</li>
                                    ))}
                                </ul>
                            );
                        } else if (
                            typeof details === "object" &&
                            details !== null
                        ) {
                            // If it's an object, show key-value pairs
                            detailContent = (
                                <ul className="list-disc list-inside">
                                    {Object.entries(details).map(
                                        ([key, val], index) => (
                                            <li key={index}>
                                                <strong>{key}:</strong> {val}
                                            </li>
                                        )
                                    )}
                                </ul>
                            );
                        }

                        notify({
                            error,
                            message: (
                                <div tabIndex={0} className="collapse">
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
                    }
                } finally {
                    setIsLoading(false);
                }
            },
        });
    };
    // useEffect(() => {
    //     console.log("errors", errors);
    // }, [errors]);

    // useEffect(() => {
    //     console.log("watchall", watch());
    // }, [watch()]);

    return (
        <Card className="p-5 bg-gray-100">
            <CardHeader className="text-2xl font-bold">
                <CardTitle>Data Request Form</CardTitle>
                <CardDescription className="text-justify pt-1">
                    If you are requesting medication error data for academic
                    research, quality improvement, or patient safety purposes,
                    please provide your personal and professional details.
                    Kindly note that all requests are subject to approval. Once
                    approved, the requested data will be forwarded to you.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input type="hidden" {...register("request_date")} />
                    <div>
                        <label className="fieldset-label font-semibold">
                            Your Email
                        </label>
                        <label className="input w-full mt-1">
                            <Mail className="h-3" />
                            <input
                                type="email"
                                {...register("email")}
                                placeholder="example@email.com"
                            />
                        </label>
                        {errors.email && (
                            <p className="text-red-500 text-sm flex-items-center">
                                <BiError />
                                <span>{errors.email?.message}</span>
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="fieldset-label font-semibold">
                            Company / Agency / Institution
                        </label>
                        <label className="input w-full mt-1">
                            <Building className="h-3" />
                            <input
                                type="text"
                                {...register("company")}
                                placeholder="Company / Agency / Institution"
                            />
                        </label>
                        {errors.company && (
                            <p className="text-red-500 text-sm flex-items-center">
                                <BiError />
                                <span>{errors.company?.message}</span>
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="fieldset-label font-semibold">
                            Profession
                        </label>
                        <label className="input w-full mt-1">
                            <User2Icon className="h-3" />
                            <input
                                type="text"
                                {...register("profession")}
                                placeholder="Your Profession"
                            />
                        </label>
                        {errors.profession && (
                            <p className="text-red-500 text-sm flex-items-center">
                                <BiError />
                                <span>{errors.profession?.message}</span>
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="fieldset-label font-semibold">
                            <ChatBubbleIcon className="h-3" /> Purpose of
                            Request
                        </label>

                        <textarea
                            className="textarea w-full mt-1"
                            rows={4}
                            {...register("purpose")}
                            placeholder="Purpose of request"
                        ></textarea>

                        {errors.purpose && (
                            <p className="text-red-500 text-sm flex-items-center">
                                <BiError />
                                <span>{errors.purpose?.message}</span>
                            </p>
                        )}
                    </div>
                    <div className="flex justify-end">
                        <button className="btn btn-neutral mt-4 hover:bg-neutral-800 hover:text-green-300">
                            {isLoading ? (
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
                </form>
            </CardContent>
        </Card>
    );
}
