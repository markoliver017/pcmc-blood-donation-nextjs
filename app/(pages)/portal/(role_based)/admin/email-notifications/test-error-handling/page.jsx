"use client";

import { useState } from "react";
import { Button } from "@components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { Alert, AlertDescription } from "@components/ui/alert";
import { Badge } from "@components/ui/badge";

export default function TestErrorHandlingPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const testAgencyRegistration = async () => {
        setIsLoading(true);
        setResult(null);
        setError(null);

        try {
            // Simulate agency registration with mock data
            const mockFormData = {
                first_name: "Test",
                last_name: "Agency",
                email: "test.agency@example.com",
                password: "password123",
                confirm_password: "password123",
                name: "Test Blood Bank Agency",
                address: "123 Test Street, Test City",
                contact_number: "9999999999",
                role_ids: [2],
            };

            // This would normally call the storeAgency action
            // For testing, we'll simulate the response
            const response = await fetch("/api/test-agency-registration", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(mockFormData),
            });

            const data = await response.json();

            if (data.success) {
                setResult(data);
            } else {
                setError(data.message || "Registration failed");
            }
        } catch (err) {
            setError("Network error or unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const testNotificationFailure = async () => {
        setIsLoading(true);
        setResult(null);
        setError(null);

        try {
            // Test with invalid email to trigger notification failures
            const mockFormData = {
                first_name: "Test",
                last_name: "Failure",
                email: "invalid-email", // This will cause email sending to fail
                password: "password123",
                confirm_password: "password123",
                name: "Test Failure Agency",
                address: "456 Failure Street, Failure City",
                contact_number: "0987654321",
                role_ids: [2],
            };

            const response = await fetch("/api/test-agency-registration", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(mockFormData),
            });

            const data = await response.json();

            if (data.success) {
                setResult(data);
            } else {
                setError(data.message || "Registration failed");
            }
        } catch (err) {
            setError("Network error or unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">Error Handling Test</h1>
                <p className="text-muted-foreground">
                    Test the improved error handling in agency registration
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Normal Registration</CardTitle>
                        <CardDescription>
                            Test agency registration with valid data
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={testAgencyRegistration}
                            disabled={isLoading}
                            className="w-full"
                        >
                            {isLoading
                                ? "Testing..."
                                : "Test Normal Registration"}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Notification Failure Test</CardTitle>
                        <CardDescription>
                            Test registration with invalid email to trigger
                            notification failures
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={testNotificationFailure}
                            disabled={isLoading}
                            variant="outline"
                            className="w-full"
                        >
                            {isLoading
                                ? "Testing..."
                                : "Test Notification Failures"}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {result && (
                <Alert className="border-green-200 bg-green-50">
                    <AlertDescription>
                        <div className="space-y-2">
                            <p className="font-semibold text-green-800">
                                ✅ Registration Successful!
                            </p>
                            <p className="text-green-700">{result.message}</p>
                            {result.data && (
                                <div className="mt-3 p-3 bg-white rounded border">
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        Registration Data:
                                    </p>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p>
                                            <strong>Agency:</strong>{" "}
                                            {result.data.name}
                                        </p>
                                        <p>
                                            <strong>Email:</strong>{" "}
                                            {result.data.email}
                                        </p>
                                        <p>
                                            <strong>Status:</strong>
                                            <Badge
                                                variant="secondary"
                                                className="ml-2"
                                            >
                                                {result.data.status ||
                                                    "Pending"}
                                            </Badge>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </AlertDescription>
                </Alert>
            )}

            {error && (
                <Alert className="border-red-200 bg-red-50">
                    <AlertDescription>
                        <div className="space-y-2">
                            <p className="font-semibold text-red-800">
                                ❌ Registration Failed
                            </p>
                            <p className="text-red-700">{error}</p>
                        </div>
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>How It Works</CardTitle>
                    <CardDescription>
                        Understanding the improved error handling
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <h4 className="font-semibold">1. Transaction Safety</h4>
                        <p className="text-sm text-muted-foreground">
                            The database transaction is committed immediately
                            after creating the user and agency records. This
                            ensures data integrity even if notifications fail.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-semibold">
                            2. Non-Critical Notifications
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            All notifications and emails are handled as
                            non-critical operations. If they fail, the user
                            still gets a success response.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-semibold">
                            3. Individual Error Handling
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            Each notification operation is wrapped in its own
                            try-catch block. If one fails, others can still
                            succeed.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-semibold">4. Detailed Logging</h4>
                        <p className="text-sm text-muted-foreground">
                            All successes and failures are logged with detailed
                            information for debugging and monitoring purposes.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-semibold">
                            5. Background Processing
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            Notifications are processed in the background using
                            .then() instead of await, so the user gets an
                            immediate response.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
