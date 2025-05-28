"use client";

import React, { useState } from "react";
import { Key, Mail } from "lucide-react";
import Image from "next/image";
import { IoMdLogIn } from "react-icons/io";
import { set, useForm } from "react-hook-form";
import notify from "@components/ui/notify";
import { toast } from "react-toastify";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { FaGoogle } from "react-icons/fa";

const credentials = {
    email: "mark@email.com",
    password: "User@1234",
};

export default function LoginForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState({});
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
            password,
            redirect: false,
            callbackUrl: "/portal", // redirect after login
        });

        setIsLoading(false);
        console.log("res>>>>>>>>>", res);
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
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="fieldset w-full bg-base-200/50 border border-base-300 px-20 py-5 rounded-box"
            >
                <div className="flex flex-col items-center justify-center mb-4">
                    <Image
                        src="/pcmc_logo.png"
                        className="flex-none"
                        width={75}
                        height={75}
                        layout="intrinsic"
                        alt="Logo"
                    />
                    <h2 className="text-center font-geist-sans font-semibold text-xl mt-2 leading-tight text-shadow-[_1px_1px_8px_#8b8eee]">
                        PCMC Pediatric Blood Center <br /> Medical Blood
                        Donation <br />
                        Login
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
                        {errors.password && (
                            <span>{errors.password?.message}</span>
                        )}
                    </p>
                </div>

                <button className="btn btn-neutral mt-4 hover:bg-neutral-800 hover:text-green-300">
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
            </form>
            <div className="hidden">
                <button
                    onClick={() => {
                        signIn("github", {
                            callbackUrl: "/portal",
                        });
                        setIsLoading((prev) => ({ ...prev, github: true }));
                    }}
                    className="btn bg-violet-300 mt-4 w-full hover:bg-neutral-800 hover:text-green-300"
                >
                    {isLoading?.github ? (
                        <>
                            <span className="loading loading-bars loading-xs"></span>
                            Signing In...
                        </>
                    ) : (
                        <>
                            <GitHubLogoIcon />
                            Sign In with Github
                        </>
                    )}
                </button>
                <button
                    onClick={() => {
                        signIn("google", {
                            callbackUrl: "/portal",
                        });
                        setIsLoading((prev) => ({ ...prev, google: true }));
                    }}
                    className="btn bg-white-300 mt-4 w-full hover:bg-neutral-800 hover:text-green-300"
                >
                    {isLoading?.google ? (
                        <>
                            <span className="loading loading-bars loading-xs"></span>
                            Signing In...
                        </>
                    ) : (
                        <>
                            <FaGoogle />
                            Sign In with Google
                        </>
                    )}
                </button>
            </div>
            <div className="flex flex-col gap-3 py-5">
                {/* Google */}
                <button className="btn bg-white text-black border-[#e5e5e5]">
                    <svg
                        aria-label="Google logo"
                        width="16"
                        height="16"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                    >
                        <g>
                            <path d="m0 0H512V512H0" fill="#fff"></path>
                            <path
                                fill="#34a853"
                                d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                            ></path>
                            <path
                                fill="#4285f4"
                                d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                            ></path>
                            <path
                                fill="#fbbc02"
                                d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                            ></path>
                            <path
                                fill="#ea4335"
                                d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                            ></path>
                        </g>
                    </svg>
                    Login with Google
                </button>

                {/* Facebook */}
                <button className="btn bg-[#1A77F2] text-white border-[#005fd8]">
                    <svg
                        aria-label="Facebook logo"
                        width="16"
                        height="16"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 32 32"
                    >
                        <path
                            fill="white"
                            d="M8 12h5V8c0-6 4-7 11-6v5c-4 0-5 0-5 3v2h5l-1 6h-4v12h-6V18H8z"
                        ></path>
                    </svg>
                    Login with Facebook
                </button>
            </div>
        </>
    );
}
