"use client";
import React from "react";
import Breadcrumbs from "./Breadcrumbs";
import { usePagesStore } from "@/store/pagesStore";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function WrapperHead() {
    const { status } = useSession();
    const isLoggedIn = status == "authenticated";

    const pages = usePagesStore((state) => state.pages);
    const pathname = usePathname();
    const currentPage = pages.find((page) => pathname == page.path);
    const pageTitle = currentPage ? currentPage.title : "INMERS Form";

    return (
        <div className="flex-none flex flex-wrap justify-between items-center p-4 shadow">
            <h1
                className="text-3xl font-bold"
                style={{ fontFamily: "var(--font-geist-sans)" }}
            >
                {!isLoggedIn ? "Medication Error Reporting Form" : pageTitle}
            </h1>
            <Breadcrumbs pageData={currentPage} />
        </div>
    );
}
