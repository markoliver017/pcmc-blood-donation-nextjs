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
    CircleEllipsis,
    Command,
    Database,
    Eye,
    File,
    FileSliders,
    Home,
    LogOut,
    MoreHorizontal,
    SquareMenu,
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
            <header className="flex-none border-b border-gray-200 p-2 bg-gradient-to-b from-cyan-500 to-blue-900 text-white">
                <div className="flex-1 flex justify-between md:justify-evenly gap-2 items-center">
                    <nav className="hidden md:block">
                        <ul className="flex space-x-4 font-bold text-xl italic tex-white text-shadow">
                            <li>
                                <Link href="/">
                                    <Image
                                        src="/blood-logo.png"
                                        className="flex-none rounded-xl bg-transparent"
                                        width={50}
                                        height={50}
                                        alt="logo"
                                        title="logo"
                                    />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/"
                                    className="p-3 hover:ring rounded-xl flex-items-center"
                                >
                                    <Home className="h-4" />
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/portal/admin/users"
                                    className="p-3 hover:ring rounded-xl flex-items-center"
                                >
                                    <Users2 className="h-4" />
                                    Users
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/admin/agencies"
                                    className="p-3 hover:ring rounded-xl flex-items-center"
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
                                <Button
                                    variant="ghost"
                                    className="h-8 w-min p-0"
                                >
                                    <span className="sr-only">Open menu</span>
                                    <SquareMenu /> Menus
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="bottom" align="start">
                                <DropdownMenuLabel className="flex items-center gap-2 space-x-2">
                                    <Command className="w-3 h-3" />
                                    Navigate
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {/* <Link href={`/`}> */}
                                <DropdownMenuItem>
                                    <Link
                                        href="#"
                                        className="w-full hover:ring rounded flex-items-center "
                                    >
                                        <Home className="h-4" />
                                        Home
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link
                                        href="#"
                                        className="w-full hover:ring rounded flex-items-center "
                                    >
                                        <FileSliders className="h-4" />
                                        Option 2
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link
                                        href="#"
                                        className="w-full hover:ring rounded flex-items-center "
                                    >
                                        <FileSliders className="h-4" />
                                        Option 3
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
                                <Button
                                    variant="ghost"
                                    className="h-12 w-12 p-0"
                                >
                                    <span className="sr-only">Open menu</span>

                                    <CustomAvatar
                                        avatar={
                                            currentUser?.image ||
                                            "/default_avatar.png"
                                        }
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
