"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { motion } from "framer-motion";
import Image from "next/image";
import SideNavLink from "./SideNavLink";
import clsx from "clsx";
import { usePagesStore } from "@/store/pagesStore";
import { redirect, usePathname } from "next/navigation";

const Sidebar = ({ currentUser }) => {
    const { status, data } = useSession();
    // console.log("sidebar session data", data);

    if (status == "authenticated") {
        currentUser = data.user;
    }
    const [isCollapsed, setIsCollapsed] = useState(false);
    const menus = usePagesStore((state) => state.pages);
    const currentRoute = usePathname();
    const isAdminRoute = currentRoute.startsWith("/portal");

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (isAdminRoute && status == "unauthenticated") {
        redirect("/");
    }

    if (status != "authenticated") {
        return;
    }

    if (!data?.user?.role_name) {
        return;
    }

    const currentUserAvatar =
        currentUser?.image ||
        (currentUser?.gender == "female"
            ? "https://avatar.iran.liara.run/public/girl"
            : "https://avatar.iran.liara.run/public/boy");

    const handleToggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <motion.aside
            initial={{ width: "290px" }}
            animate={{ width: isCollapsed ? "70px" : "290px" }}
            className="w-64 flex-none h-screen bg-gradient-to-r from-gray-700 to-gray-800 text-white px-4 pt-5 shadow-xl"
        >
            <div className="flex justify-end">
                <button
                    onClick={handleToggleSidebar}
                    className="block p-3 text-right rounded-2xl dark:border-neutral dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                >
                    <GiHamburgerMenu
                        className="inline-block"
                        title="Collapse the left navigation pane"
                    />
                </button>
            </div>
            {/* User Profile */}
            <div
                className={clsx(
                    "flex items-center mt-4 hover:bg-gray-300 truncate hover:text-blue-900 dark:hover:text-blue-200 dark:hover:bg-slate-700 rounded cursor-pointer",
                    !isCollapsed && "p-4"
                )}
            >
                <Image
                    src={currentUserAvatar}
                    className="flex-none rounded-4xl"
                    width={50}
                    height={50}
                    layout="intrinsic"
                    alt="Logo"
                />

                {!isCollapsed && (
                    <div className="ml-2">
                        <h5 className="text-lg font-bold ">
                            {currentUser.name || "Juan Dela Cruz"}
                        </h5>
                        <p className="text-blue-300 truncate w-full overflow-hidden whitespace-nowrap dark:text-slate-200">
                            {currentUser.email}
                        </p>
                    </div>
                )}
            </div>
            <div className="mt-5">
                {!isCollapsed && (
                    <h2 className="text-base text-gray-500 font-bold">
                        Main Navigation
                    </h2>
                )}
                <nav className="mt-4">
                    <ul>
                        {menus.map((menu, index) => (
                            <li key={index} className="mb-2">
                                <SideNavLink
                                    isCollapsed={isCollapsed}
                                    path={menu.path}
                                    Icon={menu.icon}
                                    name={menu.title}
                                    menu={menu}
                                />
                            </li>
                        ))}
                        {/* <li className="mb-2">
                            <SideNavLink
                                isCollapsed={isCollapsed}
                                path="/"
                                Icon={<FaHome />}
                                name="Home"
                            />
                        </li>
                        <li className="mb-2">
                            <a href="#" className="hover:text-gray-400">
                                Reports
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="#" className="hover:text-gray-400">
                                Settings
                            </a>
                        </li>
                        <li className="mb-2">
                            <a href="#" className="hover:text-gray-400">
                                Profile
                            </a>
                        </li> */}
                    </ul>
                </nav>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
