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
import { useQuery } from "@tanstack/react-query";
import { getEmailTemplates } from "@action/emailTemplateAction";

export default function DashboardTestPage() {
    const [testResults, setTestResults] = useState({});

    // Test fetching templates
    const {
        data: templates,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["emailTemplates"],
        queryFn: getEmailTemplates,
    });

    const runTests = () => {
        const results = {};

        // Test 1: Check if templates are loaded
        results.templatesLoaded =
            !isLoading && !error && Array.isArray(templates?.data);
        results.templatesCount = templates?.data?.length || 0;

        // Test 2: Check if templates have required fields
        if (templates?.data && templates.data.length > 0) {
            const sampleTemplate = templates.data[0];
            results.hasRequiredFields = !!(
                sampleTemplate.id &&
                sampleTemplate.name &&
                sampleTemplate.category &&
                sampleTemplate.subject &&
                sampleTemplate.html_content
            );
            results.sampleTemplate = sampleTemplate;
        }

        // Test 3: Check categories
        if (templates?.data && templates.data.length > 0) {
            const categories = [
                ...new Set(templates.data.map((t) => t.category)),
            ];
            results.categories = categories;
            results.hasValidCategories = categories.every((cat) =>
                [
                    "AGENCY_REGISTRATION",
                    "AGENCY_APPROVAL",
                    "DONOR_REGISTRATION",
                    "DONOR_APPROVAL",
                    "EVENT_CREATION",
                    "APPOINTMENT_BOOKING",
                    "BLOOD_COLLECTION",
                    "SYSTEM_NOTIFICATION",
                    "GENERAL",
                ].includes(cat)
            );
        }

        // Test 4: Check active templates
        if (templates?.data) {
            const activeTemplates = templates.data.filter((t) => t.is_active);
            results.activeTemplates = activeTemplates.length;
            results.inactiveTemplates =
                templates.data.length - activeTemplates.length;
        }

        setTestResults(results);
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">
                    Dashboard Integration Test
                </h1>
                <p className="text-muted-foreground">
                    Test the email notification dashboard integration
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Test Controls</CardTitle>
                        <CardDescription>
                            Run tests to verify dashboard functionality
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button onClick={runTests} className="w-full">
                            Run Dashboard Tests
                        </Button>

                        <div className="space-y-2">
                            <h4 className="font-semibold">Current Status:</h4>
                            <div className="space-y-1 text-sm">
                                <p>
                                    <strong>Loading:</strong>{" "}
                                    {isLoading ? "Yes" : "No"}
                                </p>
                                <p>
                                    <strong>Error:</strong>{" "}
                                    {error ? "Yes" : "No"}
                                </p>
                                <p>
                                    <strong>Templates Count:</strong>{" "}
                                    {templates?.data?.length || 0}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Test Results</CardTitle>
                        <CardDescription>
                            Results from the latest test run
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {Object.keys(testResults).length === 0 ? (
                            <p className="text-muted-foreground">
                                No tests run yet
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {/* Templates Loaded Test */}
                                <div className="flex items-center justify-between p-3 border rounded">
                                    <span>Templates Loaded</span>
                                    <Badge
                                        variant={
                                            testResults.templatesLoaded
                                                ? "default"
                                                : "destructive"
                                        }
                                    >
                                        {testResults.templatesLoaded
                                            ? "✅ Pass"
                                            : "❌ Fail"}
                                    </Badge>
                                </div>

                                {/* Required Fields Test */}
                                {testResults.hasRequiredFields !==
                                    undefined && (
                                    <div className="flex items-center justify-between p-3 border rounded">
                                        <span>Required Fields Present</span>
                                        <Badge
                                            variant={
                                                testResults.hasRequiredFields
                                                    ? "default"
                                                    : "destructive"
                                            }
                                        >
                                            {testResults.hasRequiredFields
                                                ? "✅ Pass"
                                                : "❌ Fail"}
                                        </Badge>
                                    </div>
                                )}

                                {/* Categories Test */}
                                {testResults.hasValidCategories !==
                                    undefined && (
                                    <div className="flex items-center justify-between p-3 border rounded">
                                        <span>Valid Categories</span>
                                        <Badge
                                            variant={
                                                testResults.hasValidCategories
                                                    ? "default"
                                                    : "destructive"
                                            }
                                        >
                                            {testResults.hasValidCategories
                                                ? "✅ Pass"
                                                : "❌ Fail"}
                                        </Badge>
                                    </div>
                                )}

                                {/* Statistics */}
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold">
                                            {testResults.templatesCount || 0}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Total Templates
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold">
                                            {testResults.activeTemplates || 0}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Active Templates
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Sample Template Display */}
            {testResults.sampleTemplate && (
                <Card>
                    <CardHeader>
                        <CardTitle>Sample Template</CardTitle>
                        <CardDescription>
                            Example of a template from the database
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div>
                                <strong>Name:</strong>{" "}
                                {testResults.sampleTemplate.name}
                            </div>
                            <div>
                                <strong>Category:</strong>
                                <Badge variant="outline" className="ml-2">
                                    {testResults.sampleTemplate.category}
                                </Badge>
                            </div>
                            <div>
                                <strong>Subject:</strong>{" "}
                                {testResults.sampleTemplate.subject}
                            </div>
                            <div>
                                <strong>Status:</strong>
                                <Badge
                                    variant={
                                        testResults.sampleTemplate.is_active
                                            ? "default"
                                            : "secondary"
                                    }
                                    className="ml-2"
                                >
                                    {testResults.sampleTemplate.is_active
                                        ? "Active"
                                        : "Inactive"}
                                </Badge>
                            </div>
                            <div>
                                <strong>Content Preview:</strong>
                                <div className="mt-2 p-3 bg-muted rounded text-sm max-h-32 overflow-y-auto">
                                    {testResults.sampleTemplate.html_content.substring(
                                        0,
                                        200
                                    )}
                                    ...
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Categories Display */}
            {testResults.categories && (
                <Card>
                    <CardHeader>
                        <CardTitle>Available Categories</CardTitle>
                        <CardDescription>
                            Categories found in the templates
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {testResults.categories.map((category) => (
                                <Badge key={category} variant="outline">
                                    {category.replace(/_/g, " ")}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Navigation */}
            <Card>
                <CardHeader>
                    <CardTitle>Next Steps</CardTitle>
                    <CardDescription>
                        Navigate to the main dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <Button asChild>
                            <a href="/portal/admin/email-notifications">
                                Go to Main Dashboard
                            </a>
                        </Button>
                        <Button variant="outline" asChild>
                            <a href="/portal/admin/email-notifications/form-test">
                                Test Template Form
                            </a>
                        </Button>
                        <Button variant="outline" asChild>
                            <a href="/portal/admin/email-notifications/email-test">
                                Test Email Sending
                            </a>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
