"use client";
import { usePagesStore } from "@/store/pagesStore";

import { signOut, useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";

import { useEffect, useState } from "react";

const formatTimeLeft = (seconds) => {
    if (seconds === null) return "";
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins =
        String(Math.floor((seconds % 3600) / 60)).padStart(2, "0") + "m";
    const secs = String(seconds % 60).padStart(2, "0") + "s";
    if (hrs === "00") {
        return `${mins} ${secs}`;
    }
    return `${hrs}h ${mins} ${secs}`;
};

export default function ClientPortal({ children }) {
    const { status, data: session, update } = useSession();
    const currentRoute = usePathname();

    const [timeLeft, setTimeLeft] = useState(null);
    const [warningShown, setWarningShown] = useState(false);
    // const [isConfirmed, setIsConfirmed] = useState(false);

    useEffect(() => {
        if (status === "authenticated" && session?.expires) {
            const expiry = new Date(session.expires).getTime();

            const interval = setInterval(() => {
                const now = new Date().getTime();
                const secondsLeft = Math.floor((expiry - now) / 1000);

                setTimeLeft(secondsLeft);

                // Show warning at 10 seconds
                if (secondsLeft == 60 && !warningShown && secondsLeft > 0) {
                    setWarningShown(true);
                    if (!warningShown) {
                        alert(
                            `Your session will expire in ${formatTimeLeft(
                                secondsLeft
                            )}. Refresh your browser to update your session.`
                        );
                    }
                }

                // Redirect to login when expired
                if (secondsLeft <= 0) {
                    clearInterval(interval);

                    // redirect(`/login?callbackUrl=${currentRoute}`);
                    window.location.replace(
                        `/login?callbackUrl=${currentRoute}`
                    );
                }
            }, 30000);

            return () => clearInterval(interval);
        }
    }, [session, status, currentRoute, warningShown]);

    const menus = usePagesStore((state) => state.menus);

    // const currentMenu = menus.find((menu, i) => {
    //     console.log("Client portal menu", i, menu.path);
    //     return menu.path.startsWith(currentRoute);
    // });
    // console.log("Client portal currentMenu", currentMenu);

    if (status == "loading") {
        return null;
    }

    if (status == "unauthenticated") {
        redirect(`/login?callbackUrl=${currentRoute}`);
    }

    if (status == "authenticated") {
        if (!session || !session?.user?.roles?.length) {
            redirect("/");
        }

        const currentUser = session?.user;

        const { roles, role_name: session_role } = currentUser;

        const currentLoggedInRole = roles.find(
            (role) => role.role_name == session_role
        );

        if (!currentLoggedInRole && currentRoute !== "/portal") {
            redirect("/portal");
        }
    }

    return <>{children}</>;
}
