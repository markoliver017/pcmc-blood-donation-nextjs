"use client";

import React, { useState } from "react";
import { EyeIcon, Key, Mail } from "lucide-react";
import Image from "next/image";

import { IoMdLogIn } from "react-icons/io";
import { set, useForm } from "react-hook-form";
import notify from "@components/ui/notify";
import { toast } from "react-toastify";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";

const credentials = {
    email: "",
    password: "",
};

export default function LoginForm({
    showHeader = true,
    showProvidersSection = false,
    onClose = () => {},
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    //?callbackUrl=/portal/admin/profile
    const callbackUrl = searchParams.get("callbackUrl") || "/portal";

    const [isLoading, setIsLoading] = useState({});
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const {
        register,
        watch,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: credentials.email,
            password: credentials.password,
        },
    });

    // console.log("watchAll", watch());
    // console.log("form errors", errors);

    const onSubmit = async (data) => {
        setIsLoading((prev) => ({ ...prev, credentials: true }));
        const { email, password } = data;
        const res = await signIn("credentials", {
            email,
            // debugEmail: email,
            password,
            redirect: false,
            callbackUrl, // redirect after login
        });

        if (res.ok && res.error == undefined) {
            toast.success("You're now signed in.", {
                position: "bottom-right",
            });

            // router.push(res.url);
            setTimeout(() => (window.location.href = res.url), 500);
        } else {
            setIsLoading(false);
            setError("password", {
                type: "manual",
                message: "Invalid email or password!",
            });
        }
    };
    const isAnyLoading = Object.values(isLoading).some((v) => v);

    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full bg-white/80 dark:bg-slate-900/80 border border-blue-100 dark:border-slate-800 px-6 sm:px-10 py-6 rounded-2xl shadow-md flex flex-col gap-4"
            >
                {showHeader && (
                    <div className="flex flex-col items-center justify-center mb-2 gap-2">
                        <Image
                            src="/pcmc_logo.png"
                            width={60}
                            height={60}
                            alt="PCMC Pediatric Blood Center Logo"
                            className="rounded-full border-2 border-blue-200 dark:border-sky-700 shadow bg-white"
                        />
                        <h2 className="text-center font-geist-sans font-bold text-xl mt-1 leading-tight text-red-700 dark:text-red-300">
                            PCMC Pediatric Blood Center
                        </h2>
                        <span className="text-base text-slate-600 dark:text-slate-300">
                            Member Login
                        </span>
                    </div>
                )}
                <div>
                    <label className="fieldset-label font-semibold">
                        Email
                    </label>
                    <label className="w-full border focus-within:shadow-md focus-within:shadow-red-400 input mt-1 flex items-center gap-2">
                        <Mail className="h-4 text-blue-500" />
                        <input
                            type="email"
                            {...register("email", {
                                required: "Email Address is required.",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Email Address is invalid.",
                                },
                                validate: (value) => {
                                    if (value.length < 5) {
                                        return "Email Address must be at least 5 characters long.";
                                    }
                                },
                            })}
                            placeholder="mail@site.com"
                            className="bg-transparent flex-1 outline-none"
                        />
                    </label>
                    <p className="text-red-500 text-sm min-h-[1.5em]">
                        {errors.email && <span>{errors.email?.message}</span>}
                    </p>
                </div>
                <div>
                    <label className="fieldset-label font-semibold">
                        Password
                    </label>
                    <label className="input border focus-within:shadow-md focus-within:shadow-red-300 w-full mt-1 flex items-center gap-2">
                        <Key className="h-4 text-blue-500" />
                        <input
                            type={showPasswordReset ? "text" : "password"}
                            {...register("password", {
                                required: "Password is required.",
                                validate: (value) => {
                                    if (value.length < 8) {
                                        return "Password must be at least 8 characters long.";
                                    }
                                },
                            })}
                            placeholder="Password"
                            minLength="8"
                            className="bg-transparent flex-1 outline-none"
                        />
                        <button
                            className="btn btn-ghost btn-sm"
                            onClick={() =>
                                setShowPasswordReset(!showPasswordReset)
                            }
                        >
                            <EyeIcon className="h-4 text-blue-500" />
                        </button>
                    </label>
                    <p className="text-red-500 text-sm min-h-[1.5em]">
                        {errors.password && (
                            <span>{errors.password?.message}</span>
                        )}
                    </p>
                    <div className="flex justify-end mt-1">
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                router.push("/auth/forgot-password");
                            }}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
                        >
                            Forgot Password?
                        </button>
                    </div>
                </div>
                <div className="flex flex-col  gap-2 mt-2">
                    <label className="flex max-w-max items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            {...register("rememberMe")}
                            className="border checkbox checkbox-primary"
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                            Remember Me
                        </span>
                    </label>
                    <label className="flex max-w-max items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            {...register("agreeTerms", {
                                required:
                                    "You must agree to the terms and conditions.",
                            })}
                            className="border checkbox checkbox-primary"
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                            I agree to the{" "}
                            <Link
                                href="/legal"
                                target="_blank"
                                className="underline hover:text-blue-600"
                            >
                                Terms & Conditions
                            </Link>
                        </span>
                    </label>
                </div>
                <p className="text-red-500 text-sm min-h-[1.5em]">
                    {errors.agreeTerms && (
                        <span>{errors.agreeTerms?.message}</span>
                    )}
                </p>
                <button
                    disabled={isAnyLoading}
                    className="btn btn-primary mt-2 w-full flex items-center justify-center gap-2 text-lg shadow-md hover:scale-[1.02] transition-transform"
                >
                    {isLoading?.credentials ? (
                        <>
                            <span className="loading loading-bars loading-xs"></span>
                            Signing In...
                        </>
                    ) : (
                        <>
                            <IoMdLogIn />
                            Sign In
                        </>
                    )}
                </button>
                <div className="flex justify-center mt-2">
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            router.push("/register");
                        }}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
                    >
                        Don't have an account?{" "}
                        <span className="font-semibold">Register here</span>
                    </button>
                </div>
            </form>
            {showProvidersSection && (
                <div className="w-full flex flex-col items-center mt-6">
                    <div className="flex items-center w-full mb-4">
                        <div className="flex-1 h-px bg-blue-200 dark:bg-slate-700" />
                        <span className="mx-3 text-slate-400 dark:text-slate-500 text-sm">
                            or sign in with
                        </span>
                        <div className="flex-1 h-px bg-blue-200 dark:bg-slate-700" />
                    </div>
                    <div className="flex flex-col gap-3 w-full">
                        <button
                            disabled={isAnyLoading}
                            className="flex items-center justify-center gap-3 w-full py-3 rounded-lg bg-white border border-blue-200 dark:bg-slate-800 dark:border-slate-700 shadow hover:bg-blue-50 dark:hover:bg-slate-700 text-blue-700 dark:text-blue-200 font-semibold text-base transition-all"
                            // onClick={() => {
                            //     signIn("google", { callbackUrl: "/portal" });
                            //     setIsLoading((prev) => ({
                            //         ...prev,
                            //         google: true,
                            //     }));
                            // }}
                            onClick={() => alert("Works only in Production")}
                        >
                            {isLoading?.google ? (
                                <>
                                    <span className="loading loading-bars loading-xs"></span>
                                    Signing In with Google...
                                </>
                            ) : (
                                <>
                                    <FaGoogle className="text-xl" />
                                    Continue with Google
                                </>
                            )}
                        </button>
                        <button
                            disabled={isAnyLoading}
                            className="flex items-center justify-center gap-3 w-full py-3 rounded-lg bg-[#1A77F2] border border-blue-700 shadow hover:bg-blue-800 text-white font-semibold text-base transition-all"
                            onClick={() => alert("Works only in Production")}
                        >
                            <svg
                                aria-label="Facebook logo"
                                width="20"
                                height="20"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 32 32"
                            >
                                <path
                                    fill="white"
                                    d="M8 12h5V8c0-6 4-7 11-6v5c-4 0-5 0-5 3v2h5l-1 6h-4v12h-6V18H8z"
                                ></path>
                            </svg>
                            Continue with Facebook
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
