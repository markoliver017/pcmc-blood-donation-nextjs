// components/Providers.js
"use client"; // Mark this as a Client Component

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from "react";
import { GiOpenBook } from "react-icons/gi";
import { GrPowerShutdown } from "react-icons/gr";

export default function TansactProviders({ children }) {
    const [queryClient] = useState(() => new QueryClient());
    const [isOpen, setIsOpen] = useState(true)

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <div className="flex justify-end">
                <button
                    className="btn btn-ghost w-max"
                    onClick={() => setIsOpen(!isOpen)}
                >{isOpen ? <GrPowerShutdown /> : <GiOpenBook />} Devtools</button>
            </div>
            {isOpen && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    );
}