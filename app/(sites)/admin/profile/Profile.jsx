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
import { createAdmin } from "./action";
import { useState } from "react";

const formSchema = z.object({
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
        .refine((file) => !file || file.size <= 1024 * 1024 * 5, {
            message: "File size should be less than 5MB",
        })
        .refine(
            (file) => !file || ["image/jpeg", "image/png"].includes(file.type),
            {
                message: "Only JPEG and PNG files are supported",
            }
        ),
});

export default function Profile() {
    const [state, setState] = useState({
        isSubmitting: false,
        error: null,
        success: false,
    });

    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            gender: "",
            email: "",
            profile_picture: null,
        },
    });

    const onSubmit = async (data) => {
        setState({ isSubmitting: true, error: null, success: false });
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null) {
                formData.append(key, value);
            }
        });
        const result = await createAdmin(formData);

        setState(result);
        if (result.success) {
            notify("Admin created successfully!", "success");
        } else if (result.details?.length) {
            notify(result.details.join(", "), "error");
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
                    <CardContent className="space-y-8">
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
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a gender to display" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="male">
                                                Male
                                            </SelectItem>
                                            <SelectItem value="female">
                                                Female
                                            </SelectItem>
                                            <SelectItem value="unknown">
                                                Unknown
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
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
                            name="profile_picture"
                            render={({
                                field: { onChange, value, ...field },
                            }) => (
                                <FormItem>
                                    <FormLabel>Profile Picture</FormLabel>
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
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={state.isSubmitting}>
                            {state.isSubmitting
                                ? "Submitting..."
                                : "Save changes"}
                        </Button>
                        {state.error && (
                            <p style={{ color: "red" }}>{state.error}</p>
                        )}
                        {state.success && (
                            <p style={{ color: "green" }}>
                                Form submitted successfully!
                            </p>
                        )}
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
