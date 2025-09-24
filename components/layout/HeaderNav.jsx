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
    Droplet,
    Home,
    Info,
    LogOut,
    MenuIcon,
    PhoneCall,
    SquareMenu,
    Text,
    TextSelect,
    UserRoundCheck,
} from "lucide-react";
import SweetAlert from "@components/ui/SweetAlert";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import CustomAvatar from "@components/reusable_components/CustomAvatar";
import { MdAmpStories, MdEmail } from "react-icons/md";
import NotificationComponent from "./NotificationComponent";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { PiUserSwitchBold } from "react-icons/pi";
import SidebarMobile from "./SidebarMobile";
import { DashboardIcon } from "@radix-ui/react-icons";
import OnlineUsers from "@components/pages/shared/OnlineUsers";

const HeaderNav = ({ currentUser }) => {
    let isLoggedIn = false;
    const { status, data } = useSession();
    const pathname = usePathname();
    const router = useRouter();

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
            <header className="sticky top-0 z-40 flex-none border-b border-gray-200 dark:border-slate-700 p-2 shadow-lg bg-gradient-to-b from-blue-50/80 via-white/90 to-blue-100/80 dark:from-sky-900 dark:via-slate-900 dark:to-sky-800/80 backdrop-blur-md rounded-b-2xl transition-all duration-300 overflow-x-hidden">
                <div className=" flex-1 min-w-0 overflow-x-auto flex justify-between md:justify-evenly items-center min-h-[70px]">
                    <Link
                        href="/"
                        className="shrink-0 flex gap-2 items-center rounded-xl p-2 z-1 text-blue-700 dark:text-slate-100 text-shadow-sm/100 text-shadow-yellow-300 dark:text-shadow-yellow-800 hover:bg-blue-100/60 dark:hover:bg-sky-900/40 transition-colors duration-200"
                    >
                        <Image
                            src="/pcmc_logo.png"
                            width={64}
                            height={64}
                            alt="PCMC Pediatric Blood Center - Mobile Blood Donation Portal"
                            title="PCMC Pediatric Blood Center - Mobile Blood Donation Portal"
                            className="w-8 h-8 sm:w-16 sm:h-16 rounded-full border-2 border-blue-200 dark:border-sky-700 shadow-md bg-white"
                        />
                        <div className="flex flex-col justify-center">
                            <h1 className="inline-block md:hidden text-xs md:text-base font-extrabold italic leading-tight">
                                PCMC PedBC MBD Portal
                            </h1>
                            <h1 className="hidden md:inline-block text-lg md:text-base font-extrabold italic leading-tight">
                                PCMC Pediatric Blood Center <br />{" "}
                                <span className="font-normal">
                                    Mobile Blood Donation Portal
                                </span>
                            </h1>
                        </div>
                    </Link>
                    <nav>
                        <ul className="flex flex-nowrap whitespace-nowrap items-center justify-center md:space-x-4 font-bold text-base md:text-sm text-shadow-md italic text-shadow">
                            <li className="hidden md:block">
                                <Link
                                    href="/"
                                    className={clsx(
                                        "p-3 rounded-xl flex items-center gap-1 hover:bg-blue-200/60 dark:hover:bg-sky-900/40 focus-visible:ring-2 focus-visible:ring-blue-400 transition-all duration-200",
                                        pathname === "/" && "bg-blue-200/50"
                                    )}
                                >
                                    <Home className="h-4" />
                                    Home
                                </Link>
                            </li>
                            <li className="hidden lg:block">
                                <Link
                                    href="/about-us"
                                    className={clsx(
                                        "p-3 rounded-xl flex items-center gap-1 hover:bg-blue-200/60 dark:hover:bg-sky-900/40 focus-visible:ring-2 focus-visible:ring-blue-400 transition-all duration-200",
                                        pathname === "/about-us" &&
                                            "bg-blue-200/50"
                                    )}
                                >
                                    <Info className="h-4" />
                                    About Us
                                </Link>
                            </li>
                            <li className="hidden lg:block">
                                <Link
                                    href="/why-donate"
                                    className={clsx(
                                        "p-3 rounded-xl flex items-center gap-1 hover:bg-blue-200/60 dark:hover:bg-sky-900/40 focus-visible:ring-2 focus-visible:ring-blue-400 transition-all duration-200",
                                        pathname === "/why-donate" &&
                                            "bg-blue-200/50"
                                    )}
                                >
                                    <Droplet className="h-4" />
                                    Why Donate
                                </Link>
                            </li>
                            <li className="hidden 2xl:block">
                                <Link
                                    href="/donation-process"
                                    className={clsx(
                                        "p-3 rounded-xl flex items-center gap-1 hover:bg-blue-200/60 dark:hover:bg-sky-900/40 focus-visible:ring-2 focus-visible:ring-blue-400 transition-all duration-200",
                                        pathname === "/donation-process" &&
                                            "bg-blue-200/50"
                                    )}
                                >
                                    <Text className="h-4" />
                                    Donation Process
                                </Link>
                            </li>
                            <li className="hidden 2xl:block">
                                <Link
                                    href="/eligibility-requirements"
                                    className={clsx(
                                        "p-3 rounded-xl flex items-center gap-1 hover:bg-blue-200/60 dark:hover:bg-sky-900/40 focus-visible:ring-2 focus-visible:ring-blue-400 transition-all duration-200",
                                        pathname ===
                                            "/eligibility-requirements" &&
                                            "bg-blue-200/50"
                                    )}
                                >
                                    <Text className="h-4" />
                                    Eligibility Requirements
                                </Link>
                            </li>
                            {/* <li className="hidden 2xl:block">
                                <Link
                                    href="/success-stories"
                                    className={clsx(
                                        "p-3 rounded-xl flex items-center gap-1 hover:bg-blue-200/60 dark:hover:bg-sky-900/40 focus-visible:ring-2 focus-visible:ring-blue-400 transition-all duration-200",
                                        pathname === "/success-stories" &&
                                            "bg-blue-200/50"
                                    )}
                                >
                                    <MdAmpStories className="h-4" />
                                    Success Stories
                                </Link>
                            </li> */}
                            <li className="hidden 2xl:block">
                                <Link
                                    href="/contact-us"
                                    className={clsx(
                                        "p-3 rounded-xl flex items-center gap-1 hover:bg-blue-200/60 dark:hover:bg-sky-900/40 focus-visible:ring-2 focus-visible:ring-blue-400 transition-all duration-200",
                                        pathname === "/contact-us" &&
                                            "bg-blue-200/50"
                                    )}
                                >
                                    <PhoneCall className="h-4" />
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-8 w-min p-0 2xl:hidden"
                            >
                                <span className="sr-only">Open menu</span>
                                <SquareMenu />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            side="bottom"
                            align="start"
                            className="rounded-xl shadow-lg bg-white dark:bg-slate-900 border border-blue-200 dark:border-sky-800"
                        >
                            <DropdownMenuLabel className="flex items-center gap-2 space-x-2 py-2">
                                <Command className="w-3 h-3" />
                                Navigate
                            </DropdownMenuLabel>
                            {/* <Link href={`/`}> */}
                            <DropdownMenuItem
                                className={clsx(
                                    "block md:hidden p-3 shadow-xs",
                                    pathname === "/" && "bg-blue-400/50"
                                )}
                                onClick={() => router.push("/")}
                            >
                                <span className="w-full rounded flex items-center gap-1 hover:bg-blue-100/60 dark:hover:bg-sky-900/40">
                                    <Home className="h-4" />
                                    Home
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className={clsx(
                                    "block lg:hidden p-3 shadow-xs ",
                                    pathname === "/about-us" && "bg-blue-400/50"
                                )}
                                onClick={() => router.push("/about-us")}
                            >
                                <span className="w-full rounded flex items-center gap-1 hover:bg-blue-100/60 dark:hover:bg-sky-900/40">
                                    <TextSelect className="h-4" />
                                    About Us
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className={clsx(
                                    "block lg:hidden p-3 shadow-xs ",
                                    pathname === "/why-donate" &&
                                        "bg-blue-400/50"
                                )}
                                onClick={() => router.push("/why-donate")}
                            >
                                <span className="w-full rounded flex items-center gap-1 hover:bg-blue-100/60 dark:hover:bg-sky-900/40">
                                    <Droplet className="h-4" />
                                    Why Donate
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className={clsx(
                                    "block 2xl:hidden p-3 shadow-xs ",
                                    pathname === "/donation-process" &&
                                        "bg-blue-400/50"
                                )}
                                onClick={() => router.push("/donation-process")}
                            >
                                <span className="w-full rounded flex items-center gap-1 hover:bg-blue-100/60 dark:hover:bg-sky-900/40">
                                    <Text className="h-4" />
                                    Donation Process
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className={clsx(
                                    "block 2xl:hidden p-3 shadow-xs ",
                                    pathname === "/eligibility-requirements" &&
                                        "bg-blue-400/50"
                                )}
                                onClick={() =>
                                    router.push("/eligibility-requirements")
                                }
                            >
                                <span className="w-full rounded flex items-center gap-1 hover:bg-blue-100/60 dark:hover:bg-sky-900/40">
                                    <Text className="h-4" />
                                    Eligibility Requirements
                                </span>
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem
                                            className={clsx(
                                                "block 2xl:hidden p-3 shadow-xs ",
                                                pathname ===
                                                    "/success-stories" &&
                                                    "bg-blue-400/50"
                                            )}
                                        >
                                            <Link
                                                href="/success-stories"
                                                className="w-full rounded flex items-center gap-1 hover:bg-blue-100/60 dark:hover:bg-sky-900/40"
                                            >
                                                <MdAmpStories className="h-4" />
                                                Success Stories
                                            </Link>
                                        </DropdownMenuItem> */}
                            <DropdownMenuItem
                                className={clsx(
                                    "block 2xl:hidden p-3 shadow-xs ",
                                    pathname === "/contact-us" &&
                                        "bg-blue-400/50"
                                )}
                                onClick={() => router.push("/contact-us")}
                            >
                                <span className="w-full rounded flex items-center gap-1 hover:bg-blue-100/60 dark:hover:bg-sky-900/40">
                                    <PhoneCall className="h-4" />
                                    Contact Us
                                </span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {!isLoggedIn ? (
                        <LoginDrawer />
                    ) : (
                        <div className="flex items-center justify-center gap-3">
                            <NotificationComponent />
                            <OnlineUsers />
                            <DropdownMenu className="text-xl">
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="h-12 w-12 p-0 rounded-full"
                                    >
                                        <span className="sr-only">
                                            Open menu
                                        </span>

                                        <CustomAvatar
                                            avatar={
                                                currentUser?.image ||
                                                "/default_avatar.png"
                                            }
                                            className="w-8 h-8"
                                        />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-92 px-5"
                                >
                                    <DropdownMenuLabel className="flex items-center space-x-2 text-lg">
                                        <UserRoundCheck className="w-3 h-3" />
                                        <div className="flex flex-col">
                                            <span>{currentUser.name}</span>
                                            <span className="font-light">
                                                {currentUser?.role_name}
                                            </span>
                                            <span className="font-light">
                                                {currentUser.email}
                                            </span>
                                        </div>
                                    </DropdownMenuLabel>

                                    <DropdownMenuSeparator />

                                    <Link href={`/portal`}>
                                        <DropdownMenuItem className="flex items-center space-x-2 text-lg">
                                            <DashboardIcon className="w-4 h-4" />
                                            <span>Dashboard</span>
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link href="/">
                                        <DropdownMenuItem className="flex items-center space-x-2 text-lg">
                                            <Home className="w-4 h-4" />
                                            <span>Home</span>
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link href="/about-us">
                                        <DropdownMenuItem className="flex items-center space-x-2 text-lg">
                                            <TextSelect className="w-4 h-4" />
                                            <span>About Us</span>
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuSeparator />
                                    {currentUser?.roles &&
                                        currentUser?.roles?.length > 1 && (
                                            <Link href="/portal/change-role">
                                                <DropdownMenuItem className="flex items-center gap-2 space-x-2 text-lg">
                                                    <PiUserSwitchBold className="h-4" />
                                                    Switch Role
                                                </DropdownMenuItem>
                                            </Link>
                                        )}
                                    <DropdownMenuItem
                                        className="flex items-center space-x-2 text-lg"
                                        onClick={handleLogOut}
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Log Out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>
                <div className="flex items-center">
                    <SidebarMobile currentUser={currentUser} />
                </div>
            </header>
        </>
    );
};

export default HeaderNav;
