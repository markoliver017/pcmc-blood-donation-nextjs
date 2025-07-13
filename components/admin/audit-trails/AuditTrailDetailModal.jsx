"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAuditTrailById } from "@/action/auditTrailAction";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Separator } from "@components/ui/separator";
import { ScrollArea } from "@components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { 
    Calendar, 
    User, 
    Activity, 
    AlertTriangle, 
    CheckCircle, 
    Globe, 
    Monitor,
    X,
    Copy,
    ExternalLink
} from "lucide-react";
import notify from "@components/ui/notify";
import LoadingModal from "@components/layout/LoadingModal";

export default function AuditTrailDetailModal({ 
    isOpen, 
    onClose, 
    auditTrailId 
}) {
    const [copiedField, setCopiedField] = useState(null);

    // Fetch audit trail details
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["audit-trail-detail", auditTrailId],
        queryFn: () => fetchAuditTrailById({ id: auditTrailId }),
        enabled: isOpen && !!auditTrailId,
    });

    const auditTrail = data?.success ? data.data : null;

    const copyToClipboard = async (text, fieldName) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(fieldName);
            notify({ success: true, message: `${fieldName} copied to clipboard` });
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            notify({ error: true, message: "Failed to copy to clipboard" });
        }
    };

    const formatJson = (jsonString) => {
        try {
            const parsed = JSON.parse(jsonString);
            return JSON.stringify(parsed, null, 2);
        } catch {
            return jsonString;
        }
    };

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        });
    };

    if (isError && error?.message) {
        notify({ error: true, message: error.message });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-bold">
                            Audit Trail Details
                        </DialogTitle>
                        {/* <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                        >
                            <X className="h-4 w-4" />
                        </Button> */}
                    </div>
                </DialogHeader>

                <LoadingModal isLoading={isLoading} />

                {auditTrail && (
                    <ScrollArea className="h-[calc(90vh-120px)]">
                        <div className="space-y-6 p-1">
                            {/* Status Badge */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Status:</span>
                                <Badge 
                                    variant={auditTrail.is_error ? "destructive" : "default"}
                                    className="flex items-center gap-1"
                                >
                                    {auditTrail.is_error ? (
                                        <>
                                            <AlertTriangle className="h-3 w-3" />
                                            Error
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="h-3 w-3" />
                                            Success
                                        </>
                                    )}
                                </Badge>
                            </div>

                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Activity className="h-5 w-5" />
                                        Basic Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Calendar className="h-4 w-4" />
                                                Timestamp
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {formatTimestamp(auditTrail.createdAt)}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <User className="h-4 w-4" />
                                                User
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {auditTrail.user ? (
                                                    <div className="flex items-center gap-2">
                                                        <span>
                                                            {auditTrail.user.first_name} {auditTrail.user.last_name}
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => copyToClipboard(auditTrail.user.email, "Email")}
                                                        >
                                                            <Copy className={`h-3 w-3 ${copiedField === "Email" ? "text-green-500" : ""}`} />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    "Unknown User"
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="text-sm font-medium">Controller</div>
                                            <div className="text-sm text-muted-foreground">
                                                {auditTrail.controller || "N/A"}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="text-sm font-medium">Action</div>
                                            <div className="text-sm text-muted-foreground">
                                                {auditTrail.action || "N/A"}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Network Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Globe className="h-5 w-5" />
                                        Network Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="text-sm font-medium">IP Address</div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-muted-foreground">
                                                    {auditTrail.ip_address || "N/A"}
                                                </span>
                                                {auditTrail.ip_address && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => copyToClipboard(auditTrail.ip_address, "IP Address")}
                                                    >
                                                        <Copy className={`h-3 w-3 ${copiedField === "IP Address" ? "text-green-500" : ""}`} />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="text-sm font-medium">User Agent</div>
                                            <div className="text-sm text-muted-foreground break-all">
                                                {auditTrail.user_agent || "N/A"}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Details */}
                            {auditTrail.details && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Details</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="bg-muted p-4 rounded-md">
                                            <pre className="text-sm whitespace-pre-wrap break-words">
                                                {auditTrail.details}
                                            </pre>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Stack Trace */}
                            {auditTrail.stack_trace && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Monitor className="h-5 w-5" />
                                            Stack Trace
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="bg-muted p-4 rounded-md">
                                            <pre className="text-sm whitespace-pre-wrap break-words text-red-600">
                                                {auditTrail.stack_trace}
                                            </pre>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Metadata */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Metadata</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium">ID:</span> {auditTrail.id}
                                        </div>
                                        <div>
                                            <span className="font-medium">User ID:</span> {auditTrail.user_id || "N/A"}
                                        </div>
                                        <div>
                                            <span className="font-medium">Created:</span> {formatTimestamp(auditTrail.createdAt)}
                                        </div>
                                        <div>
                                            <span className="font-medium">Updated:</span> {formatTimestamp(auditTrail.updatedAt)}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </ScrollArea>
                )}

                {!isLoading && !auditTrail && !isError && (
                    <div className="text-center py-8 text-muted-foreground">
                        No audit trail details found.
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
} 