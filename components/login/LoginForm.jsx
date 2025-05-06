"use client";

import React, { useState } from "react";
import { Key, Mail } from "lucide-react";
import Image from "next/image";
import { IoMdLogIn } from "react-icons/io";
import { set, useForm } from "react-hook-form";
import notify from "@components/ui/notify";
import { toast } from "react-toastify";
// import { signIn } from "@lib/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const credentials = {
    email: "admin@email.com",
    password: "password",
};

export default function LoginForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
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
        setIsLoading(true);
        const { email, password } = data;
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl: "/admin", // redirect after login
        });

        setIsLoading(false);
        // console.log("res>>>>>>>>>", res)
        if (res.ok && res.error == undefined) {
            toast.success("Login successful!", {
                message: "Login successful!",
                position: "top-right",
            });

            router.push(res.url);
        } else {
            setError("password", {
                type: "manual",
                message: "Invalid email or password!",
            });
        }

        // setTimeout(() => {
        //     // Perform login logic here
        //     if (
        //         data.email === credentials.email &&
        //         data.password === credentials.password
        //     ) {
        //         toast.success("Login successful!", {
        //             // message: "Login successful!",
        //             position: "bottom-left",
        //         });
        //         // Redirect to the dashboard or perform any other action
        //         redirect("/admin");
        //     } else {
        //         setError("password", {
        //             type: "manual",
        //             message: "Invalid email or password!",
        //         });

        //         toast.error("Invalid email or password!", {
        //             position: "bottom-left",
        //         });
        //     }

        //     setIsLoading(false);
        // }, 2000);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="fieldset w-full bg-base-200 border border-base-300 p-4 rounded-box"
        >
            <legend className="fieldset-legend">INMERS Portal</legend>
            <div className="flex flex-col items-center justify-center mb-4">
                <Image
                    src="/inmers-logo.jpg"
                    className="flex-none"
                    width={75}
                    height={75}
                    layout="intrinsic"
                    alt="Logo"
                />
                <h2 className="text-center font-geist-sans font-semibold text-xl mt-2 leading-tight text-shadow-[_1px_1px_8px_#8b8eee]">
                    Integrated National Medication Error Reporting System
                </h2>
            </div>
            <div>
                <label className="fieldset-label">Email</label>
                <label className="input validator mt-1">
                    <Mail className="h-3" />
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
                        // required
                    />
                </label>
                <p className="text-red-500 text-sm">
                    {errors.email && <span>{errors.email?.message}</span>}
                </p>
            </div>

            <div className="mt-2">
                <label className="fieldset-label">Password</label>
                <label className="input validator mt-1">
                    <Key className="h-3" />
                    <input
                        type="password"
                        {...register("password", {
                            required: "Password is required.",
                            validate: (value) => {
                                if (value.length < 8) {
                                    return "Password must be at least 8 characters long.";
                                }
                            },
                        })}
                        // required
                        placeholder="Password"
                        minLength="8"
                        pattern=".{8,}"
                        title="Must be more than 8 characters"
                    />
                </label>
                <p className="text-red-500 text-sm">
                    {errors.password && <span>{errors.password?.message}</span>}
                </p>
            </div>

            <button className="btn btn-neutral mt-4 hover:bg-neutral-800 hover:text-green-300">
                {isLoading ? (
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
        </form>
    );
}
