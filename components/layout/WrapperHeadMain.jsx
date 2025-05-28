"use client";
import React from "react";
import { HomeIcon } from "lucide-react";
import BreadcrumbsMain from "./BreadcrumbsMain";

export default function WrapperHeadMain({
    icon,
    pageTitle,
    breadcrumbs = [{ path: "/", icon: <HomeIcon />, title: "Home" }],
}) {
    return (
        <div className="flex-none flex flex-wrap justify-between items-center p-4 shadow">
            <h1
                className="text-3xl font-bold flex-items-center"
                style={{ fontFamily: "var(--font-geist-sans)" }}
            >
                {icon || <HomeIcon />}
                {pageTitle || "Home"}
            </h1>
            <BreadcrumbsMain breadcrumbs={breadcrumbs} />
        </div>
    );
}
