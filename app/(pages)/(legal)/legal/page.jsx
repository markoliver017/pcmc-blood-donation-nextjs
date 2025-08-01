import { Suspense } from "react";
import LegalTabs from "./LegalTabs";

export default function LegalPage() {
    return (
        <div className="max-w-5xl mx-auto my-5 px-2 md:px-5 py-10 shadow-lg/90 dark:shadow-gray-500">
            <h1 className="text-3xl font-bold mb-6">Legal Information</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <LegalTabs />
            </Suspense>
        </div>
    );
}
