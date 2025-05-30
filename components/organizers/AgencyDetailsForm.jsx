"use client";
import { useFormContext } from "react-hook-form";

import notify from "@components/ui/notify";

import clsx from "clsx";
import { useEffect, useRef } from "react";
import { MdNextPlan } from "react-icons/md";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@components/ui/form";
import CustomAvatar from "@components/reusable_components/CustomAvatar";
import { Input } from "@components/ui/input";
import InlineLabel from "@components/form/InlineLabel";
import { Building, Building2Icon, Phone } from "lucide-react";
import FieldError from "@components/form/FieldError";
import { formatFormalName } from "@lib/utils/string.utils";
import { IoArrowUndoCircle } from "react-icons/io5";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import Preloader3 from "@components/layout/Preloader3";

export default function AgencyDetailsForm({ details, onNext }) {
    const {
        trigger,
        control,
        watch,
        resetField,
        setValue,
        formState: { errors },
    } = useFormContext();

    const onSubmitNext = async () => {
        const valid = await trigger([
            "name",
            "contact_number",
            "organization_type",
            "file",
        ]);
        if (valid) {
            onNext(1);
        } else {
            notify(
                {
                    error: true,
                    message: "Please provide the required information..",
                },
                "warning"
            );
        }
    };

    const uploaded_avatar = watch("file");
    const avatar =
        !errors?.file && uploaded_avatar
            ? URL.createObjectURL(uploaded_avatar)
            : errors?.file
            ? "/invalid-file.png"
            : "/default-agency-logo.png";

    useEffect(() => {
        if (watch("file_url")) setValue("file_url", null);
    }, [uploaded_avatar]);

    return (
        <>
            <Preloader3 />
            <Card className="p-0 md:p-5 bg-slate-100">
                <CardHeader className="text-2xl font-bold">
                    <CardTitle className="text-2xl">{details.title}</CardTitle>
                    <CardDescription>
                        <div>Please fill up all the * required fields.</div>
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-5">
                    <FormField
                        control={control}
                        name="file"
                        render={({ field: { onChange, value, ...field } }) => {
                            const fileInputRef = useRef(null);

                            const handleImageClick = () => {
                                if (fileInputRef.current) {
                                    fileInputRef.current.click(); // Trigger the file input click
                                }
                            };
                            return (
                                <FormItem className="flex-none text-center w-full md:w-max">
                                    <div>
                                        <CustomAvatar
                                            avatar={avatar}
                                            whenClick={handleImageClick}
                                            className="w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] lg:w-[350px] lg:h-[350px]"
                                        />
                                        <FormMessage />
                                    </div>

                                    {uploaded_avatar ? (
                                        <button
                                            onClick={() => resetField("file")}
                                            className="btn btn-ghost"
                                        >
                                            Clear
                                        </button>
                                    ) : (
                                        <label className="text-center font-semibold italic text-slate-500">
                                            Logo
                                        </label>
                                    )}
                                    <FormControl ref={fileInputRef}>
                                        <Input
                                            type="file"
                                            className="hidden"
                                            onChange={(e) =>
                                                onChange(e.target.files[0])
                                            }
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            );
                        }}
                    />
                    <div className="flex-1 md:min-w-[350px] flex flex-col justify-evenly ">
                        <FormField
                            control={control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>Agency Name: *</InlineLabel>
                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.name
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <Building className="h-3" />
                                        <input
                                            type="text"
                                            tabIndex={1}
                                            {...field}
                                            placeholder="Your agency/orgranization name .."
                                        />
                                    </label>

                                    <FieldError field={errors?.name} />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="contact_number"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>Contact Number: *</InlineLabel>
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
                                            tabIndex={2}
                                            {...field}
                                            placeholder="+63#########"
                                        />
                                    </label>

                                    <FieldError
                                        field={errors?.contact_number}
                                    />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="organization_type"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>
                                        Organization Type: *
                                    </InlineLabel>

                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.organization_type
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <Building2Icon className="h-3" />
                                        <select
                                            className="w-full dark:bg-inherit"
                                            tabIndex={3}
                                            {...field}
                                        >
                                            <option value="">
                                                Select here
                                            </option>
                                            {[
                                                "business",
                                                "media",
                                                "government",
                                                "church",
                                                "education",
                                                "healthcare",
                                            ].map((org, i) => (
                                                <option key={i} value={org}>
                                                    {formatFormalName(org)}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <FieldError
                                        field={errors?.organization_type}
                                    />
                                </FormItem>
                            )}
                        />
                        <div className="flex-none card-actions justify-between mt-5">
                            <button
                                onClick={() => onNext(-1)}
                                className="btn btn-default"
                                tabIndex={-1}
                            >
                                <IoArrowUndoCircle />{" "}
                                <span className="hidden sm:inline-block">
                                    Back
                                </span>
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={onSubmitNext}
                                tabIndex="4"
                            >
                                <MdNextPlan />{" "}
                                <span className="hidden sm:inline-block">
                                    Next
                                </span>
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
