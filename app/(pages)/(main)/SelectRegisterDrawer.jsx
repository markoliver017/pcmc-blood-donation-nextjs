"use client";

import {
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter,
    DrawerClose,
    DrawerState,
    DrawerDescription,
} from "@components/ui/drawer";
import LoginForm from "@components/login/LoginForm";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import Link from "next/link";
import { UserPlus, Building2, Users, Search, LogIn, X } from "lucide-react";
import { useState } from "react";

export default function SelectRegisterDrawer({ open, setOpen }) {
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
    const filteredOptions = options.filter(opt =>
        opt.title.toLowerCase().includes(search.toLowerCase())
    );
    return (
        <>
            <DrawerState direction="bottom" open={open} onOpenChange={setOpen}>
                <DrawerContent role="dialog" aria-modal="true" aria-label="Registration Options Drawer" className="dark:bg-neutral-900 dark:text-slate-100 rounded-t-3xl transition-all duration-300 px-4 py-6 min-h-[60vh]">
                    <DrawerTitle></DrawerTitle>
                    {/* Optional: Divider at the top */}
                    <div className="w-16 h-1 bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400 rounded-full mb-4 mx-auto opacity-70" />
                    {/* Heading & Subheading */}
                    <div className="flex flex-col items-center overflow-y-scroll px-2 md:px-5">
                        <div className="w-full flex flex-col items-center mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <UserPlus className="h-7 w-7 text-red-500 drop-shadow" />
                                <span className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight drop-shadow">Register an Account</span>
                            </div>
                            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 text-center max-w-xl font-medium">
                                Please select the type of account you want to register for the PCMC Pediatric Blood Center Portal.
                            </p>
                        </div>
                        {/* Search Input/Button */}
                        <div className="w-full max-w-md flex flex-wrap justify-center items-center gap-2 mb-6">
                            <label className="input border rounded-lg bg-white/80 dark:bg-slate-800/80">
                                <input
                                    type="text"
                                    placeholder="Search registration options..."
                                    className="w-full bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    aria-label="Search registration options"
                                />
                            </label>
                            <button type="button" className="btn btn-primary flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-blue-400 font-semibold" aria-label="Search">
                                <Search className="h-4 w-4" />
                                Search
                            </button>
                        </div>
                        {/* Registration Cards */}
                        <div className="w-full flex flex-col md:flex-row gap-6 justify-center items-center mb-6">
                            {filteredOptions.length === 0 ? (
                                <div className="text-slate-500 flex justify-center items-center h-60 dark:text-slate-400 text-center w-full py-8 font-semibold">
                                    No registration options found.
                                </div>
                            ) : (
                                filteredOptions.map((opt, idx) => (
                                    <Link
                                        href={opt.href}
                                        className={`w-full md:w-1/3 focus:outline-none`}
                                        key={opt.title}
                                        tabIndex={0}
                                        role="button"
                                        aria-label={`Register as ${opt.title}`}
                                    >
                                        <Card className={`rounded-xl cursor-pointer hover:ring-2 group shadow-lg transition-all duration-300 bg-white/90 dark:bg-slate-800/90 border border-blue-100 dark:border-slate-700 flex flex-col items-center ${opt.color} focus-visible:ring-4 focus-visible:ring-blue-400`}> 
                                            <CardHeader className="flex flex-col items-center gap-2 pt-6">
                                                {opt.icon}
                                                <CardTitle className="text-lg md:text-xl font-bold text-slate-800 dark:text-white tracking-tight drop-shadow">{opt.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="flex flex-col items-center pb-6">
                                                <Image
                                                    src={opt.image}
                                                    className="w-48 h-24 object-cover rounded-xl transform transition-transform duration-300 group-hover:scale-105 shadow"
                                                    width={200}
                                                    height={100}
                                                    alt={opt.alt}
                                                    title={opt.title}
                                                />
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))
                            )}
                        </div>
                        {/* Sign In Option */}
                        <div className="w-full flex justify-center mb-2">
                            <Link
                                href="/login"
                                className="btn btn-outline btn-primary flex items-center gap-2 px-6 py-2 rounded-lg shadow hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-slate-800 transition-all focus-visible:ring-2 focus-visible:ring-blue-400 font-semibold"
                                aria-label="Sign in if you already have an account"
                            >
                                <LogIn className="h-5 w-5" />
                                Already have an account? Sign In
                            </Link>
                        </div>
                        <DrawerFooter className="flex flex-col items-center mt-2">
                            <DrawerClose className="btn btn-primary btn-lg flex items-center gap-2 px-8 py-3 rounded-full shadow focus-visible:ring-2 focus-visible:ring-blue-400 font-bold" aria-label="Close registration drawer">
                                <X className="h-5 w-5" />
                                Close
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </DrawerState>
        </>
    );
}
