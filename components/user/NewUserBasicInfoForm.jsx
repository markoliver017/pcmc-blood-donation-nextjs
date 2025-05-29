"use client";
import React, { useEffect, useRef } from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";

import { Mail, Text } from "lucide-react";
import notify from "@components/ui/notify";
import InlineLabel from "@components/form/InlineLabel";
// import { useTheme } from "next-themes";
import FieldError from "@components/form/FieldError";
import clsx from "clsx";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";


import CustomAvatar from "@components/reusable_components/CustomAvatar";

// import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { BiMaleFemale } from "react-icons/bi";
import { MdNextPlan, MdPassword } from "react-icons/md";
import { useRouter } from "next/navigation";
import { GiCancel } from "react-icons/gi";
import { useFormContext } from "react-hook-form";
import Preloader3 from "@components/layout/Preloader3";

export default function NewUserBasicInfoForm({ details, onNext }) {

    const router = useRouter();
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
            "profile_picture",
            "role_ids",
            "email",
            "first_name",
            "last_name",
            "gender",
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

    // const form = useForm({
    //     mode: "onChange",
    //     resolver: zodResolver(userSchema),
    //     defaultValues: {
    //         profile_picture: null, // or some default value
    //         role_ids: [user_role?.id],
    //         email: "mark@email.com",
    //         first_name: "Mark",
    //         last_name: "Roman",
    //         gender: "male",
    //         isChangePassword: true,
    //         password: "User@1234",
    //         password_confirmation: "User@1234",
    //     },
    // });

    // const {
    //     watch,
    //     control,
    //     handleSubmit,
    //     setValue,
    //     reset,
    //     resetField,
    //     formState: { errors, isDirty },
    // } = form;

    // const email = watch("email");
    // const password = watch("password");

    // const queryClient = useQueryClient();
    // const { data, mutate, error, isError, isPending } = useMutation({
    //     mutationFn: async (formData) => {
    //         const res = await createUser(formData);
    //         if (!res.success) {
    //             throw res; // Throw the error response to trigger onError
    //         }
    //         return res.data;
    //     },
    //     onSuccess: () => {
    //         /** note: the return data will be accessible in the debugger
    //          *so no need to console the onSuccess(data) here **/
    //         // Invalidate the posts query to refetch the updated list
    //         queryClient.invalidateQueries({ queryKey: ["users"] });
    //         SweetAlert({
    //             title: "New Account",
    //             text: `You've successfully created a new ${role.role_name} account`,
    //             icon: "success",
    //             showCancelButton: true,
    //             cancelButtonText: "Cancel",
    //             confirmButtonText: "Proceed to next step",
    //             element_id: "user_form",
    //             onCancel: () => router.push("/"),
    //             onConfirm: async () => {
    //                 const res = await signIn("credentials", {
    //                     email,
    //                     password,
    //                     redirect: false,
    //                 });
    //                 if (res.ok) router.refresh();
    //                 reset();
    //             },
    //         });
    //     },
    //     onError: (error) => {
    //         // Handle validation errors
    //         if (error?.type === "validation" && error?.errorArr.length) {
    //             let detailContent = "";
    //             const { errorArr: details, message } = error;

    //             detailContent = (
    //                 <ul className="list-disc list-inside">
    //                     {details.map((err, index) => (
    //                         <li key={index}>{err}</li>
    //                     ))}
    //                 </ul>
    //             );
    //             notify({
    //                 error: true,
    //                 message: (
    //                     <div className="collapse">
    //                         <input type="checkbox" />
    //                         <div className="collapse-title font-semibold">
    //                             {message}
    //                             <br />
    //                             <small className="link link-warning">
    //                                 See details
    //                             </small>
    //                         </div>
    //                         <div className="collapse-content text-sm">
    //                             {detailContent}
    //                         </div>
    //                     </div>
    //                 ),
    //             });
    //         } else {
    //             // Handle server errors
    //             notify({
    //                 error: true,
    //                 message: error?.message,
    //             });
    //         }
    //     },
    // });

    // const onSubmit = async (data) => {
    //     SweetAlert({
    //         title: "Confirmation",
    //         text: "Please ensure you have noted your account credentials. Would you like to proceed?",
    //         icon: "question",
    //         showCancelButton: true,
    //         confirmButtonText: "Confirm",
    //         cancelButtonText: "Cancel",
    //         element_id: "user_form",
    //         onConfirm: async () => {
    //             const fileUrl = watch("image");
    //             if (data?.profile_picture && !fileUrl) {
    //                 const result = await uploadPicture(data.profile_picture);
    //                 if (result?.success) {
    //                     data.image = result.file_data?.url || null;
    //                     setValue("image", result.file_data?.url);
    //                 }
    //                 console.log("Upload result:", result);
    //             }

    //             mutate(data);
    //         },
    //     });
    // };

    const uploaded_avatar = watch("profile_picture");
    const avatar =
        !errors?.profile_picture && uploaded_avatar
            ? URL.createObjectURL(uploaded_avatar)
            : "/default_avatar.png";

    useEffect(() => {
        if (watch("image")) setValue("image", null);
    }, [uploaded_avatar]);


    return (
        <>
            <Preloader3 />
            <Card className="p-0 md:p-5 bg-slate-100">
                <CardHeader className="text-2xl font-bold">
                    <CardTitle className="text-2xl">
                        {details.title}
                    </CardTitle>
                    <CardDescription>
                        <div>Please fill up all the * required fields.</div>
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-5">

                    <FormField
                        control={control}
                        name="profile_picture"
                        render={({
                            field: { onChange, value, ...field },
                        }) => {
                            const fileInputRef = useRef(null);
                            const handleImageClick = () => {
                                if (fileInputRef.current) {
                                    fileInputRef.current.click(); // Trigger the file input click
                                }
                            };
                            return (
                                <FormItem className="flex-none text-center w-full md:w-max">
                                    <div className="hidden">
                                        <InlineLabel>
                                            New Profile Picture
                                        </InlineLabel>
                                        <FormControl ref={fileInputRef}>
                                            <Input
                                                type="file"
                                                tabIndex={-1}
                                                onChange={(e) =>
                                                    onChange(
                                                        e.target.files[0]
                                                    )
                                                }
                                                {...field}
                                            />
                                        </FormControl>
                                    </div>
                                    <CustomAvatar
                                        avatar={avatar}
                                        whenClick={handleImageClick}
                                        className="w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] lg:w-[350px] lg:h-[350px]"
                                    />
                                    {uploaded_avatar ? (
                                        <button
                                            onClick={() =>
                                                resetField(
                                                    "profile_picture"
                                                )
                                            }
                                            className="btn btn-ghost"
                                        >
                                            Clear
                                        </button>
                                    ) : (
                                        <label className="text-center font-semibold italic text-slate-500">
                                            Profile Picture
                                        </label>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

                    <div className="flex-1 md:min-w-[350px] flex flex-col justify-evenly ">
                        <FormField
                            control={control}
                            name="role_ids"
                            render={({ field }) => (
                                <FormItem className="hidden">
                                    <InlineLabel>Role: *</InlineLabel>

                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.role_ids
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <Text className="h-3" />
                                        <input
                                            type="text"
                                            tabIndex={-1}
                                            placeholder="Your Role ID"
                                            {...field}
                                        />
                                    </label>
                                    <FieldError field={errors?.role_ids} />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="first_name"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>First Name: *</InlineLabel>

                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.first_name
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <Text className="h-3" />
                                        <input
                                            type="text"
                                            tabIndex={2}
                                            placeholder="Enter user first name"
                                            {...field}
                                        />
                                    </label>
                                    <FieldError
                                        field={errors?.first_name}
                                    />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="last_name"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>Last Name: *</InlineLabel>

                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.last_name
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <Text className="h-3" />
                                        <input
                                            type="text"
                                            tabIndex={3}
                                            placeholder="Enter user last name"
                                            {...field}
                                        />
                                    </label>
                                    <FieldError field={errors?.last_name} />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <InlineLabel>Sex: *</InlineLabel>

                                    <label
                                        className={clsx(
                                            "input w-full mt-1",
                                            errors?.gender
                                                ? "input-error"
                                                : "input-info"
                                        )}
                                    >
                                        <BiMaleFemale className="h-3" />
                                        <select
                                            className="w-full dark:bg-inherit"
                                            tabIndex={4}
                                            {...field}
                                        >
                                            <option value="">
                                                Select here
                                            </option>
                                            <option value="male">
                                                Male
                                            </option>
                                            <option value="female">
                                                Female
                                            </option>
                                        </select>
                                    </label>
                                    <FieldError field={errors?.gender} />
                                </FormItem>
                            )}
                        />


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

                    </div>


                </CardContent>
            </Card>
        </>
    );
}
