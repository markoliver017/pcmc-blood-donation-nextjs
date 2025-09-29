"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFeedbackQuestionSchema } from "@lib/zod/feedbackQuestionSchema";
import { createFeedbackQuestion } from "@action/feedbackQuestionAction";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@components/ui/form";
import { Textarea } from "@components/ui/textarea";
import { Button } from "@components/ui/button";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export default function CreateFeedbackQuestionForm({ onOpenChange }) {
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(createFeedbackQuestionSchema),
        defaultValues: {
            question_text: "",
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: createFeedbackQuestion,
        onSuccess: (response) => {
            if (response.success) {
                queryClient.invalidateQueries({
                    queryKey: ["feedback_questions"],
                });
                toast.success(response.message);
                form.reset();
                if (onOpenChange) onOpenChange(false);
            } else {
                toast.error(response.message);
            }
        },
        onError: (error) => {
            toast.error(error.message || "An unexpected error occurred.");
        },
    });

    const onSubmit = (data) => {
        mutate(data);
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
                                <Textarea
                                    placeholder="Enter the feedback question..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end">
                    <Button
                        variant="outline"
                        type="submit"
                        disabled={isPending}
                    >
                        <Plus />
                        {isPending ? "Creating..." : "Create Question"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
