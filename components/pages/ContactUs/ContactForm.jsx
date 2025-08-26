"use client";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { contactFormSchema } from "@lib/zod/contactFormSchema";
import { storeContactForm } from "@/action/contactFormAction";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";
import { Button } from "@components/ui/button";
// import { DisplayValidationErrors, FieldError } from "@components/form";

import {
    Send,
    CheckCircle,
    AlertCircle,
    User,
    Mail,
    Phone,
    MessageSquare,
} from "lucide-react";
import LoadingModal from "@components/layout/LoadingModal";
import notify from "@components/ui/notify";
import DisplayValidationErrors from "@components/form/DisplayValidationErrors";
import FieldError from "@components/form/FieldError";
import SweetAlert from "@components/ui/SweetAlert";
import { useState } from "react";

export default function ContactForm() {
    const [submissionDetails, setSubmissionDetails] = useState(null);

    const form = useForm({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: async (data) => {
            const response = await storeContactForm(data);
            if (!response.success) throw response;
            return response;
        },
        onSuccess: (response) => {
            console.log("response", response);
            SweetAlert({
                title: "Message Sent Successfully! 🎉",
                text:
                    response.message ||
                    "Your message has been sent successfully! We'll get back to you within 24-48 hours.",
                icon: "success",
                confirmButtonText: "View Details",
                confirmButtonColor: "#10b981",
                showCancelButton: true,
                cancelButtonText: "Close",
                showClass: {
                    popup: "animate__animated animate__fadeInDown",
                },
                hideClass: {
                    popup: "animate__animated animate__fadeOutUp",
                },
                onConfirm: () => {
                    setSubmissionDetails({
                        timestamp: new Date().toLocaleString(),
                        referenceId: response.data?.contact_form_reference_id,
                        subject: form.getValues("subject"),
                        name: form.getValues("name"),
                        email: form.getValues("email"),
                    });
                },
                onCancel: () => {
                    form.reset();
                    setSubmissionDetails(null);
                },
            });
        },
        onError: (error) => {
            if (error?.type === "validation" && error?.errorArr?.length) {
                // Handle validation errors with detailed feedback
                const errorMessages = error.errorArr
                    .map((err, index) => `${index + 1}. ${err}`)
                    .join("\n");

                SweetAlert({
                    title: "Please Check Your Input",
                    text: `Please correct the following errors:\n\n${errorMessages}`,
                    icon: "warning",
                    confirmButtonText: "I'll Fix These",
                    confirmButtonColor: "#f59e0b",
                    showClass: {
                        popup: "animate__animated animate__shakeX",
                    },
                });
            } else {
                // Handle other errors with more specific messages
                let errorMessage =
                    "We're sorry, but we couldn't send your message at this time.";
                let errorTitle = "Something Went Wrong";

                if (error?.message) {
                    if (
                        error.message.includes("network") ||
                        error.message.includes("fetch")
                    ) {
                        errorTitle = "Connection Error";
                        errorMessage =
                            "Please check your internet connection and try again. If the problem persists, you can call us directly.";
                    } else if (error.message.includes("timeout")) {
                        errorTitle = "Request Timeout";
                        errorMessage =
                            "The request took too long to process. Please try again in a few moments.";
                    } else if (error.message.includes("server")) {
                        errorTitle = "Server Error";
                        errorMessage =
                            "Our servers are experiencing issues. Please try again later or contact us by phone.";
                    } else {
                        errorMessage = error.message;
                    }
                }

                SweetAlert({
                    title: errorTitle,
                    text: errorMessage,
                    icon: "error",
                    confirmButtonText: "Try Again",
                    confirmButtonColor: "#ef4444",
                    showCancelButton: true,
                    cancelButtonText: "Call Us Instead",
                    cancelButtonColor: "#6b7280",
                    showClass: {
                        popup: "animate__animated animate__fadeInDown",
                    },
                    onConfirm: () => {
                        // User chooses to try again - form is still available
                    },
                    onCancel: () => {
                        // Redirect to phone number
                        window.location.href = "tel:+639284795154";
                    },
                });
            }
        },
    });

    const subjects = [
        "General Inquiry",
        "Blood Donation Appointment",
        "Blood Drive Organization",
        "Emergency Blood Request",
        "Volunteer Opportunities",
        "Partnership Inquiry",
        "Technical Support",
        "Other",
    ];

    return (
        <section id="contact-form" className="py-16 bg-white dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Send Us a Message
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Have a question or need assistance? Fill out the form
                        below and we'll get back to you as soon as possible.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-xl border border-blue-200 dark:border-gray-600 p-8"
                >
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(mutate)}
                            className="space-y-6"
                        >
                            {/* Name and Email Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                Full Name *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Enter your full name"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FieldError
                                                field={
                                                    form.formState.errors.name
                                                }
                                            />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                Email Address *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    placeholder="Enter your email address"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FieldError
                                                field={
                                                    form.formState.errors.email
                                                }
                                            />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Phone and Subject Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                Phone Number
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="tel"
                                                    placeholder="Enter your phone number"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FieldError
                                                field={
                                                    form.formState.errors.phone
                                                }
                                            />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="subject"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Subject *</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a subject" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {subjects.map(
                                                        (subject, index) => (
                                                            <SelectItem
                                                                key={index}
                                                                value={subject}
                                                            >
                                                                {subject}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FieldError
                                                field={
                                                    form.formState.errors
                                                        .subject
                                                }
                                            />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Message */}
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4" />
                                            Message *
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                rows={6}
                                                placeholder="Please provide details about your inquiry..."
                                                className="w-full resize-none"
                                            />
                                        </FormControl>
                                        <FieldError
                                            field={
                                                form.formState.errors.message
                                            }
                                        />
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <div className="flex items-center justify-between pt-4">
                                <div className="flex flex-col">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        * Required fields
                                    </p>
                                    {isPending && (
                                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                                            📤 Sending your message... Please
                                            wait
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={
                                        !form.formState.isDirty || isPending
                                    }
                                    className="btn btn-primary btn-lg px-8 py-3 text-lg font-semibold flex items-center"
                                >
                                    {isPending ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Sending Message...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 mr-2" />
                                            Send Message
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Display all validation errors */}
                            <DisplayValidationErrors
                                errors={form.formState.errors}
                            />
                        </form>
                    </Form>
                </motion.div>

                {/* Additional Contact Options */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-4">
                            Prefer a Different Method?
                        </h3>
                        <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
                            If you prefer to contact us directly, you can call
                            us or visit our office during business hours.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="tel:+639284795154"
                                className="btn btn-white btn-lg px-8 py-3 text-lg font-semibold text-teal-600 hover:bg-gray-100"
                            >
                                Call Us Now
                            </a>
                            <a
                                href="#contact-info"
                                className="btn btn-outline btn-lg px-8 py-3 text-lg font-semibold border-white text-white hover:bg-white hover:text-teal-600"
                            >
                                View Contact Info
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Detailed Submission Confirmation */}
            {submissionDetails && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => {
                        setSubmissionDetails(null);
                        form.reset();
                    }}
                >
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                Message Sent Successfully!
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Thank you for contacting us. Here are your
                                submission details:
                            </p>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    Reference ID:
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                                    #{submissionDetails.referenceId || "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    Subject:
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {submissionDetails.subject}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    Submitted:
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {submissionDetails.timestamp}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    From:
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {submissionDetails.name}
                                </span>
                            </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                What happens next?
                            </h4>
                            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                <li>
                                    • We'll review your message within 24 hours
                                </li>
                                <li>
                                    • You'll receive a response via email within
                                    48 hours
                                </li>
                                <li>
                                    • For urgent matters, please call us
                                    directly
                                </li>
                                <li>
                                    • Keep this reference ID for follow-up
                                    inquiries
                                </li>
                            </ul>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={() => {
                                    setSubmissionDetails(null);
                                    form.reset();
                                }}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            >
                                Close
                            </Button>
                            <Button
                                onClick={() => {
                                    setSubmissionDetails(null);
                                    form.reset();
                                    // Scroll to contact info section
                                    document
                                        .getElementById("contact-info")
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                        });
                                }}
                                variant="outline"
                                className="flex-1"
                            >
                                View Contact Info
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            <LoadingModal isLoading={isPending} />
        </section>
    );
}
