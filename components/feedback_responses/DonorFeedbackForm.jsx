"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { feedbackResponseSchema } from "@lib/zod/feedbackResponseSchema";
import { createFeedbackResponse } from "@action/feedbackResponseAction";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@components/ui/form";
import { Button } from "@components/ui/button";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import FormLogger from "@lib/utils/FormLogger";
import { MessageSquareQuote, X } from "lucide-react";
import Link from "next/link";

export default function DonorFeedbackForm({ questions, appointmentId }) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(feedbackResponseSchema),
        defaultValues: {
            donor_appointment_id: appointmentId,
            responses: questions.map((q) => ({
                feedback_question_id: q.id,
                rating: 0,
            })),
        },
    });

    const { fields } = useFieldArray({
        control: form.control,
        name: "responses",
    });

    const { mutate, isPending } = useMutation({
        mutationFn: createFeedbackResponse,
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({
                    queryKey: ["donor-appointments"],
                });
                setTimeout(() => {
                    router.push(`/portal/donors/appointments`);
                }, 1500);
            } else {
                toast.error(response.message);
            }
        },
        onError: (error) => {
            toast.error(error.message || "An unexpected error occurred.");
        },
    });

    const onSubmit = (data) => {
        const formattedData = {
            ...data,
            responses: data.responses.map((r) => ({
                ...r,
                rating: Number(r.rating),
            })),
        };
        mutate(formattedData);
    };

    return (
        <Form {...form}>
            <Toaster />
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {fields.map((field, index) => (
                    <FormField
                        key={field.id}
                        control={form.control}
                        name={`responses.${index}.rating`}
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="text-xl">
                                    {index + 1}.{" "}
                                    {questions[index].question_text}
                                </FormLabel>
                                <FormControl className="py-5">
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex space-x-4"
                                    >
                                        {[1, 2, 3, 4, 5].map((value) => (
                                            <FormItem
                                                key={value}
                                                className="flex items-center space-x-2 space-y-0"
                                            >
                                                <FormControl>
                                                    <RadioGroupItem
                                                        value={value}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {value}
                                                </FormLabel>
                                            </FormItem>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}
                <div className="flex md:justify-end gap-2">
                    <Link href={`/portal/donors/appointments`}>
                        <Button variant="outline" className="btn">
                            <X />
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        className="btn"
                        type="submit"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>Submitting..."</>
                        ) : (
                            <>
                                <MessageSquareQuote className="w-4 h-4" />{" "}
                                Submit Feedback
                            </>
                        )}
                    </Button>
                </div>
            </form>
            {/* <FormLogger watch={form.watch} errors={form.formState.errors} /> */}
        </Form>
    );
}
