"use client";
import React from "react";
import { ArrowLeft, HomeIcon } from "lucide-react";
import BreadcrumbsMain from "./BreadcrumbsMain";
import Link from "next/link";

export default function WrapperHeadMain({
    icon,
    pageTitle,
    breadcrumbs = [{ path: "/", icon: <HomeIcon />, title: "Home" }],
    allowBackButton = false,
}) {
    return (
        <div className="flex-none flex flex-wrap justify-between items-center p-4 shadow">
            <div className="flex">
                {allowBackButton && (
                    <Link href="/portal/admin/agencies">
                        <button
                            className="rounded btn border-1 p-1"
                            tabIndex={-1}
                        >
                            <ArrowLeft />
                        </button>
                    </Link>
                )}
                <h1
                    className="text-xl md:text-3xl font-bold flex-items-center"
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                >
                    {icon || <HomeIcon />}
                    {pageTitle || "Home"}
                </h1>
            </div>
            <BreadcrumbsMain breadcrumbs={breadcrumbs} />
        </div>
    );
}
