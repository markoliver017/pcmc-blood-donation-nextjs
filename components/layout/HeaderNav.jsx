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
    Building,
    Command,
    Database,
    Eye,
    File,
    FileSliders,
    Home,
    LogOut,
    MoreHorizontal,
    Users2,
} from "lucide-react";
import SweetAlert from "@components/ui/SweetAlert";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { GiHamburgerMenu } from "react-icons/gi";
import CustomAvatar from "@components/reusable_components/CustomAvatar";

const HeaderNav = ({ currentUser }) => {
    let isLoggedIn = false;
    const { status, data } = useSession();

    if (status == "authenticated") {
        isLoggedIn = true;
        currentUser = data.user;
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
            <header className="flex-none flex gap-10 justify-between items-center border-b border-gray-200 p-2 bg-gradient-to-b from-gray-500 to-gray-600 text-white">
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
                                    href="/users"
                                    className="p-3 hover:ring rounded-xl flex-items-center shadow-[-11px_4px_6px_0px_rgba(0,_0,_0,_0.1)]"
                                >
                                    <Users2 className="h-4" />
                                    Users
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/agencies"
                                    className="p-3 hover:ring rounded-xl flex-items-center shadow-[-11px_4px_6px_0px_rgba(0,_0,_0,_0.1)]"
                                >
                                    <Building className="h-4" />
                                    Agencies
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
                                <Button variant="ghost" className="h-12 w-12 p-0">
                                    <span className="sr-only">Open menu</span>

                                    <CustomAvatar
                                        avatar={currentUser?.image || '/default_avatar.png'}
                                        className="w-8 h-8"
                                    />

                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel className="flex items-center space-x-2">
                                    <Command className="w-3 h-3" />
                                    <div className="flex flex-col">
                                        <span>{currentUser.name}</span>
                                        <span className="text-xs font-light">
                                            {currentUser.email}
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

export default HeaderNav;
