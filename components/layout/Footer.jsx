import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
    return (
        <footer className="flex-none py-5 px-3 md:py-6 md:px-6 bg-gradient-to-r from-red-100 via-blue-50 to-blue-100 dark:from-red-900 dark:via-slate-900 dark:to-blue-900 border-t border-red-200 dark:border-red-800 z-5">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-start md:items-center justify-between gap-4 md:gap-6">
                {/* Left: Brand and Copyright */}
                <div className="text-center md:text-left">
                    <p className="font-bold text-base md:text-lg text-red-700 dark:text-red-300 mb-1">
                        PCMC Pediatric Blood Center
                    </p>
                    <p className="text-slate-700 dark:text-slate-200 text-xs md:text-sm mb-1 leading-relaxed">
                        &copy; {new Date().getFullYear()} Philippine Children's
                        Medical Center. All rights reserved.
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                        Designed & developed by the PCMC Dev Team
                    </p>
                    {/* Policy Links */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3 text-xs text-slate-600 dark:text-slate-300">
                        <Link
                            href="/legal?policy=terms"
                            className="hover:underline"
                        >
                            Terms & Conditions
                        </Link>
                        <span className="hidden md:inline">|</span>
                        <Link
                            href="/legal?policy=privacy"
                            className="hover:underline"
                        >
                            Privacy Policy
                        </Link>
                        <span className="hidden md:inline">|</span>
                        <Link
                            href="/legal?policy=consent"
                            className="hover:underline"
                        >
                            Consent Form
                        </Link>
                    </div>
                </div>

                {/* Right: Social + Contact */}
                <div className="flex flex-col items-center md:items-end gap-2">
                    {/* Mobile: collapsible contact + quick social */}
                    <div className="w-full md:hidden">
                        <details className="group w-full">
                            <summary className="flex w-full list-none cursor-pointer items-center justify-between rounded-md bg-white/60 dark:bg-slate-800/50 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
                                <span>Contact & Social</span>
                                <span className="transition-transform group-open:rotate-180">
                                    ⌄
                                </span>
                            </summary>
                            <div className="mt-2 rounded-md bg-white/60 dark:bg-slate-800/50 p-3 text-xs text-slate-700 dark:text-slate-200 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
                                <p className="font-semibold mb-1">
                                    📍 Pediatric Blood Center Contact Numbers:
                                </p>
                                <ul className="space-y-1 pl-4">
                                    <li>
                                        📱 Mobile: (0917) 8468167 / (0917) 846
                                        8093
                                    </li>
                                    <li>☎️ Landline: (02) 8921 9781</li>
                                    <li>
                                        📞 Trunk Line: (02) 8588-9900 local 1165
                                    </li>
                                    <li>📧 Email: pcmcpedbcmbd@gmail.com</li>
                                    <li className="flex items-center gap-1">
                                        <FaFacebook /> Facebook:{" "}
                                        <a
                                            className="hover:text-blue-500 hover:underline"
                                            href="https://www.facebook.com/pcmc.pedbc"
                                            target="_blank"
                                            rel="noreferrer noopener"
                                        >
                                            PCMC Pedbc
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://pcmc.gov.ph/"
                                            aria-label="PCMC Website"
                                            target="_blank"
                                            rel="noreferrer noopener"
                                            className="inline-flex items-center gap-1 text-gray-600 dark:text-slate-300 text-xs"
                                        >
                                            <Image
                                                src="/pcmc_logo.png"
                                                alt="PCMC Logo"
                                                width={16}
                                                height={16}
                                            />
                                            Official Website
                                            <span className="underline">
                                                www.pcmc.gov.ph
                                            </span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </details>
                    </div>

                    {/* Desktop: full contact info */}
                    <div className="hidden md:block text-xs text-slate-600 dark:text-slate-300 mt-1">
                        <span className="font-semibold">
                            📍 Pediatric Blood Center Contact Numbers:
                        </span>{" "}
                        <ul className="text-xs pl-5">
                            <li>📱 Mobile: (0917) 8468167 / (0917) 846 8093</li>
                            <li>☎️ Landline (Direct Line): (02) 8921 9781</li>
                            <li>📞 Trunk Line: (02) 8588-9900 local 1165</li>
                            <li>📧 Email: pcmcpedbcmbd@gmail.com</li>
                            <li className="flex items-center gap-1">
                                <FaFacebook /> Facebook:{" "}
                                <a
                                    className="hover:text-blue-500 underline hover:font-semibold"
                                    href="https://www.facebook.com/pcmc.pedbc"
                                    target="_blank"
                                    rel="noreferrer noopener"
                                >
                                    PCMC Pedbc
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
