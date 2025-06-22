"use client";

import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";

export default function AuthErrorClient({ error = "Authentication Error", message }) {
    const router = useRouter();

    return (
        <>
            <div className=" flex justify-center min-h-[calc(100vh-185px)] items-center bg-gray-200 dark:bg-gray-900 px-4 bg-[url('/401-error.png')] bg-no-repeat bg-center bg-cover">
                <div
                    className="absolute inset-0 bg-[url('/401-error.png')] bg-no-repeat bg-center bg-cover pointer-events-none z-0 shadow-2xl rounded"
                    aria-hidden="true"
                />
                <Card className="w-full max-w-lg shadow-2xl border border-red-300 dark:border-red-200 my-10 z-1">
                    <CardHeader className="text-center">
                        <CardTitle className="flex items-center justify-center text-red-600 dark:text-red-400 text-xl gap-2">
                            <AlertCircle className="h-6 w-6" />
                            Authentication Error
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 p-4 rounded-md border border-red-300 dark:border-red-600 text-sm text-center">
                            <p>
                                <span className="font-semibold">
                                    Error Code:
                                </span>{" "}
                                {error}
                            </p>
                            <p className="mt-1">{message}</p>
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={() => router.replace("/")}
                                className="inline-flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                            >
                                ← Go Back
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
