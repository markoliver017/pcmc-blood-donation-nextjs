"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@components/ui/select";
import { Label } from "@components/ui/label";
import { Checkbox } from "@components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@components/ui/form";

import { ScreeningQuestionSchema } from "@lib/zod/screeningQuestionSchema";
import { createScreeningQuestion } from "@action/screeningQuestionAction";
import { toast } from "react-toastify";

export default function AddQuestionModal({ onClose, onSuccess }) {
    const form = useForm({
        resolver: zodResolver(ScreeningQuestionSchema),
        defaultValues: {
            question_text: "",
            question_type: "GENERAL",
            expected_response: "N/A",
            is_active: true,
        },
    });

    const createMutation = useMutation({
        mutationFn: createScreeningQuestion,
        onSuccess: (result) => {
            if (result.success) {
                toast.success(result.message);
                onSuccess();
            } else {
                toast.error(result.error);
            }
        },
        onError: (error) => {
            toast.error("Failed to create question");
        },
    });

    const onSubmit = (data) => {
        createMutation.mutate(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="question_text"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Question</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter screening question..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="question_type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Question Type</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {[
                                        "GENERAL",
                                        "MEDICAL",
                                        "TRAVEL",
                                        "LIFESTYLE",
                                    ].map((opt) => (
                                        <SelectItem key={opt} value={opt}>
                                            {opt}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="expected_response"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Expected Response</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select expected response" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {["YES", "NO", "N/A"].map((opt) => (
                                        <SelectItem key={opt} value={opt}>
                                            {opt}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Active</FormLabel>
                            </div>
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={createMutation.isLoading}>
                        {createMutation.isLoading
                            ? "Creating..."
                            : "Create Question"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
