"use client";

import { useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { createFaqSchema } from "@lib/zod/faqSchema";
import FieldError from "@components/form/FieldError";
import notify from "@components/ui/notify";
import LoadingModal from "@components/layout/LoadingModal";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { getSingleStyle } from "@/styles/select-styles";
import { storeFaq } from "@action/faqAction";
import { toastCatchError } from "@lib/utils/toastError.utils";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@components/ui/card";
import Tiptap from "@components/reusable_components/Tiptap";
import { Plus } from "lucide-react";
import { Switch } from "@components/ui/switch";
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

export default function CreateFaqForm({ onSuccess }) {
    const { resolvedTheme } = useTheme();
    const queryClient = useQueryClient();
    const tiptapRef = useRef(null);

    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(createFaqSchema),
        defaultValues: {
            question: "",
            answer: "",
            category: "general",
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
        formState: { errors, isDirty },
    } = form;

    const keywords = watch("keywords");

    // Mutation for create
    const { mutate, isPending } = useMutation({
        mutationFn: async (formData) => {
            const res = await storeFaq(formData);
            if (!res.success) {
                throw res;
            }
            return res;
        },
        onSuccess: (data) => {
            notify({
                error: false,
                message: data.message || "FAQ created successfully!",
            });
            queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
            form.reset();
            if (tiptapRef.current) {
                tiptapRef.current.clearContent();
            }
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

    return (
        <>
            {isPending && <LoadingModal />}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Create New FAQ
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
                                            Category{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
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
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Keywords (Optional)
                                        </FormLabel>
                                        <CreatableSelectNoSSR
                                            isMulti
                                            value={keywords?.map((k) => ({
                                                value: k,
                                                label: k,
                                            }))}
                                            onChange={(selected) => {
                                                const values = selected
                                                    ? selected.map(
                                                          (s) => s.value
                                                      )
                                                    : [];
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
                        </CardContent>

                        <CardFooter className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    form.reset();
                                    if (tiptapRef.current) {
                                        tiptapRef.current.clearContent();
                                    }
                                }}
                                disabled={isPending || !isDirty}
                            >
                                Reset
                            </Button>
                            <Button
                                variant="outline"
                                type="submit"
                                disabled={isPending}
                                className="text-green-300"
                            >
                                <Plus className="h-4 w-4" />
                                {isPending ? "Creating..." : "Create FAQ"}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </>
    );
}
