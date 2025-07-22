import React from "react";
import LoginForm from "@components/login/LoginForm";
import Image from "next/image";
import { auth } from "@lib/auth";
import { redirect } from "next/navigation";

export default async function page() {
    const session = await auth();
    if (session?.user) {
        redirect("/portal");
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-red-100 dark:from-slate-900 dark:via-slate-950 dark:to-red-900 py-5 px-2 sm:px-4">
            {/* Background Image */}
            <Image
                src="/blood-bg.jpg"
                alt="Login Background"
                fill
                className="object-cover object-right z-0"
                quality={100}
                priority
            />

            {/* Overlay for readability */}
            <div
                className="absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm z-10"
                aria-hidden="true"
            />

            {/* Content */}
            <div className="relative z-20 w-full max-w-2xl mx-auto bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-2xl p-4 sm:p-8 flex flex-col items-center gap-6 border border-blue-100 dark:border-slate-800">
                <LoginForm showProvidersSection />
            </div>
        </div>
    );
}
