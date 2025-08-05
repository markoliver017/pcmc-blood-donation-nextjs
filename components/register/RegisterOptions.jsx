"use client";
import { useState } from "react";
import {
    UserPlus,
    Building2,
    Users,
    Search,
    LogIn,
    X,
    SearchCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import Link from "next/link";
import Image from "next/image";

export default function RegisterOptions() {
    const [search, setSearch] = useState("");
    const options = [
        {
            href: "/organizers",
            icon: <Users className="h-8 w-8 text-red-500" />,
            title: "Blood Donor",
            image: "/blood-bg.jpg",
            alt: "Blood Donor Registration",
            color: "hover:ring-red-400",
        },
        {
            href: "/organizers/register",
            icon: <Building2 className="h-8 w-8 text-blue-500" />,
            title: "Partner Agency",
            image: "/agency-reg.jpg",
            alt: "Partner Agency Registration",
            color: "hover:ring-blue-400",
        },
        {
            href: "/organizers/coordinators",
            icon: <UserPlus className="h-8 w-8 text-green-500" />,
            title: "Coordinator",
            image: "/coordinator-img.jpeg",
            alt: "Coordinator Registration",
            color: "hover:ring-green-400",
        },
    ];
    const filteredOptions = options.filter((opt) =>
        opt.title.toLowerCase().includes(search.toLowerCase())
    );
    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-10 md:py-16">
            {/* Logo & Title */}
            <div className="text-center mb-10">
                <div className="flex flex-col items-center justify-center gap-3">
                    <Image
                        src="/pcmc_logo.png"
                        width={70}
                        height={70}
                        alt="PCMC Logo"
                        className="rounded-full border-2 border-blue-300 dark:border-blue-700 shadow bg-white"
                    />
                    <h1 className="text-3xl md:text-4xl font-extrabold text-red-700 text-shadow-sm/100 dark:text-shadow-sm/50 text-shadow-yellow-300 dark:text-shadow-yellow-300">
                        Register an Account
                    </h1>
                    <p className="text-base md:text-lg text-slate-50 text-shadow-sm/300 text-shadow-yellow-500 dark:text-shadow-yellow-300 dark:text-slate-300 max-w-2xl font-medium text-center">
                        Select the type of account you want to register for the
                        PCMC Pediatric Blood Center Portal.
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="flex justify-center mb-8">
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-lg">
                    <label className="input border rounded">
                        <SearchCheck className="h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search registration options..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            aria-label="Search registration options"
                        />
                    </label>
                    <button
                        type="button"
                        className="btn btn-primary w-48 sm:w-auto flex items-center gap-2 font-semibold"
                        aria-label="Search"
                    >
                        <Search className="h-4 w-4" /> Search
                    </button>
                </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 justify-items-center">
                {filteredOptions.length === 0 ? (
                    <div className="col-span-full text-center text-slate-500 dark:text-slate-400 py-16 font-semibold">
                        No registration options found.
                    </div>
                ) : (
                    filteredOptions.map((opt) => (
                        <Link
                            href={opt.href}
                            key={opt.title}
                            className={`group focus:outline-none transition-transform transform hover:-translate-y-1`}
                            tabIndex={0}
                            role="button"
                            aria-label={`Register as ${opt.title}`}
                        >
                            <Card
                                className={`h-full flex flex-col justify-between hover:ring-2 ${opt.color} border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 shadow-lg rounded-xl`}
                            >
                                <CardHeader className="flex flex-col items-center gap-2 pt-6">
                                    {opt.icon}
                                    <CardTitle className="text-xl font-bold text-slate-800 dark:text-white tracking-tight drop-shadow">
                                        {opt.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex justify-center items-center pb-6">
                                    <Image
                                        src={opt.image}
                                        alt={opt.alt}
                                        width={200}
                                        height={100}
                                        className="w-48 h-24 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105 shadow"
                                    />
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                )}
            </div>

            {/* Sign In Option */}
            <div className="text-center">
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 btn  btn-primary px-2 md:px-12 py-3 rounded-lg font-semibold hover:bg-blue-500  transition-all focus-visible:ring-2 focus-visible:ring-blue-400"
                    aria-label="Sign in if you already have an account"
                >
                    <LogIn className="h-5 w-5" />
                    Already have an account?{" "}
                    <span className="underline underline-offset-2">
                        Sign In
                    </span>
                </Link>
            </div>
        </div>
    );
}
