"use client";

import Link from "next/link";

const BreadcrumbsMain = ({ breadcrumbs }) => {
    return (
        <nav className="breadcrumbs text-sm">
            <ul>
                {breadcrumbs.map((breadcrumb, index) => (
                    <li key={index}>
                        <Link href={breadcrumb?.path}>
                            {breadcrumb?.icon}
                            {breadcrumb?.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default BreadcrumbsMain;
