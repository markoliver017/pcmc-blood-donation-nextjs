"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

/**
 * A container that displays scroll indicators and fades if content is scrollable.
 * @param {object} props
 * @param {React.ReactNode} props.children - The content to be rendered inside the container.
 * @param {string} [props.maxHeight="40rem"] - The maximum height of the container (e.g., "40rem", "640px").
 * @param {string} [props.className=""] - Additional classes for the scrollable div.
 */
const ScrollableContainer = ({
    children,
    maxHeight = "40rem",
    className = "",
}) => {
    const scrollRef = useRef(null);
    const [showTopShadow, setShowTopShadow] = useState(false);
    const [showBottomShadow, setShowBottomShadow] = useState(false);

    const handleScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;

        const isScrollable = el.scrollHeight > el.clientHeight;
        if (!isScrollable) {
            setShowTopShadow(false);
            setShowBottomShadow(false);
            return;
        }

        const isAtTop = el.scrollTop < 5;
        const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 5;

        setShowTopShadow(!isAtTop);
        setShowBottomShadow(!isAtBottom);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        // Run check on initial mount and when children change
        handleScroll();

        const resizeObserver = new ResizeObserver(handleScroll);
        resizeObserver.observe(el);
        el.addEventListener("scroll", handleScroll);

        return () => {
            resizeObserver.disconnect();
            el.removeEventListener("scroll", handleScroll);
        };
    }, [children, handleScroll]);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.clientHeight * 0.8;
            scrollRef.current.scrollBy({
                top: direction === "up" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="relative">
            <div
                ref={scrollRef}
                className={`overflow-y-auto ${className}`}
                style={{ maxHeight }}
            >
                {children}
            </div>

            {/* Top Shadow & Arrow */}
            <div
                className={`absolute top-0 left-0 right-0 h-10 bg-gray-200/80 dark:bg-gray-800 bg-gradient-to-b from-background to-transparent pointer-events-none transition-opacity duration-300 z-10 ${
                    showTopShadow ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden="true"
            />
            <button
                onClick={() => scroll("up")}
                className={`absolute top-1 left-1/2 -translate-x-1/2 z-20 bg-secondary/70 text-secondary-foreground rounded-full p-1 backdrop-blur-sm transition-opacity duration-300 hover:bg-secondary ${
                    showTopShadow
                        ? "opacity-100"
                        : "opacity-0 pointer-events-auto"
                }`}
                aria-label="Scroll up"
            >
                <ChevronUp className="h-5 w-5" />
            </button>

            {/* Bottom Shadow & Arrow */}
            <div
                className={`absolute bottom-0 left-0 right-0 h-10 bg-gray-200/80 dark:bg-gray-800 bg-gradient-to-t from-background to-transparent pointer-events-none transition-opacity duration-300 z-10 ${
                    showBottomShadow ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden="true"
            />
            <button
                onClick={() => scroll("down")}
                className={`absolute bottom-1 left-1/2 -translate-x-1/2 z-20 bg-secondary/70 text-secondary-foreground rounded-full p-1 backdrop-blur-sm transition-opacity duration-300 hover:bg-secondary ${
                    showBottomShadow
                        ? "opacity-100"
                        : "opacity-0 pointer-events-auto"
                }`}
                aria-label="Scroll down"
            >
                <ChevronDown className="h-5 w-5" />
            </button>
        </div>
    );
};

export default ScrollableContainer;
