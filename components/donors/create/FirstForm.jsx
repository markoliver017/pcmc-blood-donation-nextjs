"use client";
import { useFormContext } from "react-hook-form";

import notify from "@components/ui/notify";

import clsx from "clsx";
import { useRef } from "react";
import { MdNextPlan } from "react-icons/md";
import { GiCancel } from "react-icons/gi";
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
import { useRouter } from "next/navigation";

export default function FirstForm({ details, onNext }) {
    const router = useRouter();
    const {
        trigger,
        control,
        watch,
        resetField,
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
            : "/default_company_avatar.png";

    return (
        <section className="h-full flex flex-col">
            <div className="flex flex-wrap sm:gap-5 mb-5">
                <h2 className="card-title text-2xl">{details.title}</h2>
                <div className="text-orange-600 italic">* required fields</div>
            </div>

            <div className="flex flex-wrap xl:flex-nowrap justify-center gap-2 md:gap-5">
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
                            <FormItem className="text-center">
                                <div>
                                    <CustomAvatar
                                        avatar={avatar}
                                        whenClick={handleImageClick}
                                        className="w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] md:w-[350px] md:h-[350px]"
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
                                    <label className="text-center">
                                        Avatar: Click & Upload
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
                <div className="flex flex-col gap-5 w-full sm:min-w-[450px]">
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

                                <FieldError field={errors?.contact_number} />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="organization_type"
                        render={({ field }) => (
                            <FormItem>
                                <InlineLabel>Organization Type: *</InlineLabel>

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
                                        <option value="">Select here</option>
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
                                <FieldError field={errors?.organization_type} />
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            <div className="flex-none card-actions justify-between mt-5">
                <button
                    onClick={() => router.replace("/")}
                    className="btn btn-default"
                    tabIndex={-1}
                >
                    <GiCancel />{" "}
                    <span className="hidden sm:inline-block">Cancel</span>
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onSubmitNext}
                    tabIndex="4"
                >
                    <MdNextPlan />{" "}
                    <span className="hidden sm:inline-block">Next</span>
                </button>
            </div>
        </section>
    );
}
