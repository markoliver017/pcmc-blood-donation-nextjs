import { auth } from "@lib/auth";
import { Suspense } from "react";
import LandingPage from "./LandingPage";

export default function Page() {
    const session = auth();
    console.log(session);
    // const { data: session, status } = useSession();
    // if (status === "loading") return <p>Loading...</p>;
    // if (!session) return <p>You are not signed in.</p>;

    return (
        <Suspense fallback={<Skeleton />}>
            <LandingPage />
        </Suspense>
    );
}
