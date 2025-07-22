"use client";
import { useRef } from "react";
import { GrLogin } from "react-icons/gr";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
} from "@components/ui/drawer";
import LoginForm from "@components/login/LoginForm";
import Image from "next/image";
import { X } from "lucide-react";
import { DialogTitle } from "@components/ui/dialog";

export default function LoginDrawer() {
    const drawerRef = useRef();
    return (
        <>
            <button
                onClick={() => drawerRef.current.open()}
                className="bg-gradient-to-b from-green-700 to-green-500 text-white font-bold px-4 py-2 rounded-md shadow-[7px_10px_2px_0px_rgba(0,_0,_0,_0.1)] hover:from-pink-500 hover:to-purple-400 hover:ring transition duration-300"
            >
                <div className="flex justify-center items-center gap-2">
                    <GrLogin />
                    <span className="hidden md:inline-block">Sign In</span>
                </div>
            </button>

            <Drawer ref={drawerRef} direction="top">
                <DrawerContent className="dark:bg-neutral-900 dark:text-slate-100">
                    <DialogTitle></DialogTitle>
                    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-8 px-2 sm:px-8">
                        {/* Background Image */}
                        <Image
                            src="/blood-bg.jpg"
                            alt="Login Background"
                            fill
                            className="object-cover object-right "
                            quality={100}
                            priority
                        />
                        {/* Overlay for readability */}
                        <div className="absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm z-10" aria-hidden="true" />
                        {/* Logo and Heading */}
                        <div className="w-full md:w-8/10 lg:w-6/10 xl:w-5/12 2xl:w-4/12">
                            {/* Login Form */}
                            <div className="relative z-20 w-9/10 mx-auto bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-6 border border-blue-100 dark:border-slate-800 ">
                                <div className="flex flex-col items-center gap-2">
                                    <Image
                                        src="/pcmc_logo.png"
                                        width={60}
                                        height={60}
                                        alt="PCMC Pediatric Blood Center Logo"
                                        className="rounded-full border-2 border-blue-200 dark:border-sky-700 shadow bg-white"
                                    />
                                    <h2 className="text-2xl font-extrabold text-red-700 dark:text-red-300 text-center leading-tight drop-shadow">
                                        Welcome Back
                                    </h2>
                                    <p className="text-md text-slate-700 dark:text-slate-200 text-center max-w-xs drop-shadow">
                                        Sign in to your account to access the<br /> PCMC Pediatric Blood Center Portal.
                                    </p>
                                </div>
                                <LoginForm showHeader={false} showProvidersSection={true} onClose={() => drawerRef.current.close()} />
                            </div>
                        </div>
                        <button
                            className="absolute left-10 top-10 btn btn-circle bg-white/80 dark:bg-slate-800/80 shadow hover:bg-red-200 dark:hover:bg-red-900 z-30"
                            onClick={() => drawerRef.current.close()}
                            aria-label="Close login drawer"
                        >
                            <X />
                        </button>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}
