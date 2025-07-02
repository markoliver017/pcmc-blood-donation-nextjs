import React from "react";
import LoginForm from "@components/login/LoginForm";
import Image from "next/image";

export default function page() {
    return (
        <div className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-red-100 dark:from-slate-900 dark:via-slate-950 dark:to-red-900 py-12 px-2 sm:px-4">
            <div className="w-full max-w-2xl mx-auto bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-2xl p-4 sm:p-8 flex flex-col items-center gap-6 border border-blue-100 dark:border-slate-800">
                
                <LoginForm showProvidersSection />
            </div>
        </div>
    );
}
