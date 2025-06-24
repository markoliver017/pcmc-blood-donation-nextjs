"use client";
import clsx from "clsx";
import { usePathname } from "next/navigation";
export default function MainWrapper({ children }) {
    let className = "";
    const pathname = usePathname();
    // console.log("Root layout pathname", pathname);
    if (pathname == "/portal" || pathname.startsWith("/portal/change-role")) {
        className =
            "bg-[url('/change-role-bg.jpg')] bg-cover bg-center bg-no-repeat bg-fixed";
    }
    return (
        <div
            id="main-container"
            className={clsx(
                "flex flex-col flex-1 h-screen overflow-y-scroll",
                className
            )}
        >
            {children}
        </div>
    );
}
