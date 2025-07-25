"use client";

import React, { useEffect } from "react";
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
import { updateScreeningQuestion } from "@action/screeningQuestionAction";
import { toast } from "react-toastify";
import FormLogger from "@lib/utils/FormLogger";

export default function EditQuestionModal({ question, onClose, onSuccess }) {
    const [questionType, setQuestionType] = React.useState(
        question?.question_type
    );
    const [expectedResponse, setExpectedResponse] = React.useState(
        question?.expected_response
    );
    const form = useForm({
        resolver: zodResolver(ScreeningQuestionSchema),
        defaultValues: {
            question_text: "",
            question_type: questionType,
            expected_response: "",
            is_active: true,
        },
    });

    // Prefill form with existing question data
    useEffect(() => {
        if (question) {
            form.reset({
                question_text: question.question_text,
                question_type: question.question_type,
                expected_response: question.expected_response || "",
                is_active: question.is_active,
            });
            setQuestionType(question.question_type);
            setExpectedResponse(question.expected_response);
        }
    }, [question, form]);

    const updateMutation = useMutation({
        mutationFn: (data) => updateScreeningQuestion(question.id, data),
        onSuccess: (result) => {
            if (result.success) {
                toast.success(result.message);
                onSuccess();
            } else {
                toast.error(result.error);
            }
        },
        onError: (error) => {
            toast.error("Failed to update question");
        },
    });

    const onSubmit = (data) => {
        updateMutation.mutate(data);
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
                    render={({ field }) => {
                        console.log("question_type field value", field.value);
                        return (
                            <FormItem>
                                <FormLabel>Question Type</FormLabel>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        setQuestionType(value);
                                    }}
                                    value={questionType}
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
                        );
                    }}
                />

                <FormField
                    control={form.control}
                    name="expected_response"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel>Expected Response</FormLabel>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        setExpectedResponse(value);
                                    }}
                                    value={expectedResponse}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
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
                        );
                    }}
                />

                {/* <FormField
                    control={form.control}
                    name="expected_response"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Expected Response</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Yes/No" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                /> */}

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
                    <Button type="submit" disabled={updateMutation.isLoading}>
                        {updateMutation.isLoading
                            ? "Updating..."
                            : "Update Question"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
