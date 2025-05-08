"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { usePagesStore } from "@/store/pagesStore";
import { DashboardIcon } from "@radix-ui/react-icons";

const Breadcrumbs = () => {
    const pathname = usePathname(); // Get the current route
    const setBreadcrumbs = usePagesStore((state) => state.setBreadcrumbs);
    const breadcrumbs = usePagesStore((state) => state.breadcrumbs);
    const pages = usePagesStore((state) => state.pages);

    useEffect(() => {
        // Generate breadcrumbs dynamically based on the pathname
        const pathSegments = pathname.split("/").filter(Boolean);
        const generatedBreadcrumbs = pathSegments.map((segment, index) => {
            const path = "/" + pathSegments.slice(0, index + 1).join("/");
            const icon = pages.find((page) => path == page.path)?.icon || (
                <DashboardIcon />
            );

            return {
                title: segment.charAt(0).toUpperCase() + segment.slice(1), // Capitalize segment
                path,
                icon,
            };
        });

        setBreadcrumbs(generatedBreadcrumbs); // Update breadcrumbs in the store
    }, [pathname, setBreadcrumbs]);

    return (
        <nav className="breadcrumbs text-sm">
            <ul>
                {breadcrumbs.map((breadcrumb, index) => (
                    <li key={index}>
                        <a href={breadcrumb.path}>
                            {breadcrumb.icon}
                            {breadcrumb.title}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Breadcrumbs;
