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
import { changePassword } from "./action";
import { useEffect, useState } from "react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import SweetAlert from "@components/ui/SweetAlert";

const formSchema = z
    .object({
        password: z.string().min(8, {
            message: "Password must be at least 8 characters.",
        }),
        passwordConfirmation: z.string(),
        email: z
            .string()
            .email({
                message: "Invalid email format",
            })
            .min(6, {
                message: "Email must be at least 6 characters.",
            }),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: "Passwords do not match.",
        path: ["passwordConfirmation"],
    });

export default function Password({
    admin,
    onClose = () => console.log("closing .."),
    onSave = () => console.log("updating .."),
}) {
    const session = useSession();
    const isCurrentUser = admin?.id == session?.data?.user?.id || false;
    // useEffect(() => {
    //     console.log("Admin>>>>>>>>>>>>>>>>>>>>", admin.id);
    //     console.log("session>>>>>>>>>>>>>>>>>>>>", session.data.user.id);
    //     console.log("isCurrentUser>>>>>>>>>>>>>>>>>>>>", isCurrentUser);
    // }, [admin]);

    const [state, setState] = useState({
        isSubmitting: false,
        error: null,
        success: false,
    });

    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            passwordConfirmation: "",
            email: admin.email,
        },
    });

    const onSubmit = async (data) => {
        if (isCurrentUser) {
            SweetAlert({
                title: "Continue?",
                text: "After saving, you'll be logged out?",
                icon: "question",
                showCancelButton: true,
                cancelButtonText: "Cancel",
                onConfirm: async () => {
                    setState({
                        isSubmitting: true,
                        error: null,
                        success: false,
                    });

                    const formData = new FormData();
                    formData.append("id", admin.id);

                    Object.entries(data).forEach(([key, value]) => {
                        if (value !== null) {
                            formData.append(key, value);
                        }
                    });

                    const result = await changePassword(formData);
                    setState(result);
                    if (result.success) {
                        notify(
                            {
                                error: result.success,
                                message:
                                    "Admin credentials updated successfully!",
                            },
                            "success"
                        );
                        onSave();
                        onClose();
                        signOut({ callbackUrl: "/" });
                    } else if (result.details?.length) {
                        notify(
                            {
                                error: result.success,
                                message: result.details.join(", "),
                            },
                            "error"
                        );
                    }
                },
            });
        } else {
            SweetAlert({
                title: "Continue?",
                text: "Are you sure you want to update the user credentials?",
                icon: "question",
                showCancelButton: true,
                cancelButtonText: "Cancel",
                onConfirm: async () => {
                    setState({
                        isSubmitting: true,
                        error: null,
                        success: false,
                    });

                    const formData = new FormData();
                    formData.append("id", admin.id);

                    Object.entries(data).forEach(([key, value]) => {
                        if (value !== null) {
                            formData.append(key, value);
                        }
                    });

                    const result = await changePassword(formData);
                    setState(result);
                    if (result.success) {
                        notify(
                            {
                                error: result.success,
                                message:
                                    "Admin credentials updated successfully!",
                            },
                            "success"
                        );
                        onSave();
                        onClose();
                        // if (isCurrentUser) {
                        //     signOut({ callbackUrl: "/" });
                        // }
                    } else if (result.details?.length) {
                        notify(
                            {
                                error: result.success,
                                message: result.details.join(", "),
                            },
                            "error"
                        );
                    }
                },
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                    Change your password here. After saving, you'll be logged
                    out.
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form id="form-modal" onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-2">
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
                                            placeholder="New Password"
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
                                    <FormLabel>Confirm Password *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Cofirm your new password"
                                            {...field}
                                        />
                                    </FormControl>

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
