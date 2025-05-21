"use client";
import { X } from "lucide-react";
import { signOut } from "next-auth/react";
import React, { use, useState } from "react";

export default function NewOrganizerForm({ role }) {
    const user_role = use(role);
    const [isLoading, setIsLoading] = useState(false);

    const handleCancelReg = () => {
        setIsLoading(true);
        signOut({ callbackUrl: "/register/organizers" });
    };
    return (
        <div>
            <button
                onClick={handleCancelReg}
                className="btn bg-black text-white border-black hover:bg-neutral-800 hover:text-green-300"
            >
                {isLoading ? (
                    "Signing out..."
                ) : (
                    <>
                        <X />
                        Cancel Registration
                    </>
                )}
            </button>
        </div>
    );
}
