import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

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
                    {/* <div className="flex space-x-4">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Follow us: </label>
                        <a
                            href="https://www.facebook.com/pcmc.pedbc"
                            aria-label="Facebook"
                            target="_blank"
                            className="flex items-center gap-1 text-blue-600 transition-colors text-lg"
                        >
                            <FaFacebook />
                        </a>
                        <a
                            href="https://pcmc.gov.ph/"
                            aria-label="Twitter"
                            target="_blank"
                            className="flex items-center gap-1 text-gray-500 hover:text-blue-400 transition-colors text-lg"
                        >
                            <Image
                                src="/pcmc_logo.png"
                                alt="PCMC Logo"
                                width={20}
                                height={20}
                            />
                        </a>

                    </div> */}
                    <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        <span className="font-semibold">📍 Pediatric Blood Center Contact Numbers:</span>{" "}
                        <ul className="text-xs pl-5">
                            <li>📱 Mobile: (0917) 8468167  / (0917) 846 8093</li>
                            <li>☎️ Landline (Direct Line): (02) 8921 9781</li>
                            <li>📞 Trunk Line: (02) 8588-9900 local 1165</li>
                            <li>📧 Email: pcmcpedbcmbd@gmail.com</li>
                            <li>📘 Facebook: <a className="hover:text-blue-500 hover:underline" href="https://www.facebook.com/pcmc.pedbc" target="_blank">PCMC Pedbc</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer >
    );
};

export default Footer;
