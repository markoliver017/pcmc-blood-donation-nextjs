"use client";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
    return (
        <>
            <header className="flex-none flex gap-10 justify-between items-center border-b border-gray-200 px-2 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                <Link
                    href="/"
                    className="flex-none flex gap-2 items-center hover:ring rounded-xl p-2"
                >
                    <Image
                        src="/pcmc_logo.png"
                        className="flex-none"
                        width={50}
                        height={50}
                        alt="Integrated National Medication Reporting System"
                        title="Integrated National Medication Reporting System"
                    />
                    <h1 className="text-2xl font-bold text-shadow-lg/30 italic">
                        PCMC Pediatric Blood Center - Medical Blood Donation
                        Portal
                    </h1>
                </Link>
            </header>
        </>
    );
};

export default Header;
