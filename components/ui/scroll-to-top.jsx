"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@components/ui/button";
import { ChevronUp } from "lucide-react";
import { cn } from "@lib/utils";

export default function ScrollToTop({
    containerRef,
    className,
    threshold = 100,
    position = "bottom-right",
    size = "default",
    variant = "default",
    ...props
}) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const container = containerRef?.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            setIsVisible(scrollTop > threshold);
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [containerRef, threshold]);

    const scrollToTop = () => {
        if (containerRef?.current) {
            containerRef.current.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    };

    const positionClasses = {
        "bottom-right": "bottom-4 right-4",
        "bottom-left": "bottom-4 left-4",
        "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
        "top-right": "top-4 right-4",
        "top-left": "top-4 left-4",
        "center-right": "top-1/2 right-4 -translate-y-1/2",
        "center-left": "top-1/2 left-4 -translate-y-1/2",
        "center-center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        "center-top": "top-4 left-1/2 -translate-x-1/2",
    };

    const sizeClasses = {
        sm: "h-8 w-8",
        default: "h-12 w-12",
        lg: "h-14 w-14",
    };

    if (!isVisible) return null;

    return (
        <Button
            variant={variant}
            size="icon"
            onClick={scrollToTop}
            className={cn(
                "fixed z-50 rounded-full shadow-lg transition-all duration-200 hover:scale-115",
                positionClasses[position],
                sizeClasses[size],
                className
            )}
            {...props}
        >
            <ChevronUp className="h-4 w-4" />
            <span className="sr-only">Scroll to top</span>
        </Button>
    );
}
