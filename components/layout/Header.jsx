"use client";
import Image from "next/image";
import Link from "next/link";
// #7F181C
const Header = () => {
    return (
        <>
            <header className="flex-none flex gap-10 md:justify-evenly items-center border-b h-80 border-gray-200 px-2 relative">
                <div
                    className="absolute inset-0 bg-[url('/blood-bg.jpg')] bg-no-repeat bg-bottom bg-cover opacity-80 pointer-events-none z-0 shadow-2xl rounded"
                    aria-hidden="true"
                />
                <Link
                    href="/"
                    className="flex-none flex gap-2  items-center hover:ring hover:ring-blue-200 rounded-xl p-2 z-1"
                >
                    <Image
                        src="/pcmc_logo.png"
                        className="flex-none"
                        width={80}
                        height={80}
                        alt="Integrated National Medication Reporting System"
                        title="Integrated National Medication Reporting System"
                    />
                    <h1 className="inline-block md:hidden text-2xl font-bold text-shadow-lg/30  italic">
                        PCMC PedBC - MBD Portal
                    </h1>
                    <h1 className="hidden md:inline-block text-lg md:text-3xl text-blue-900 text-shadow-lg/30 text-shadow-white font-extrabold italic">
                        PCMC Pediatric Blood Center - Medical Blood Donation
                        Portal
                    </h1>
                </Link>
                <div className="hidden md:flex z-1">
                    <Image
                        src="/freedom.png"
                        className="flex-none cursor-pointer"
                        width={50}
                        height={50}
                        alt="Transparency Seal"
                        title="Transparency Seal"
                    />
                    <Image
                        src="/tranparency-seal.png"
                        className="flex-none cursor-pointer"
                        width={60}
                        height={50}
                        alt="Transparency Seal"
                        title="Transparency Seal"
                    />
                    <Image
                        src="/bagong-pilipinas-logo.png"
                        className="flex-none cursor-pointer"
                        width={60}
                        height={50}
                        alt="Bagong Pilipinas"
                        title="Bagong Pilipinas"
                    />
                </div>
            </header>
        </>
    );
};

export default Header;
