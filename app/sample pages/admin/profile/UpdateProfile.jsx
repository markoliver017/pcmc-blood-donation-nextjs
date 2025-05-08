"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { Input } from "@components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@components/ui/form";
import Link from "next/link";
import notify from "@components/ui/notify";
import { updateAdmin } from "./action";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const formSchema = z.object({
    first_name: z.string().min(2, {
        message: "First name must be at least 2 characters.",
    }),
    last_name: z.string().min(2, {
        message: "Last name must be at least 2 characters.",
    }),
    gender: z
        .string({
            required_error: "Please select a gender to display.",
            invalid_type_error: "Please select a gender to display.",
        })
        .min(1, {
            message: "Please select a gender to display.",
        }),
    profile_picture: z
        .any()
        .optional()
        .refine((file) => !file || file.size <= 1024 * 1024 * 2, {
            message: "File size should be less than 2MB",
        })
        .refine(
            (file) => !file || ["image/jpeg", "image/png"].includes(file.type),
            {
                message: "Only JPEG and PNG files are supported",
            }
        ),
});

export default function UpdateProfile({
    admin,
    onClose = () => console.log("closing .."),
    onSave = () => console.log("updating .."),
}) {
    // useEffect(() => {
    //     console.log("Admin>>>>>>>>>>>>>>>>>>>>", admin);
    // }, [admin]);

    const [state, setState] = useState({
        isSubmitting: false,
        error: null,
        success: false,
        avatarUrl: admin?.File?.url || "/default_avatar.png",
    });

    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: admin.first_name,
            last_name: admin.last_name,
            gender: admin.gender,
            profile_picture: null,
            // email: admin.email,
        },
    });
    // console.log(form.watch())

    const onSubmit = async (data) => {
        setState({ isSubmitting: true, error: null, success: false });
        const formData = new FormData();
        formData.append("id", admin.id);
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null) {
                formData.append(key, value);
            }
        });
        const result = await updateAdmin(formData);
        setState(result);
        if (result.success) {
            notify(
                {
                    error: result.success,
                    message: "Admin profile updated successfully!",
                },
                "success"
            );
            form.resetField("profile_picture");
            onSave();
            onClose();
        } else if (result.details?.length) {
            notify(
                {
                    error: result.success,
                    message: result.details.join(", "),
                },
                "error"
            );
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                    Make changes to your account here. Click save when you're
                    done.
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="flex flex-wrap gap-10">
                        <div className="w-full md:w-auto flex justify-center">
                            <Image
                                src={state.avatarUrl || "/default_avatar.png"}
                                className="rounded-4xl"
                                width={250}
                                height={250}
                                alt="Avatar"
                            />
                        </div>
                        <div className="flex-1 space-y-6">
                            <FormField
                                control={form.control}
                                name="first_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Your First Name"
                                                {...field}
                                            />
                                        </FormControl>
                                        {/* <FormDescription>
                                        This is your public display name.
                                    </FormDescription> */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="last_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Your Last Name"
                                                {...field}
                                            />
                                        </FormControl>
                                        {/* <FormDescription>
                                        This is your public display name.
                                    </FormDescription> */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gender: *</FormLabel>
                                        <FormControl>
                                            <select
                                                {...field}
                                                className="w-full border px-3 py-2 rounded-md text-sm dark:bg-slate-900"
                                            >
                                                <option value="">
                                                    Select...
                                                </option>
                                                <option value="male">
                                                    Male
                                                </option>
                                                <option value="female">
                                                    Female
                                                </option>
                                                <option value="unknown">
                                                    Unknown
                                                </option>
                                            </select>
                                        </FormControl>
                                        {/* <FormDescription>
                                        You can manage email addresses in your{" "}
                                        <Link href="/examples/forms">
                                            email settings
                                        </Link>
                                        .
                                    </FormDescription> */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="profile_picture"
                                render={({
                                    field: { onChange, value, ...field },
                                }) => (
                                    <FormItem className="hidden">
                                        <FormLabel>
                                            New Profile Picture
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                onChange={(e) =>
                                                    onChange(e.target.files[0])
                                                }
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button type="submit" disabled={state.isSubmitting}>
                            {state.isSubmitting
                                ? "Submitting..."
                                : "Save changes"}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
