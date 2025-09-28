"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@components/ui/form";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import { screeningQuestionnaireSchema } from "@lib/zod/screeningDetailSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertManyScreeningDetails } from "@action/screeningDetailAction";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Textarea } from "@components/ui/textarea";

import FormLogger from "@lib/utils/FormLogger";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { ArrowLeft, Save } from "lucide-react";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

const ScreeningQuestionnaireForm = ({
    questions,
    appointmentId,
    existingAnswers,
}) => {
    const router = useRouter();
    const session = useSession();
    const queryClient = useQueryClient();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const form = useForm({
        resolver: zodResolver(screeningQuestionnaireSchema),
        defaultValues: {
            answers: questions.map((q) => {
                const existing = existingAnswers.find(
                    (a) => a.question_id === q.id
                );
                return {
                    donor_appointment_info_id: appointmentId,
                    question_id: q.id,
                    response: existing?.response || "",
                    additional_info: existing?.additional_info || "",
                };
            }),
        },
    });

    const { fields } = useFieldArray({
        control: form.control,
        name: "answers",
    });

    const { mutate, isPending } = useMutation({
        mutationFn: ({ appointmentId, answers }) =>
            upsertManyScreeningDetails(appointmentId, answers),
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data.message);
                queryClient.invalidateQueries({
                    queryKey: ["existingAnswers", appointmentId],
                });

                if (session?.data?.user?.role_name === "Donor") {
                    router.push(`/portal/donors/appointments`);
                }
            } else {
                toast.error(data.message || data.error);
            }
        },
        onError: (error) => {
            toast.error(error.message || "An error occurred.");
        },
    });

    const onSubmit = () => {
        setIsModalOpen(true);
    };

    const handleConfirmSubmit = () => {
        const data = form.getValues();
        const answers = data.answers.map((a) => ({
            ...a,
            additional_info: a.response === "YES" ? a.additional_info : "",
        }));
        mutate({ appointmentId, answers });
    };

    return (
        <Card className="md:px-4 md:py-5 bg-gray-100">
            <CardHeader>
                <CardTitle className="md:text-xl font-bold flex-items-center">
                    <QuestionMarkCircledIcon /> Screening Questionnaires
                </CardTitle>
            </CardHeader>
            <CardContent className="">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <div className="space-y-6">
                            {fields.map((field, index) => {
                                const question = questions[index];
                                return (
                                    <FormField
                                        key={field.id}
                                        control={form.control}
                                        name={`answers.${index}.response`}
                                        render={({ field }) => (
                                            <FormItem className="space-y-3 rounded-md border p-4">
                                                <FormLabel className="text-base">
                                                    {index + 1}.{" "}
                                                    {question.question_text}
                                                </FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                        className="flex flex-col space-y-1 p-2"
                                                    >
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="YES" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Yes
                                                            </FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="NO" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                No
                                                            </FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="N/A" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Not Applicable
                                                            </FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                                {form.watch(
                                                    `answers.${index}.response`
                                                ) === "YES" && (
                                                    <FormField
                                                        control={form.control}
                                                        name={`answers.${index}.additional_info`}
                                                        render={({
                                                            field: nestedField,
                                                        }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Please
                                                                    provide
                                                                    details{" "}
                                                                    <i className="text-xs text-gray-500">
                                                                        (optional)
                                                                    </i>
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Textarea
                                                                        placeholder="Please provide additional information..."
                                                                        {...nestedField}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                )}
                                            </FormItem>
                                        )}
                                    />
                                );
                            })}
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            {session?.data?.user?.role_name === "Donor" && (
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() =>
                                        router.back() ||
                                        router.push(
                                            `/portal/donors/appointments`
                                        )
                                    }
                                    disabled={isPending}
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back
                                </Button>
                            )}
                            <AlertDialog
                                open={isModalOpen}
                                onOpenChange={setIsModalOpen}
                            >
                                <AlertDialogTrigger asChild>
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            form.handleSubmit(onSubmit)()
                                        }
                                        className="border hover:bg-blue-500 hover:text-primary-foreground"
                                        disabled={
                                            isPending || !form.formState.isValid
                                        }
                                    >
                                        <Save className="h-4 w-4" />
                                        {existingAnswers.length > 0
                                            ? "Update "
                                            : "Submit "}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Confirm Your Answers
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Please review your answers before
                                            submitting. This action cannot be
                                            undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="max-h-60 overflow-y-auto p-2 border rounded-md">
                                        <ul className="space-y-2">
                                            {form
                                                .getValues()
                                                .answers.map(
                                                    (answer, index) => (
                                                        <li
                                                            key={index}
                                                            className="text-sm"
                                                        >
                                                            <strong>
                                                                {index + 1}.{" "}
                                                                {
                                                                    questions[
                                                                        index
                                                                    ]
                                                                        .question_text
                                                                }
                                                            </strong>
                                                            : {answer.response}
                                                            {answer.response ===
                                                                "YES" &&
                                                                answer.additional_info && (
                                                                    <p className="pl-4 text-xs text-gray-500">
                                                                        Details:{" "}
                                                                        {
                                                                            answer.additional_info
                                                                        }
                                                                    </p>
                                                                )}
                                                        </li>
                                                    )
                                                )}
                                        </ul>
                                    </div>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Go Back & Edit
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleConfirmSubmit}
                                            disabled={isPending}
                                        >
                                            {isPending
                                                ? "Submitting..."
                                                : "Confirm & Submit"}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </form>
                </Form>
                {/* <FormLogger watch={form.watch} errors={form.formState.errors} /> */}
            </CardContent>
        </Card>
    );
};

export default ScreeningQuestionnaireForm;
