"use client";
import { useState } from "react";

export default function useRegistration() {
    const [openRegister, setOpenRegister] = useState(false);

    const openRegistration = () => {
        setOpenRegister(true);
    };

    const closeRegistration = () => {
        setOpenRegister(false);
    };

    return {
        openRegister,
        openRegistration,
        closeRegistration,
        setOpenRegister,
    };
}
