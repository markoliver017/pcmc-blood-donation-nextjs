"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Key, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { validateResetToken, resetPassword } from "@action/passwordResetAction";
import { toast } from "react-toastify";
import LoadingModal from "@components/layout/LoadingModal";

// Validation schema
const resetPasswordSchema = z.object({
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function ResetPasswordPage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token;
    
    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [userData, setUserData] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
    });

    // Validate token on component mount
    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setIsValidating(false);
                setIsTokenValid(false);
                return;
            }

            try {
                const result = await validateResetToken({ token });
                
                if (result.success) {
                    setIsTokenValid(true);
                    setUserData(result.data.user);
                } else {
                    setIsTokenValid(false);
                    toast.error(result.message || "Invalid or expired reset link.");
                }
            } catch (error) {
                console.error("Token validation error:", error);
                setIsTokenValid(false);
                toast.error("An error occurred while validating the reset link.");
            } finally {
                setIsValidating(false);
            }
        };

        validateToken();
    }, [token]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const result = await resetPassword({
                token,
                password: data.password,
                confirmPassword: data.confirmPassword,
            });
            
            if (result.success) {
                setIsSuccess(true);
                reset();
                toast.success("Password reset successfully! You can now log in with your new password.");
            } else {
                if (result.type === "validation") {
                    toast.error("Please check your input and try again.");
                } else {
                    toast.error(result.message || "An error occurred. Please try again.");
                }
            }
        } catch (error) {
            console.error("Password reset error:", error);
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Loading state while validating token
    if (isValidating) {
        return (
            <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-red-100 dark:from-slate-900 dark:via-slate-950 dark:to-red-900 py-5 px-2 sm:px-4">
                <Image
                    src="/blood-bg.jpg"
                    alt="Login Background"
                    fill
                    className="object-cover object-right opacity-40 z-0"
                    quality={100}
                    priority
                />
                
                <div className="absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm z-10" />
                
                <div className="relative z-20 w-full max-w-md mx-auto bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col items-center gap-6 border border-blue-100 dark:border-slate-800">
                    <div className="flex flex-col items-center gap-4">
                        <span className="loading loading-spinner loading-lg text-red-600"></span>
                        <p className="text-slate-600 dark:text-slate-300">Validating reset link...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Invalid token state
    if (!isTokenValid) {
        return (
            <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-red-100 dark:from-slate-900 dark:via-slate-950 dark:to-red-900 py-5 px-2 sm:px-4">
                <Image
                    src="/blood-bg.jpg"
                    alt="Login Background"
                    fill
                    className="object-cover object-right opacity-40 z-0"
                    quality={100}
                    priority
                />
                
                <div className="absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm z-10" />
                
                <div className="relative z-20 w-full max-w-md mx-auto bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col items-center gap-6 border border-blue-100 dark:border-slate-800">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                        
                        <Image
                            src="/pcmc_logo.png"
                            width={60}
                            height={60}
                            alt="PCMC Pediatric Blood Center Logo"
                            className="rounded-full border-2 border-blue-200 dark:border-sky-700 shadow bg-white"
                        />
                        
                        <h2 className="text-2xl font-bold text-red-700 dark:text-red-300">
                            Invalid Reset Link
                        </h2>
                        
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                            This password reset link is invalid or has expired. 
                            Please request a new password reset link.
                        </p>
                    </div>
                    
                    <div className="flex flex-col gap-3 w-full">
                        <Link
                            href="/auth/forgot-password"
                            className="btn btn-primary w-full flex items-center justify-center gap-2"
                        >
                            Request New Reset Link
                        </Link>
                        
                        <Link
                            href="/login"
                            className="btn btn-outline btn-ghost w-full flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Success state
    if (isSuccess) {
        return (
            <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-red-100 dark:from-slate-900 dark:via-slate-950 dark:to-red-900 py-5 px-2 sm:px-4">
                <Image
                    src="/blood-bg.jpg"
                    alt="Login Background"
                    fill
                    className="object-cover object-right opacity-40 z-0"
                    quality={100}
                    priority
                />
                
                <div className="absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm z-10" />
                
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
                            Password Reset Successfully
                        </h2>
                        
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                            Your password has been successfully reset. 
                            You can now log in with your new password.
                        </p>
                    </div>
                    
                    <div className="flex flex-col gap-3 w-full">
                        <Link
                            href="/login"
                            className="btn btn-primary w-full flex items-center justify-center gap-2"
                        >
                            Continue to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Reset password form
    return (
        <>
            <LoadingModal imgSrc="/email.gif" isLoading={isLoading}>Processing...</LoadingModal>
            <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-red-100 dark:from-slate-900 dark:via-slate-950 dark:to-red-900 py-5 px-2 sm:px-4">
            <Image
                src="/blood-bg.jpg"
                alt="Login Background"
                fill
                className="object-cover object-right opacity-40 z-0"
                quality={100}
                priority
            />
            
            <div className="absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm z-10" />
            
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
                        Reset Your Password
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 text-center text-sm">
                        {userData && `Hello ${userData.first_name || userData.email.split('@')[0]}! `}
                        Enter your new password below.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
                    <div>
                        <label className="fieldset-label font-semibold">New Password</label>
                        <label className="w-full border focus-within:shadow-md focus-within:shadow-red-400 input mt-1 flex items-center gap-2">
                            <Lock className="h-4 text-blue-500" />
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                placeholder="Enter your new password"
                                className="bg-transparent flex-1 outline-none"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </label>
                        <p className="text-red-500 text-sm min-h-[1.5em]">
                            {errors.password && <span>{errors.password.message}</span>}
                        </p>
                    </div>

                    <div>
                        <label className="fieldset-label font-semibold">Confirm New Password</label>
                        <label className="w-full border focus-within:shadow-md focus-within:shadow-red-400 input mt-1 flex items-center gap-2">
                            <Key className="h-4 text-blue-500" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                {...register("confirmPassword")}
                                placeholder="Confirm your new password"
                                className="bg-transparent flex-1 outline-none"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </label>
                        <p className="text-red-500 text-sm min-h-[1.5em]">
                            {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
                        </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                            <strong>Password requirements:</strong> At least 8 characters with uppercase, lowercase, and number.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary w-full flex items-center justify-center gap-2 text-lg shadow-md hover:scale-[1.02] transition-transform"
                    >
                        Reset Password
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
            </div>
        </div>
        </>
    );
} 