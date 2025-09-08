"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import React, { useState } from "react";
import { CircleChevronDown, CircleChevronRight } from "lucide-react";
import { filterUrlWithDotSlash } from "@lib/utils/string.utils";

export default function SideNavLink({
    isCollapsed,
    menu,
    currentRoleUrl,
    callback = () => {},
}) {
    const currentRoute = usePathname();
    const [dropdownOpen, setDropdownOpen] = useState({});
    const { path: menu_path, icon, title } = menu;

    const path = menu.is_role_based
        ? currentRoleUrl + filterUrlWithDotSlash(menu_path)
        : `/portal${filterUrlWithDotSlash(menu_path)}`;

    const handleDropdownToggle = () => {
        setDropdownOpen((prevState) => ({
            ...prevState,
            [path]: !prevState[path],
        }));
    };

    if (menu.has_child) {
        return (
            <>
                <Link
                    href="#"
                    className={clsx(
                        "flex items-center gap-5 p-2 rounded text-xl shadow-sm",
                        isCollapsed && "justify-center",
                        currentRoute === path
                            ? "text-blue-700 bg-gray-200 font-semibold dark:text-blue-800 dark:bg-slate-200 hover:bg-gray-300"
                            : "text-slate-200 hover:bg-gray-200 hover:text-blue-700 dark:hover:text-blue-100 dark:hover:bg-gray-700"
                    )}
                    onClick={handleDropdownToggle}
                >
                    {icon}
                    {!isCollapsed && (
                        <>
                            <span className="flex-1 text-base truncate">
                                {title}
                            </span>
                            {dropdownOpen[path] ? (
                                <CircleChevronDown className="w-4" />
                            ) : (
                                <CircleChevronRight className="w-4" />
                            )}
                        </>
                    )}
                </Link>
                <ul
                    className={clsx(
                        "transition-all duration-300",
                        dropdownOpen[path]
                            ? "max-h-screen opacity-100"
                            : "max-h-0 opacity-0 pointer-events-none",
                        !isCollapsed && "ml-5"
                    )}
                >
                    {menu.child.map((m, i) => (
                        <li key={i} className="mt-2">
                            <Link
                                href={m.path}
                                className={clsx(
                                    "flex items-center gap-5 p-2 rounded text-xl shadow-sm",
                                    isCollapsed && "justify-center",
                                    currentRoute === m.path
                                        ? "text-blue-700 bg-gray-200 font-semibold dark:text-blue-800 dark:bg-slate-200 hover:bg-gray-300"
                                        : "text-slate-200 hover:bg-gray-200 hover:text-blue-700 dark:hover:text-blue-100 dark:hover:bg-gray-700"
                                )}
                                onClick={() => {
                                    setDropdownOpen({
                                        ...dropdownOpen,
                                        dropdown: !dropdownOpen["dropdown"],
                                    });
                                    callback();
                                }}
                            >
                                {m.icon}
                                {!isCollapsed && <span>{m.title}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </>
        );
    } else {
        return (
            <Link
                href={path}
                className={clsx(
                    "flex items-center gap-5 p-2 rounded text-xl shadow-sm",
                    isCollapsed && "justify-center",
                    currentRoute === path
                        ? "text-blue-700 bg-gray-200 font-semibold dark:text-blue-800 dark:bg-slate-200 hover:bg-gray-300"
                        : "text-slate-200 hover:bg-gray-200 hover:text-blue-700 dark:hover:text-blue-100 dark:hover:bg-gray-700"
                )}
                onClick={callback}
            >
                {icon}
                {!isCollapsed && <span>{title}</span>}
            </Link>
        );
    }
}
