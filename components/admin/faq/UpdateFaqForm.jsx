"use client";

import { useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";
import { updateFaqSchema } from "@lib/zod/faqSchema";
import FieldError from "@components/form/FieldError";
import notify from "@components/ui/notify";
import LoadingModal from "@components/layout/LoadingModal";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { getSingleStyle } from "@/styles/select-styles";
import { fetchFaqById, updateFaq } from "@action/faqAction";
import { toastCatchError } from "@lib/utils/toastError.utils";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@components/ui/card";
import Tiptap from "@components/reusable_components/Tiptap";
import { Edit, Save } from "lucide-react";
import { Switch } from "@components/ui/switch";
import Skeleton_form from "@components/ui/Skeleton_form";
import InlineLabel from "@components/form/InlineLabel";
import clsx from "clsx";

// Disable SSR for CreatableSelect
const CreatableSelectNoSSR = dynamic(() => import("react-select/creatable"), {
    ssr: false,
});

const CATEGORY_OPTIONS = [
    { value: "general", label: "General" },
    { value: "donation_process", label: "Donation Process" },
    { value: "eligibility", label: "Eligibility" },
    { value: "health_safety", label: "Health & Safety" },
    { value: "appointments", label: "Appointments" },
    { value: "account", label: "Account" },
    { value: "blood_types", label: "Blood Types" },
    { value: "after_donation", label: "After Donation" },
];

export default function UpdateFaqForm({ faqId, onSuccess }) {
    const { resolvedTheme } = useTheme();
    const queryClient = useQueryClient();
    const tiptapRef = useRef(null);

    // Fetch FAQ data
    const { data: response, isLoading } = useQuery({
        queryKey: ["faq", faqId],
        queryFn: () => fetchFaqById(faqId),
        enabled: !!faqId,
    });

    const faqData = response?.success ? response.data : null;

    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(updateFaqSchema),
        defaultValues: {
            id: faqId,
            question: "",
            answer: "",
            category: faqData?.category || "general",
            keywords: [],
            display_order: 0,
            is_active: true,
        },
    });

    const {
        watch,
        handleSubmit,
        setValue,
        setError,
        control,
        reset,
        formState: { errors, isDirty },
    } = form;

    const keywords = watch("keywords");

    // Populate form when data is loaded
    useEffect(() => {
        if (faqData) {
            reset({
                id: faqData.id,
                question: faqData.question,
                answer: faqData.answer,
                category: faqData.category,
                keywords: faqData.keywords || [],
                display_order: faqData.display_order,
                is_active: faqData.is_active,
            });
        }
    }, [faqData, reset, isLoading]);

    // Mutation for update
    const { mutate, isPending } = useMutation({
        mutationFn: async (formData) => {
            const res = await updateFaq(faqId, formData);
            if (!res.success) {
                throw res;
            }
            return res;
        },
        onSuccess: (data) => {
            notify({
                error: false,
                message: data.message || "FAQ updated successfully!",
            });
            queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
            queryClient.invalidateQueries({ queryKey: ["faq", faqId] });
            if (onSuccess) onSuccess();
        },
        onError: (error) => {
            toastCatchError(error);
            if (error.type === "validation" && error.errorObj) {
                Object.entries(error.errorObj).forEach(([field, messages]) => {
                    setError(field, {
                        type: "manual",
                        message: Array.isArray(messages)
                            ? messages[0]
                            : messages,
                    });
                });
            }
        },
    });

    const onSubmit = (data) => {
        console.log("Form data:", data);
        mutate(data);
    };

    if (isLoading) {
        return <Skeleton_form />;
    }

    if (!faqData) {
        return (
            <Card>
                <CardContent className="py-8">
                    <p className="text-center text-muted-foreground">
                        FAQ not found or you don't have permission to edit it.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            {isPending && <LoadingModal />}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Edit className="w-5 h-5" />
                        Update FAQ
                    </CardTitle>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <CardContent className="space-y-4">
                            {/* Question */}
                            <FormField
                                control={control}
                                name="question"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Question{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FormLabel>
                                        <Input
                                            {...field}
                                            placeholder="Enter the FAQ question"
                                            maxLength={500}
                                        />
                                        <FormMessage />
                                        <FieldError error={errors.question} />
                                    </FormItem>
                                )}
                            />

                            {/* Answer */}
                            <FormField
                                control={control}
                                name="answer"
                                render={({ field: { value, onChange } }) => (
                                    <FormItem>
                                        <InlineLabel
                                            required={false}
                                            optional={true}
                                        >
                                            Answer:{" "}
                                        </InlineLabel>

                                        <span
                                            className={clsx(
                                                "w-full mt-1",
                                                errors?.answer
                                                    ? "input-error"
                                                    : "input-info"
                                            )}
                                        >
                                            <Tiptap
                                                content={value}
                                                onContentChange={onChange}
                                            />
                                        </span>
                                        <FieldError field={errors?.answer} />
                                    </FormItem>
                                )}
                            />

                            {/* Category */}
                            <FormField
                                control={control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Category : {field.value}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FormLabel>
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                            }}
                                            value={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CATEGORY_OPTIONS.map(
                                                    (option) => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.label}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                        <FieldError error={errors.category} />
                                    </FormItem>
                                )}
                            />

                            {/* Keywords */}
                            <FormField
                                control={control}
                                name="keywords"
                                render={({
                                    field: { onChange, name, ref },
                                }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Keywords (Optional)
                                        </FormLabel>
                                        <CreatableSelectNoSSR
                                            isMulti
                                            name={name}
                                            value={keywords?.map((k) => ({
                                                value: k,
                                                label: k,
                                            }))}
                                            ref={ref}
                                            onChange={(selected) => {
                                                const values = selected
                                                    ? selected.map(
                                                          (s) => s.value
                                                      )
                                                    : [];
                                                onChange(values);
                                                setValue("keywords", values, {
                                                    shouldValidate: true,
                                                });
                                            }}
                                            placeholder="Add keywords for search..."
                                            styles={getSingleStyle(
                                                resolvedTheme
                                            )}
                                            isClearable
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Press Enter to add keywords. Maximum
                                            10 keywords.
                                        </p>
                                        <FormMessage />
                                        <FieldError error={errors.keywords} />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Display Order */}
                                <FormField
                                    control={control}
                                    name="display_order"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Display Order</FormLabel>
                                            <Input
                                                {...field}
                                                type="number"
                                                min={0}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseInt(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Lower numbers appear first
                                            </p>
                                            <FormMessage />
                                            <FieldError
                                                error={errors.display_order}
                                            />
                                        </FormItem>
                                    )}
                                />

                                {/* Is Active */}
                                <FormField
                                    control={control}
                                    name="is_active"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col justify-between">
                                            <FormLabel>Active Status</FormLabel>
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                    className="dark:data-[state=checked]:bg-blue-500"
                                                />
                                                <span className="text-sm text-muted-foreground">
                                                    {field.value
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </div>
                                            <FormMessage />
                                            <FieldError
                                                error={errors.is_active}
                                            />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Metadata */}
                            {faqData.creator && (
                                <div className="pt-4 border-t">
                                    <p className="text-xs text-muted-foreground">
                                        Created by: {faqData.creator.name} on{" "}
                                        {new Date(
                                            faqData.createdAt
                                        ).toLocaleString()}
                                    </p>
                                    {faqData.updater && (
                                        <p className="text-xs text-muted-foreground">
                                            Last updated by:{" "}
                                            {faqData.updater.name} on{" "}
                                            {new Date(
                                                faqData.updatedAt
                                            ).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => reset()}
                                disabled={isPending || !isDirty}
                            >
                                Reset Changes
                            </Button>
                            <Button
                                variant="outline"
                                type="submit"
                                disabled={isPending || !isDirty}
                                className="text-blue-600"
                            >
                                <Save className="h-4 w-4" />
                                {isPending ? "Updating..." : "Update FAQ"}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </>
    );
}
