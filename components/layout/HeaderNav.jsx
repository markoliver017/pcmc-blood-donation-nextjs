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
    Calendar,
    Command,
    Droplet,
    FileSliders,
    Home,
    HomeIcon,
    LogOut,
    PhoneCall,
    SquareMenu,
    Text,
    User,
    UserCog2Icon,
    UserRoundCheck,
    Users,
    Users2Icon,
} from "lucide-react";
import SweetAlert from "@components/ui/SweetAlert";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import CustomAvatar from "@components/reusable_components/CustomAvatar";
import { MdAmpStories, MdEmail } from "react-icons/md";

const HeaderNav = ({ currentUser }) => {
    let isLoggedIn = false;
    const { status, data } = useSession();

    if (status == "authenticated") {
        isLoggedIn = true;
        currentUser = data.user;
    }

    console.log("currentUser length", currentUser?.roles?.length);

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
            <header className="flex-none border-b border-gray-200 p-2 shadow-lg/100 shadow-gray-500 bg-gradient-to-b from-cyan-100 dark:from-sky-500 to-slate-200 dark:to-sky-800">
                <div className="flex-1 flex justify-between md:justify-evenly gap-2 items-center">
                    <Link
                        href="/"
                        className="flex-none flex gap-2 items-center rounded-xl p-2 z-1 text-blue-700 dark:text-slate-100 text-shadow-sm/100 text-shadow-yellow-300 dark:text-shadow-yellow-800"
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
                            className="inline-block md:hidden text-lg md:text-base font-extrabold italic"
                            title="PCMC Pediatric Blood Center - Mobile Blood Donation Portal"
                        >
                            PCMC PedBC - MBD Portal
                        </h1>
                        <h1 className="hidden md:inline-block text-lg md:text-base font-extrabold italic">
                            PCMC Pediatric Blood Center <br /> Mobile Blood
                            Donation Portal
                        </h1>
                    </Link>
                    <nav>
                        <ul className="flex items-center space-x-4 font-bold text-xl md:text-sm text-shadow-md italic text-shadow">
                            <li className="hidden md:block">
                                <Link
                                    href="/"
                                    className="p-3 hover:ring rounded-xl flex-items-center"
                                >
                                    <Home className="h-4" />
                                    Home
                                </Link>
                            </li>
                            <li className="hidden md:block">
                                <Link
                                    href="#"
                                    className="p-3 hover:ring rounded-xl flex-items-center"
                                >
                                    <Droplet className="h-4" />
                                    Why Donate
                                </Link>
                            </li>
                            <li className="hidden lg:block">
                                <Link
                                    href="#"
                                    className="p-3 hover:ring rounded-xl flex-items-center"
                                >
                                    <Text className="h-4" />
                                    Eligibility Requirements
                                </Link>
                            </li>
                            <li className="hidden xl:block">
                                <Link
                                    href="#"
                                    className="p-3 hover:ring rounded-xl flex-items-center"
                                >
                                    <MdAmpStories className="h-4" />
                                    Success Stories
                                </Link>
                            </li>
                            <li className="hidden xl:block">
                                <Link
                                    href="#"
                                    className="p-3 hover:ring rounded-xl flex-items-center"
                                >
                                    <PhoneCall className="h-4" />
                                    Contact Us
                                </Link>
                            </li>
                            <li className="block xl:hidden">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="h-8 w-min p-0"
                                        >
                                            <span className="sr-only">
                                                Open menu
                                            </span>
                                            <SquareMenu />
                                            <span className="block md:hidden">
                                                Menus
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent
                                        side="bottom"
                                        align="start"
                                    >
                                        <DropdownMenuLabel className="flex items-center gap-2 space-x-2">
                                            <Command className="w-3 h-3" />
                                            Navigate
                                        </DropdownMenuLabel>
                                        {/* <Link href={`/`}> */}
                                        <DropdownMenuItem className="block md:hidden p-3 shadow-xs">
                                            <Link
                                                href="#"
                                                className="w-full hover:ring rounded flex-items-center "
                                            >
                                                <Home className="h-4" />
                                                Home
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="block md:hidden p-3 shadow-xs">
                                            <Link
                                                href="#"
                                                className="w-full hover:ring rounded flex-items-center"
                                            >
                                                <Droplet className="h-4" />
                                                Why Donate
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="block lg:hidden p-3 shadow-xs">
                                            <Link
                                                href="#"
                                                className="w-full hover:ring rounded flex-items-center"
                                            >
                                                <Calendar className="h-4" />
                                                Upcoming Events
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="block xl:hidden p-3 shadow-xs">
                                            <Link
                                                href="#"
                                                className="w-full hover:ring rounded flex-items-center"
                                            >
                                                <MdAmpStories className="h-4" />
                                                Success Stories
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="block xl:hidden p-3 shadow-xs">
                                            <Link
                                                href="#"
                                                className="w-full hover:ring rounded flex-items-center"
                                            >
                                                <PhoneCall className="h-4" />
                                                Contact Us
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </li>
                        </ul>
                    </nav>
                    <div className="hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="h-8 w-min p-0"
                                >
                                    <span className="sr-only">Open menu</span>
                                    <UserCog2Icon /> Developer
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
                                        href="/portal"
                                        className="w-full hover:ring rounded flex-items-center "
                                    >
                                        <Users className="h-4" />
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link
                                        href="/portal/profile"
                                        className="w-full hover:ring rounded flex-items-center "
                                    >
                                        <User className="h-4" />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                {currentUser?.roles &&
                                    currentUser?.roles?.length > 1 && (
                                        <DropdownMenuItem>
                                            <Link
                                                href="/portal/change-role"
                                                className="w-full hover:ring rounded flex-items-center "
                                            >
                                                <FileSliders className="h-4" />
                                                Change Role
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                <DropdownMenuItem>
                                    <Link
                                        href="/portal/admin/users"
                                        className="w-full hover:ring rounded flex-items-center "
                                    >
                                        <Users2Icon className="h-4" />
                                        Users
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link
                                        href="/portal/admin/agencies"
                                        className="w-full hover:ring rounded flex-items-center "
                                    >
                                        <FileSliders className="h-4" />
                                        Agencies
                                    </Link>
                                </DropdownMenuItem>
                                {/* </Link> */}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    {!isLoggedIn ? (
                        <LoginDrawer />
                    ) : (
                        <DropdownMenu className="text-xl">
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
                                    <UserRoundCheck className="w-3 h-3" />
                                    <div className="flex flex-col">
                                        <span>{currentUser.name}</span>
                                        <span className="text-xs font-light">
                                            {currentUser?.role_name}
                                        </span>
                                        <span className="text-xs font-light">
                                            {currentUser.email}
                                        </span>
                                    </div>
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator />

                                <Link href={`/portal`}>
                                    <DropdownMenuItem className="flex items-center space-x-2">
                                        <HomeIcon className="w-4 h-4" />
                                        <span>Dashboard</span>
                                    </DropdownMenuItem>
                                </Link>
                                {currentUser?.roles &&
                                    currentUser?.roles?.length > 1 && (
                                        <Link href="/portal/change-role">
                                            <DropdownMenuItem className="flex items-center space-x-2">
                                                <FileSliders className="w-4 h-4" />
                                                <span>Change Role</span>
                                            </DropdownMenuItem>
                                        </Link>
                                    )}
                                <DropdownMenuItem
                                    className="flex items-center space-x-2"
                                    onClick={handleLogOut}
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Log Out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </header>
        </>
    );
};

export default HeaderNav;
