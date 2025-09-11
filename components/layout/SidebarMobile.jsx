"use client";
import { useSession } from "next-auth/react";
import { GiHamburgerMenu } from "react-icons/gi";

import SideNavLink from "./SideNavLink";

import { usePagesStore } from "@/store/pagesStore";
import { usePathname } from "next/navigation";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@components/ui/popover";
import Image from "next/image";
import { useState } from "react";

const SidebarMobile = ({ currentUser }) => {
    const { status, data } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    if (status == "authenticated") {
        currentUser = data.user;
    }
    const menus = usePagesStore((state) => state.menus);
    const currentRoute = usePathname();
    const isAdminRoute = currentRoute.startsWith("/portal");

    if (status != "authenticated" || !isAdminRoute) {
        return;
    }

    if (!data?.user?.role_name || !data?.user?.roles.length) {
        return;
    }

    const currentRole = currentUser?.roles.find(
        (role) => role.role_name == currentUser.role_name
    );

    if (!currentRole) return;

    const currentRoleMenus = menus.filter((menu) =>
        menu.roles.includes(currentRole.role_name)
    );

    const currentUserAvatar = currentUser?.image || "/default_avatar.png";

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger className="md:hidden px-5">
                <div className="flex items-center gap-2">
                    <GiHamburgerMenu title="Collapse the left navigation pane" />
                    <span>Account Menu</span>
                </div>
            </PopoverTrigger>
            <PopoverContent className="max-h-[calc(100vh-56px)] overflow-y-auto ">
                <div className="flex flex-col gap-5 mb-10">
                    {/* User Profile */}
                    <div className="flex items-center mt-4 hover:bg-gray-500 truncate rounded cursor-pointer group transition ">
                        <Image
                            src={currentUserAvatar}
                            className="flex-none rounded-4xl transform transition-transform duration-300 group-hover:scale-120"
                            width={50}
                            height={50}
                            layout="intrinsic"
                            alt="Logo"
                            unoptimized={
                                process.env.NEXT_PUBLIC_NODE_ENV ===
                                "production"
                            }
                        />

                        <div className="ml-2 transform transition-transform duration-300 group-hover:font-bold">
                            <h5 className="text-lg font-bold transform transition-transform duration-300 group-hover:text-2xl">
                                {currentUser.name || "Juan Dela Cruz"}
                            </h5>
                            <p className="text-slate-700 truncate w-full overflow-hidden whitespace-nowrap dark:text-slate-200">
                                {currentRole?.role_name || "Donor"}
                            </p>
                            <p className="text-blue-400 truncate w-full overflow-hidden whitespace-nowrap dark:text-slate-200">
                                {currentUser.email}
                            </p>
                        </div>
                    </div>
                    <h2 className="text-base text-gray-500 font-bold">
                        Main Navigation
                    </h2>

                    <nav>
                        <ul>
                            {currentRoleMenus.map((menu, index) => (
                                <li key={index} className="mb-2">
                                    <SideNavLink
                                        isCollapsed={false}
                                        menu={menu}
                                        currentRoleUrl={
                                            currentRole?.url || "/portal/donors"
                                        }
                                        callback={() => setIsOpen(false)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default SidebarMobile;
