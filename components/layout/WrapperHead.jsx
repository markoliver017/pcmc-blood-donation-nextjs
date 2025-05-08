"use client";
import React from "react";
import { usePagesStore } from "@/store/pagesStore";
import { usePathname } from "next/navigation";
import Breadcrumbs from "./Breadcrumbs";
import { DashboardIcon } from "@radix-ui/react-icons";

export default function WrapperHead() {
    const pages = usePagesStore((state) => state.pages);
    const pathname = usePathname();
    const currentPage = pages.find((page) => pathname == page.path);
    const pageTitle = currentPage ? currentPage.title : "";

    return (
        <div className="flex-none flex flex-wrap justify-between items-center p-4 shadow">
            <h1
                className="text-3xl font-bold flex-items-center"
                style={{ fontFamily: "var(--font-geist-sans)" }}
            >
                {currentPage?.icon || <DashboardIcon />}
                {pageTitle}
            </h1>
            <Breadcrumbs />
        </div>
    );
}
