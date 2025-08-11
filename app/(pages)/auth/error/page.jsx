"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import AuthErrorClient from "./AuthErrorClient";

import { Suspense } from "react";

function Search() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const error = searchParams?.get("error") || "An unexpected error occurred.";

    if (error === "OAuthAccountNotLinked") {
        return (
            <div>
                <h1>Error: Account Not Linked</h1>
                <p>
                    This email is already associated with another account.
                    Please sign in with your existing account (e.g., GitHub or
                    credentials) and link this provider from your account
                    settings.
                </p>
                <button onClick={() => router.push("/")}>Go to Sign In</button>
                <button onClick={() => router.push("/auth/link-provider")}>
                    Link Provider
                </button>
            </div>
        );
    }

    return <AuthErrorClient message={error} />;
}

export default function AuthErrorPage() {
    return (
        <Suspense>
            <Search />
        </Suspense>
    );
}
