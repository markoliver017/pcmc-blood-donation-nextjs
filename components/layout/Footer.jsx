import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="flex-none py-6 px-4 bg-gradient-to-r from-red-100 via-blue-50 to-blue-100 dark:from-red-900 dark:via-slate-900 dark:to-blue-900 border-t border-red-200 dark:border-red-800 z-5">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Left: Brand and Copyright */}
                <div className="text-center md:text-left">
                    <p className="font-bold text-lg text-red-700 dark:text-red-300 mb-1">
                        PCMC Pediatric Blood Center
                    </p>
                    <p className="text-slate-700 dark:text-slate-200 text-sm mb-1">
                        &copy; {new Date().getFullYear()} Philippine Children's
                        Medical Center. All rights reserved.
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                        Designed & developed by the PCMC Dev Team
                    </p>
                    {/* Policy Links */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 text-xs text-slate-600 dark:text-slate-300">
                        <Link
                            href="/legal?policy=terms"
                            className="hover:underline"
                        >
                            Terms & Conditions
                        </Link>
                        <span>|</span>
                        <Link
                            href="/legal?policy=privacy"
                            className="hover:underline"
                        >
                            Privacy Policy
                        </Link>
                        <span>|</span>
                        <Link
                            href="/legal?policy=consent"
                            className="hover:underline"
                        >
                            Consent Form
                        </Link>
                    </div>
                </div>

                {/* Right: Social + Contact */}
                <div className="flex flex-col items-center gap-2">
                    <div className="flex space-x-4">
                        <a
                            href="#"
                            aria-label="Facebook"
                            className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors text-lg"
                        >
                            <FaFacebook />
                        </a>
                        <a
                            href="#"
                            aria-label="Twitter"
                            className="flex items-center gap-1 text-gray-500 hover:text-blue-400 transition-colors text-lg"
                        >
                            <FaTwitter />
                        </a>
                        <a
                            href="#"
                            aria-label="Instagram"
                            className="flex items-center gap-1 text-gray-500 hover:text-pink-500 transition-colors text-lg"
                        >
                            <FaInstagram />
                        </a>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        <span className="font-semibold">Contact:</span>{" "}
                        info@pcmc.gov.ph
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
