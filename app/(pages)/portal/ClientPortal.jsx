"use client";
import { usePagesStore } from "@/store/pagesStore";
import notify from "@components/ui/notify";
import SweetAlert from "@components/ui/SweetAlert";
import { format } from "date-fns";

import { signOut, useSession } from "next-auth/react";
import { redirect, usePathname, useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

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

export default function ClientPortal() {
    const { status, data: session, update } = useSession();
    const currentRoute = usePathname();
    const router = useRouter();

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
                    redirect(`/login?callbackUrl=${currentRoute}`);
                }
            }, 30000);

            return () => clearInterval(interval);
        }
    }, [session, status, currentRoute, warningShown]);

    // console.log("Client portal status", status);
    // console.log("Client portal session data", session);

    const menus = usePagesStore((state) => state.menus);

    // const currentMenu = menus.find((menu, i) => {
    //     console.log("Client portal menu", i, menu.path);
    //     return menu.path.startsWith(currentRoute);
    // });
    // console.log("Client portal currentMenu", currentMenu);

    if (status == "loading") {
        return <div>Loading...</div>;
    }

    if (status == "unauthenticated") {
        redirect(`/login?callbackUrl=${currentRoute}`);
    }

    if (status == "authenticated") {
        if (
            !session ||
            !session?.user?.roles?.length
        ) {
            alert("You are not allowed to access this page.");
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

        // console.log("Client portal currentUser", currentUser);

        // const currentRole = roles.find(
        //     (role) => role.role_name == currentUser.role_name
        // );

        // console.log("Client portal currentRole", currentRole);

        // const isUserAllowed = roles.find((role) => {
        //     if (!role?.url) return false;
        //     let roleUrl = role.url.startsWith(".")
        //         ? role.url.slice(1)
        //         : role.url;
        //     return currentRoute.startsWith(roleUrl);
        // });

        // if (!isUserAllowed) {
        //     // alert("You are not allowed to access this page.");
        //     redirect("/portal");
        // }

        // return (
        //     <pre>
        //         CurrentRoute: {currentRoute} <br />
        //         IsUserAllowed: {JSON.stringify(currentRole, null, 3)}
        //     </pre>
        // );
    }

    // return (
    //     <>
    //         <span>Status: {status} </span>
    //         <span>Current Route: {currentRoute} </span>

    //         <p>
    //             Time Left: <strong>{formatTimeLeft(timeLeft)}</strong>
    //         </p>
    //     </>
    // );
}
