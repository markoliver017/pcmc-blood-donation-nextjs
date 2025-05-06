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
import { useState } from "react";
import { createAdmin } from "./action";

const formSchema = z
    .object({
        first_name: z.string().min(2, {
            message: "First name must be at least 2 characters.",
        }),
        last_name: z.string().min(2, {
            message: "Last name must be at least 2 characters.",
        }),
        email: z
            .string()
            .email({
                message: "Invalid email format",
            })
            .min(6, {
                message: "Email must be at least 6 characters.",
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
                (file) =>
                    !file || ["image/jpeg", "image/png"].includes(file.type),
                {
                    message: "Only JPEG and PNG files are supported",
                }
            ),
        password: z.string().min(8, {
            message: "Password must be at least 8 characters.",
        }),
        passwordConfirmation: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: "Passwords do not match.",
        path: ["passwordConfirmation"],
    });

export default function CreateForm({ onSave, closeModal }) {
    const [state, setState] = useState({
        isSubmitting: false,
        error: null,
        success: false,
    });

    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(formSchema),
        first_name: "",
        last_name: "",
        email: "",
        gender: "",
        profile_picture: null,
        password: "",
        passwordConfirmation: "",
    });

    const onSubmit = async (data) => {
        setState({ isSubmitting: true, error: null, success: false });
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === "profile_picture" && value) {
                formData.append(key, value);
            } else if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });
        const result = await createAdmin(formData);
        console.log("result", result);
        setState(result);

        if (result.success) {
            notify(
                { error: false, message: "Admin created successfully!" },
                "success"
            );
            onSave();
            closeModal();
        } else if (result.details?.length) {
            notify(
                { error: true, message: result.details.join(", ") },
                "error"
            );
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                    Create new account here. Click save when you're done.
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-5">
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
                                            <option value="">Select...</option>
                                            <option value="male">Male</option>
                                            <option value="female">
                                                Female
                                            </option>
                                            <option value="unknown">
                                                Unknown
                                            </option>
                                        </select>
                                    </FormControl>

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
                                        Profile Photo{" "}
                                        <sup>
                                            <i>(optional)</i>
                                        </sup>
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

                        <FormLabel className="font-semibold block pt-5">
                            System Credentials{" "}
                        </FormLabel>

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Your Email"
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
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Your Password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="passwordConfirmation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password: *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Confirm password"
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
