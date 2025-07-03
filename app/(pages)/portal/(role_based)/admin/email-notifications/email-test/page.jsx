"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";
import { Send, CheckCircle, XCircle } from "lucide-react";
import notify from "@components/ui/notify";

const EmailTestPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [formData, setFormData] = useState({
        category: "AGENCY_REGISTRATION",
        recipientEmail: "",
        dynamicData: JSON.stringify(
            {
                user_first_name: "John",
                user_last_name: "Doe",
                user_email: "john.doe@example.com",
                user_name: "John Doe",
                agency_name: "Test Agency",
                agency_address: "123 Test Street, Test City",
                system_name: "Blood Donation Management System",
                registration_date: new Date().toLocaleDateString(),
            },
            null,
            2
        ),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setResult(null);

        try {
            const dynamicData = JSON.parse(formData.dynamicData);

            const response = await fetch("/api/email-templates/test-send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    category: formData.category,
                    recipientEmail: formData.recipientEmail,
                    dynamicData: dynamicData,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setResult({ success: true, data });
                notify({
                    error: false,
                    message: "Email sent successfully!",
                });
            } else {
                setResult({ success: false, error: data.error });
                notify({
                    error: true,
                    message: data.error || "Failed to send email",
                });
            }
        } catch (error) {
            console.error("Test email error:", error);
            setResult({ success: false, error: error.message });
            notify({
                error: true,
                message: "Error sending test email",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Email Template Test</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Test Email Sending</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="category">Template Category</Label>
                            <Input
                                id="category"
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        category: e.target.value,
                                    })
                                }
                                placeholder="e.g., AGENCY_REGISTRATION"
                            />
                        </div>

                        <div>
                            <Label htmlFor="recipientEmail">
                                Recipient Email
                            </Label>
                            <Input
                                id="recipientEmail"
                                type="email"
                                value={formData.recipientEmail}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        recipientEmail: e.target.value,
                                    })
                                }
                                placeholder="Enter recipient email"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="dynamicData">
                                Dynamic Data (JSON)
                            </Label>
                            <Textarea
                                id="dynamicData"
                                value={formData.dynamicData}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        dynamicData: e.target.value,
                                    })
                                }
                                placeholder="Enter JSON data for dynamic fields"
                                rows={8}
                            />
                        </div>

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Sending...
                                </div>
                            ) : (
                                <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Send Test Email
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {result && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {result.success ? (
                                <>
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    Email Sent Successfully
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-5 w-5 text-red-500" />
                                    Email Send Failed
                                </>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Test Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">How to Test:</h3>
                            <ol className="list-decimal list-inside space-y-1 text-sm">
                                <li>
                                    Make sure you have an active
                                    AGENCY_REGISTRATION template
                                </li>
                                <li>Enter a valid recipient email address</li>
                                <li>Modify the dynamic data JSON if needed</li>
                                <li>
                                    Click "Send Test Email" to test the template
                                </li>
                                <li>Check the recipient's email inbox</li>
                            </ol>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">
                                Available Dynamic Fields:
                            </h3>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>
                                    <code>user_first_name</code> - User's first
                                    name
                                </li>
                                <li>
                                    <code>user_last_name</code> - User's last
                                    name
                                </li>
                                <li>
                                    <code>user_email</code> - User's email
                                    address
                                </li>
                                <li>
                                    <code>user_name</code> - Full user name
                                </li>
                                <li>
                                    <code>agency_name</code> - Agency name
                                </li>
                                <li>
                                    <code>agency_address</code> - Agency address
                                </li>
                                <li>
                                    <code>system_name</code> - System name
                                </li>
                                <li>
                                    <code>registration_date</code> -
                                    Registration date
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">
                                Expected Behavior:
                            </h3>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Email should be sent using the template</li>
                                <li>
                                    Dynamic fields should be replaced with
                                    actual values
                                </li>
                                <li>
                                    Subject and content should match your
                                    template
                                </li>
                                <li>
                                    Check logs for any errors or success
                                    messages
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default EmailTestPage;
