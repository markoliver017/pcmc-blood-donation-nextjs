"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { requestPasswordReset } from "@action/passwordResetAction";
import { toast } from "react-toastify";
import LoadingModal from "@components/layout/LoadingModal";

// Validation schema
const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const result = await requestPasswordReset(data);
            
            if (result.success) {
                setIsSuccess(true);
                reset();
                toast.success(result.message);
            } else {
                if (result.type === "validation") {
                    toast.error("Please check your input and try again.");
                } else {
                    toast.error(result.message || "An error occurred. Please try again.");
                }
            }
        } catch (error) {
            console.error("Password reset request error:", error);
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-red-100 dark:from-slate-900 dark:via-slate-950 dark:to-red-900 py-5 px-2 sm:px-4">
                {/* Background Image */}
                <Image
                    src="/blood-bg.jpg"
                    alt="Login Background"
                    fill
                    className="object-cover object-right opacity-40 z-0"
                    quality={100}
                    priority
                />
                
                {/* Overlay for readability */}
                <div
                    className="absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm z-10"
                    aria-hidden="true"
                />

                {/* Content */}
                <div className="relative z-20 w-full max-w-md mx-auto bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col items-center gap-6 border border-blue-100 dark:border-slate-800">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        
                        <Image
                            src="/pcmc_logo.png"
                            width={60}
                            height={60}
                            alt="PCMC Pediatric Blood Center Logo"
                            className="rounded-full border-2 border-blue-200 dark:border-sky-700 shadow bg-white"
                        />
                        
                        <h2 className="text-2xl font-bold text-red-700 dark:text-red-300">
                            Check Your Email
                        </h2>
                        
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                            We've sent a password reset link to your email address. 
                            Please check your inbox and follow the instructions to reset your password.
                        </p>
                        
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                <strong>Note:</strong> The reset link will expire in 1 hour for security reasons.
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 w-full">
                        <Link
                            href="/login"
                            className="btn btn-outline btn-primary w-full flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </Link>
                        
                        <button
                            onClick={() => setIsSuccess(false)}
                            className="btn btn-ghost w-full text-sm"
                        >
                            Didn't receive the email? Try again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <LoadingModal imgSrc="/email.gif" isLoading={isLoading}>Processing...</LoadingModal>
            <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-red-100 dark:from-slate-900 dark:via-slate-950 dark:to-red-900 py-5 px-2 sm:px-4">
            {/* Background Image */}
            <Image
                src="/blood-bg.jpg"
                alt="Login Background"
                fill
                className="object-cover object-right opacity-40 z-0"
                quality={100}
                priority
            />
            
            {/* Overlay for readability */}
            <div
                className="absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm z-10"
                aria-hidden="true"
            />

            {/* Content */}
            <div className="relative z-20 w-full max-w-md mx-auto bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col items-center gap-6 border border-blue-100 dark:border-slate-800">
                <div className="flex flex-col items-center gap-2">
                    <Image
                        src="/pcmc_logo.png"
                        width={60}
                        height={60}
                        alt="PCMC Pediatric Blood Center Logo"
                        className="rounded-full border-2 border-blue-200 dark:border-sky-700 shadow bg-white"
                    />
                    <h2 className="text-2xl font-bold text-red-700 dark:text-red-300 text-center">
                        Forgot Password
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 text-center text-sm">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
                    <div>
                        <label className="fieldset-label font-semibold">Email Address</label>
                        <label className="w-full border focus-within:shadow-md focus-within:shadow-red-400 input mt-1 flex items-center gap-2">
                            <Mail className="h-4 text-blue-500" />
                            <input
                                type="email"
                                {...register("email")}
                                placeholder="Enter your email address"
                                className="bg-transparent flex-1 outline-none"
                                disabled={isLoading}
                            />
                        </label>
                        <p className="text-red-500 text-sm min-h-[1.5em]">
                            {errors.email && <span>{errors.email.message}</span>}
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary w-full flex items-center justify-center gap-2 text-lg shadow-md hover:scale-[1.02] transition-transform"
                    >
                        Send Reset Link
                    </button>
                </form>

                <div className="flex flex-col gap-3 w-full">
                    <Link
                        href="/login"
                        className="btn btn-outline btn-ghost w-full flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                    </Link>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-700 dark:text-blue-300">
                            <p className="font-medium mb-1">Need help?</p>
                            <p>If you're having trouble accessing your account, please contact the PCMC Pediatric Blood Center support team.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
} 