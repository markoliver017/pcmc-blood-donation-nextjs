"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { ChevronRight, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function StatusCard({
    title,
    value,
    icon: Icon,
    color = "text-blue-600",
    bgColor = "bg-blue-50 dark:bg-blue-900/20",
    description = "",
    trend = null,
    trendValue = null,
    onClick = null,
    badge = null,
    className = "",
}) {
    const getTrendIcon = () => {
        if (!trend) return null;

        switch (trend) {
            case "up":
                return <TrendingUp className="h-4 w-4 text-green-600" />;
            case "down":
                return <TrendingDown className="h-4 w-4 text-red-600" />;
            case "neutral":
                return <Minus className="h-4 w-4 text-gray-600" />;
            default:
                return null;
        }
    };

    const getTrendColor = () => {
        if (!trend) return "text-gray-600";

        switch (trend) {
            case "up":
                return "text-green-600";
            case "down":
                return "text-red-600";
            case "neutral":
                return "text-gray-600";
            default:
                return "text-gray-600";
        }
    };

    const CardWrapper = onClick ? Button : Card;
    const cardProps = onClick
        ? {
              variant: "outline",
              className: `w-full h-full p-0 hover:shadow-md transition-all duration-200 ${className}`,
              onClick,
          }
        : {
              className: `hover:shadow-md transition-shadow duration-200 ${className}`,
          };

    return (
        <CardWrapper {...cardProps}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className="flex items-center gap-2">
                    {badge && (
                        <Badge variant="secondary" className="text-xs">
                            {badge}
                        </Badge>
                    )}
                    <div className={`p-2 rounded-lg ${bgColor}`}>
                        <Icon className={`h-4 w-4 ${color}`} />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="text-2xl font-bold">{value}</div>
                        {description && (
                            <p className="text-xs text-muted-foreground">
                                {description}
                            </p>
                        )}
                        {trend && trendValue && (
                            <div
                                className={`flex items-center gap-1 text-xs ${getTrendColor()}`}
                            >
                                {getTrendIcon()}
                                <span>{trendValue}</span>
                            </div>
                        )}
                    </div>
                    {onClick && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                </div>
            </CardContent>
        </CardWrapper>
    );
}
