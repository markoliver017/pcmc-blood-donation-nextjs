"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Progress } from "@components/ui/progress";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { Mail, Users, Calendar, TrendingUp, TrendingDown } from "lucide-react";

export default function EmailTemplateAnalytics({ templates = [] }) {
    // Calculate analytics
    const totalTemplates = templates.length;
    const activeTemplates = templates.filter((t) => t.is_active).length;
    const inactiveTemplates = totalTemplates - activeTemplates;

    // Category distribution
    const categoryCounts = templates.reduce((acc, template) => {
        acc[template.category] = (acc[template.category] || 0) + 1;
        return acc;
    }, {});

    const categoryData = Object.entries(categoryCounts).map(
        ([category, count]) => ({
            name: category.replace(/_/g, " "),
            value: count,
            category: category,
        })
    );

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentTemplates = templates.filter(
        (template) => new Date(template.updatedAt) > sevenDaysAgo
    );

    // Template status distribution
    const statusData = [
        { name: "Active", value: activeTemplates, color: "#10b981" },
        { name: "Inactive", value: inactiveTemplates, color: "#6b7280" },
    ];

    // Get category badge color
    const getCategoryBadgeVariant = (category) => {
        const variants = {
            AGENCY_REGISTRATION: "default",
            AGENCY_APPROVAL: "secondary",
            DONOR_REGISTRATION: "outline",
            DONOR_APPROVAL: "destructive",
            EVENT_CREATION: "default",
            APPOINTMENT_BOOKING: "secondary",
            BLOOD_COLLECTION: "outline",
            SYSTEM_NOTIFICATION: "destructive",
            GENERAL: "default",
        };
        return variants[category] || "default";
    };

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total Templates
                                </p>
                                <p className="text-2xl font-bold">
                                    {totalTemplates}
                                </p>
                            </div>
                            <Mail className="h-8 w-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Active Templates
                                </p>
                                <p className="text-2xl font-bold">
                                    {activeTemplates}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {totalTemplates > 0
                                        ? `${(
                                              (activeTemplates /
                                                  totalTemplates) *
                                              100
                                          ).toFixed(1)}%`
                                        : "0%"}
                                </p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Categories
                                </p>
                                <p className="text-2xl font-bold">
                                    {Object.keys(categoryCounts).length}
                                </p>
                            </div>
                            <Users className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Recent Updates
                                </p>
                                <p className="text-2xl font-bold">
                                    {recentTemplates.length}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Last 7 days
                                </p>
                            </div>
                            <Calendar className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
            </div> */}

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Template Categories</CardTitle>
                        <CardDescription>
                            Distribution of templates by category
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={categoryData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="name"
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                        fontSize={12}
                                    />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#3b82f6" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-64 text-muted-foreground">
                                No templates available
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Status Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Template Status</CardTitle>
                        <CardDescription>
                            Active vs Inactive templates
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {statusData.some((item) => item.value > 0) ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) =>
                                            `${name} ${(percent * 100).toFixed(
                                                0
                                            )}%`
                                        }
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-64 text-muted-foreground">
                                No templates available
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Category Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Category Breakdown</CardTitle>
                    <CardDescription>
                        Detailed view of templates by category
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Object.entries(categoryCounts).map(
                            ([category, count]) => {
                                const percentage =
                                    totalTemplates > 0
                                        ? (count / totalTemplates) * 100
                                        : 0;
                                return (
                                    <div key={category} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant={getCategoryBadgeVariant(
                                                        category
                                                    )}
                                                >
                                                    {category.replace(
                                                        /_/g,
                                                        " "
                                                    )}
                                                </Badge>
                                                <span className="text-sm font-medium">
                                                    {count} templates
                                                </span>
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                {percentage.toFixed(1)}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={percentage}
                                            className="h-2"
                                        />
                                    </div>
                                );
                            }
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            {recentTemplates.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Templates updated in the last 7 days
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentTemplates.slice(0, 5).map((template) => (
                                <div
                                    key={template.id}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {template.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {template.category.replace(
                                                /_/g,
                                                " "
                                            )}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">
                                            {new Date(
                                                template.updatedAt
                                            ).toLocaleDateString()}
                                        </p>
                                        <Badge
                                            variant={
                                                template.is_active
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {template.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
