"use client";
import LoginDrawer from "@components/login/LoginDrawer";
import Image from "next/image";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Button } from "@components/ui/button";
import {
    Command,
    Database,
    Eye,
    File,
    FileSliders,
    Home,
    LogOut,
    MoreHorizontal,
} from "lucide-react";
import SweetAlert from "@components/ui/SweetAlert";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { LiaHamburgerSolid } from "react-icons/lia";
import { GiHamburgerMenu } from "react-icons/gi";

const Header = ({
    admin = {
        name: "Dela Cruz, Juan",
        email: "admin@email.com",
        avatar: "https://avatar.iran.liara.run/public/boy",
    },
}) => {
    let isLoggedIn = false;
    const { data: session, status } = useSession();

    if (status == "authenticated") {
        const { user } = session;
        isLoggedIn = true;
        admin.name = user?.name;
        admin.email = user?.email;
        admin.avatar =
            user?.avatar || user?.gender == "female"
                ? "https://avatar.iran.liara.run/public/girl"
                : "https://avatar.iran.liara.run/public/boy";
    }

    const handleLogOut = () => {
        SweetAlert({
            title: "Logged out?",
            text: "Are you sure you want to log out?",
            icon: "question",
            showCancelButton: true,
            cancelButtonText: "Cancel",
            onConfirm: () => signOut({ callbackUrl: "/" }),
        });
    };
    return (
        <>
            <header className="flex-none flex gap-10 justify-between items-center border-b border-gray-200 p-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                <Link
                    href="/"
                    className="flex-none flex gap-2 items-center hover:ring rounded-xl p-2"
                >
                    <Image
                        src="/inmers-logo.jpg"
                        className="flex-none"
                        width={50}
                        height={50}
                        alt="Integrated National Medication Reporting System"
                        title="Integrated National Medication Reporting System"
                    />
                    <h1 className="text-2xl font-bold text-shadow-lg/30 italic">
                        INMERS
                    </h1>
                </Link>

                <div className="flex-none md:flex-1 flex justify-between gap-2 items-center">
                    <nav className="hidden md:block">
                        <ul className="flex space-x-4">
                            <li>
                                <Link
                                    href="/"
                                    className="p-3 hover:ring rounded-xl flex-items-center shadow-[-11px_4px_6px_0px_rgba(0,_0,_0,_0.1)]"
                                >
                                    <Home className="h-4" />
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/request"
                                    className="p-3 hover:ring rounded-xl flex-items-center shadow-[-11px_4px_6px_0px_rgba(0,_0,_0,_0.1)]"
                                >
                                    <FileSliders className="h-4" />
                                    Data Request Form
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    <div className="block md:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <GiHamburgerMenu
                                        className="inline-block"
                                        title="Collapse the left navigation pane"
                                    />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel className="flex items-center gap-2 space-x-2">
                                    <Command className="w-3 h-3" />
                                    Menus
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {/* <Link href={`/`}> */}
                                <DropdownMenuItem>
                                    <Link
                                        href="/"
                                        className="w-full hover:ring rounded flex-items-center "
                                    >
                                        <Home className="h-4" />
                                        Home
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link
                                        href="/request"
                                        className="w-full hover:ring rounded flex-items-center "
                                    >
                                        <FileSliders className="h-4" />
                                        Data Request Form
                                    </Link>
                                </DropdownMenuItem>
                                {/* </Link> */}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    {!isLoggedIn ? (
                        <LoginDrawer />
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <Image
                                        src={admin.avatar}
                                        className="flex-none rounded-4xl"
                                        width={50}
                                        height={50}
                                        alt="Logo"
                                    />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel className="flex items-center space-x-2">
                                    <Command className="w-3 h-3" />
                                    <div className="flex flex-col">
                                        <span>{admin.name}</span>
                                        <span className="text-xs font-light">
                                            {admin.email}
                                        </span>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {/* <Link href={`/`}> */}
                                <DropdownMenuItem
                                    className="flex items-center space-x-2"
                                    onClick={handleLogOut}
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Log Out</span>
                                </DropdownMenuItem>
                                {/* </Link> */}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </header>
        </>
    );
};

export default Header;
