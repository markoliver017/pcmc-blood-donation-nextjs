// "use client";

import { useState } from "react";
import ReportForm from "./ReportForm";
import Terms from "./Terms";

export default async function LandingPage() {
    const url = new URL(`/api/error_types`, "http://localhost:3000");
    const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
    });
    const error_types = await response.json();
    console.log(error_types);

    const [isAccepted, setIsAccepted] = useState(false);
    const [isProceedForm, setIsProceedForm] = useState(false);

    return (
        <div className="flex justify-center items-center">
            {isProceedForm === false ? (
                <Terms
                    isAccepted={isAccepted}
                    setIsAccepted={setIsAccepted}
                    setIsProceedForm={setIsProceedForm}
                />
            ) : (
                <ReportForm setIsProceedForm={setIsProceedForm} />
            )}
        </div>
    );
}
