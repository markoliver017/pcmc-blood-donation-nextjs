"use client";

import { useState } from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";

const ApiTestPage = () => {
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState(false);

    const testEndpoints = [
        {
            name: "Test Route",
            url: "/api/email-templates/test",
            method: "GET",
            description: "Test basic functionality",
        },
        {
            name: "Simple Test",
            url: "/api/email-templates/test-simple",
            method: "GET",
            description: "Test model without associations",
        },
        {
            name: "List Templates",
            url: "/api/email-templates",
            method: "GET",
            description: "Get all templates",
        },
        {
            name: "Preview Template",
            url: "/api/email-templates/preview",
            method: "POST",
            description: "Preview template with sample data",
            body: {
                template: {
                    subject: "Test Subject",
                    html_content:
                        "<p>Hello <strong>{{user_name}}</strong>!</p>",
                    text_content: "Hello {{user_name}}!",
                },
                sampleData: {
                    user_name: "John Doe",
                    system_name: "PCMC Pediatric Blood Center",
                },
            },
        },
    ];

    const runTest = async (endpoint) => {
        setLoading(true);
        try {
            const options = {
                method: endpoint.method,
                headers: {
                    "Content-Type": "application/json",
                },
            };

            if (endpoint.body) {
                options.body = JSON.stringify(endpoint.body);
            }

            const response = await fetch(endpoint.url, options);
            const data = await response.json();

            setResults((prev) => ({
                ...prev,
                [endpoint.name]: {
                    success: response.ok,
                    status: response.status,
                    data: data,
                    error: !response.ok ? data.error : null,
                },
            }));
        } catch (error) {
            setResults((prev) => ({
                ...prev,
                [endpoint.name]: {
                    success: false,
                    error: error.message,
                    data: null,
                },
            }));
        } finally {
            setLoading(false);
        }
    };

    const runAllTests = async () => {
        setLoading(true);
        for (const endpoint of testEndpoints) {
            await runTest(endpoint);
        }
        setLoading(false);
    };

    const clearResults = () => {
        setResults({});
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">API Test Page</h1>
                <div className="flex items-center space-x-2">
                    <Button onClick={runAllTests} disabled={loading}>
                        {loading ? "Running Tests..." : "Run All Tests"}
                    </Button>
                    <Button variant="outline" onClick={clearResults}>
                        Clear Results
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Test Endpoints */}
                <Card>
                    <CardHeader>
                        <CardTitle>Test Endpoints</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {testEndpoints.map((endpoint) => (
                            <div
                                key={endpoint.name}
                                className="border rounded-lg p-4"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold">
                                        {endpoint.name}
                                    </h3>
                                    <Button
                                        size="sm"
                                        onClick={() => runTest(endpoint)}
                                        disabled={loading}
                                    >
                                        Test
                                    </Button>
                                </div>
                                <div className="text-sm space-y-1">
                                    <p>
                                        <strong>URL:</strong> {endpoint.url}
                                    </p>
                                    <p>
                                        <strong>Method:</strong>{" "}
                                        {endpoint.method}
                                    </p>
                                    <p>
                                        <strong>Description:</strong>{" "}
                                        {endpoint.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Results */}
                <Card>
                    <CardHeader>
                        <CardTitle>Test Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Object.keys(results).length === 0 ? (
                            <p className="text-gray-500">
                                No tests run yet. Click "Run All Tests" to
                                start.
                            </p>
                        ) : (
                            Object.entries(results).map(([name, result]) => (
                                <div
                                    key={name}
                                    className="border rounded-lg p-4"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold">
                                            {name}
                                        </h3>
                                        <Badge
                                            variant={
                                                result.success
                                                    ? "default"
                                                    : "destructive"
                                            }
                                        >
                                            {result.success ? "PASS" : "FAIL"}
                                        </Badge>
                                    </div>
                                    <div className="text-sm space-y-1">
                                        {result.status && (
                                            <p>
                                                <strong>Status:</strong>{" "}
                                                {result.status}
                                            </p>
                                        )}
                                        {result.error && (
                                            <p className="text-red-600">
                                                <strong>Error:</strong>{" "}
                                                {result.error}
                                            </p>
                                        )}
                                        {result.data && (
                                            <div>
                                                <p>
                                                    <strong>Response:</strong>
                                                </p>
                                                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                                                    {JSON.stringify(
                                                        result.data,
                                                        null,
                                                        2
                                                    )}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Summary */}
            {Object.keys(results).length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Test Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {Object.keys(results).length}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Total Tests
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-600">
                                    {
                                        Object.values(results).filter(
                                            (r) => r.success
                                        ).length
                                    }
                                </div>
                                <div className="text-sm text-gray-600">
                                    Passed
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-red-600">
                                    {
                                        Object.values(results).filter(
                                            (r) => !r.success
                                        ).length
                                    }
                                </div>
                                <div className="text-sm text-gray-600">
                                    Failed
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ApiTestPage;
