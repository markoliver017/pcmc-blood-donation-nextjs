"use client";

import React from "react";
import { Loader2, Heart, Droplets } from "lucide-react";
import { cn } from "@lib/utils";

const LoadingSpinner = ({ size = "default", className }) => {
    const sizeClasses = {
        sm: "w-4 h-4",
        default: "w-6 h-6",
        lg: "w-8 h-8",
        xl: "w-12 h-12",
    };

    return (
        <Loader2
            className={cn(
                "animate-spin text-blue-600 dark:text-blue-400",
                sizeClasses[size],
                className
            )}
        />
    );
};

const LoadingDots = ({ className }) => (
    <div className={cn("flex space-x-1", className)}>
        {[0, 1, 2].map((i) => (
            <div
                key={i}
                className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
            />
        ))}
    </div>
);

const LoadingPulse = ({ className }) => (
    <div className={cn("flex space-x-2", className)}>
        <div className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse" />
        <div
            className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
        />
        <div
            className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
        />
    </div>
);

const LoadingHeart = ({ className }) => (
    <Heart
        className={cn(
            "animate-pulse text-red-500 dark:text-red-400 w-6 h-6",
            className
        )}
    />
);

const LoadingDroplets = ({ className }) => (
    <Droplets
        className={cn(
            "animate-bounce text-blue-600 dark:text-blue-400 w-6 h-6",
            className
        )}
    />
);

const LoadingSkeleton = ({ className, lines = 3, height = "h-4" }) => (
    <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
            <div
                key={i}
                className={cn(
                    "bg-gray-200 dark:bg-gray-700 rounded animate-pulse",
                    height,
                    i === lines - 1 ? "w-3/4" : "w-full"
                )}
            />
        ))}
    </div>
);

const LoadingCard = ({ className, title = "Loading..." }) => (
    <div
        className={cn(
            "flex flex-col items-center justify-center p-8 space-y-4",
            "bg-white dark:bg-gray-800 rounded-lg shadow-sm border",
            className
        )}
    >
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 dark:text-gray-400 text-sm">{title}</p>
    </div>
);

const LoadingOverlay = ({ className, message = "Loading..." }) => (
    <div
        className={cn(
            "fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50",
            className
        )}
    >
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex flex-col items-center space-y-3">
                <LoadingSpinner size="lg" />
                <p className="text-gray-600 dark:text-gray-400">{message}</p>
            </div>
        </div>
    </div>
);

const LoadingInline = ({ className, text = "Loading..." }) => (
    <div className={cn("flex items-center space-x-2", className)}>
        <LoadingSpinner size="sm" />
        <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>
    </div>
);

export {
    LoadingSpinner,
    LoadingDots,
    LoadingPulse,
    LoadingHeart,
    LoadingDroplets,
    LoadingSkeleton,
    LoadingCard,
    LoadingOverlay,
    LoadingInline,
};
