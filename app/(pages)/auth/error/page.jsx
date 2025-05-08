"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation';


export default function AuthErrorPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const error = searchParams?.error;

    if (error === 'OAuthAccountNotLinked') {
        return (
            <div>
                <h1>Error: Account Not Linked</h1>
                <p>
                    This email is already associated with another account. Please sign in with your existing account (e.g., GitHub or credentials) and link this provider from your account settings.
                </p>
                <button onClick={() => router.push('/')}>
                    Go to Sign In
                </button>
                <button onClick={() => router.push('/auth/link-provider')}>
                    Link Provider
                </button>
            </div>
        );
    }

    return (
        <div>
            <h1>Authentication Error</h1>
            <p>An error occurred: {error}</p>
            <button onClick={() => router.push('/')}>
                Back to Sign In
            </button>
        </div>
    );
}
