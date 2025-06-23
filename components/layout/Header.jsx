"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
// #7F181C
const Header = () => {
    const pathname = usePathname();
    console.log("pathname", pathname);
    if (pathname.startsWith("/portal")) {
        return (
            <header className="flex-none flex gap-10 md:justify-evenly items-center border-b border-gray-200 px-2 relative">
                <div
                    className="absolute inset-0 bg-[url('/pcmc-hospital-bg1.jpg')] bg-no-repeat bg-center bg-cover opacity-80 pointer-events-none z-0 shadow-2xl rounded"
                    aria-hidden="true"
                />
                <Link
                    href="/"
                    className="flex-none flex gap-2 items-center rounded-xl p-2 z-1"
                >
                    <Image
                        src="/pcmc_logo.png"
                        // className="flex-none w-24 sm:w-32 md:w-48 lg:w-64"
                        width={80}
                        height={80}
                        alt="PCMC Pediatric Blood Center - Mobile Blood Donation Portal"
                        title="PCMC Pediatric Blood Center - Mobile Blood Donation Portal"
                    />
                    <h1
                        className="inline-block md:hidden text-2xl md:text-3xl text-blue-900 text-shadow-lg/30 text-shadow-white font-extrabold italic"
                        title="PCMC Pediatric Blood Center - Mobile Blood Donation Portal"
                    >
                        PCMC PedBC - MBD Portal
                    </h1>
                    <h1 className="hidden md:inline-block text-lg md:text-3xl text-blue-900 text-shadow-lg/30 text-shadow-white font-extrabold italic">
                        PCMC Pediatric Blood Center - Mobile Blood Donation
                        Portal
                    </h1>
                </Link>
                <div className="hidden md:flex z-1">
                    <Image
                        src="/tranparency-seal.png"
                        className="flex-none cursor-pointer"
                        width={90}
                        height={90}
                        alt="Transparency Seal"
                        title="Transparency Seal"
                    />
                    <Image
                        src="/bagong-pilipinas-logo.png"
                        className="flex-none cursor-pointer"
                        width={100}
                        height={100}
                        alt="Bagong Pilipinas"
                        title="Bagong Pilipinas"
                    />
                    <Image
                        src="/freedom.png"
                        className="flex-none cursor-pointer"
                        width={100}
                        height={100}
                        alt="Transparency Seal"
                        title="Transparency Seal"
                    />
                </div>
            </header>
        );
    }

    return (
        <header className="flex-none flex gap-10 md:justify-evenly items-center border-b h-80 border-gray-200 px-2 relative">
            <div
                className="absolute inset-0 bg-[url('/blood-bg.jpg')] bg-no-repeat bg-bottom bg-cover opacity-80 pointer-events-none z-0 shadow-2xl rounded"
                aria-hidden="true"
            />
            <Link
                href="/"
                className="flex-none flex gap-2 items-center rounded-xl p-2 z-1"
            >
                <Image
                    src="/pcmc_logo.png"
                    className="flex-none w-24 sm:w-32 md:w-48 lg:w-64"
                    width={150}
                    height={150}
                    alt="PCMC Pediatric Blood Center - Mobile Blood Donation Portal"
                    title="PCMC Pediatric Blood Center - Mobile Blood Donation Portal"
                />
                <h1
                    className="inline-block md:hidden text-2xl md:text-3xl text-blue-900 text-shadow-lg/30 text-shadow-white font-extrabold italic"
                    title="PCMC Pediatric Blood Center - Mobile Blood Donation Portal"
                >
                    PCMC PedBC - MBD Portal
                </h1>
                <h1 className="hidden md:inline-block text-lg md:text-3xl text-blue-900 text-shadow-lg/30 text-shadow-white font-extrabold italic">
                    PCMC Pediatric Blood Center - Mobile Blood Donation Portal
                </h1>
            </Link>
            <div className="hidden md:flex z-1">
                <Image
                    src="/tranparency-seal.png"
                    className="flex-none cursor-pointer"
                    width={90}
                    height={90}
                    alt="Transparency Seal"
                    title="Transparency Seal"
                />
                <Image
                    src="/bagong-pilipinas-logo.png"
                    className="flex-none cursor-pointer"
                    width={100}
                    height={100}
                    alt="Bagong Pilipinas"
                    title="Bagong Pilipinas"
                />
                <Image
                    src="/freedom.png"
                    className="flex-none cursor-pointer"
                    width={100}
                    height={100}
                    alt="Transparency Seal"
                    title="Transparency Seal"
                />
            </div>
        </header>
    );
};

export default Header;
