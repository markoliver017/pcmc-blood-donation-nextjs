"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function ImageCard({
    title,
    description,
    image,
    imageAlt,
    icon,
    link,
    onClick,
    variant = "default", // "default" | "feature" | "testimonial" | "process"
    size = "medium", // "small" | "medium" | "large"
    className = "",
    showOverlay = true,
    overlayContent = null,
}) {
    const sizeClasses = {
        small: "h-48",
        medium: "h-60",
        large: "h-80",
    };

    const cardClasses = {
        default:
            "bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md group transition-all duration-700 hover:scale-105 hover:shadow-xl hover:ring-2 hover:ring-red-400 dark:hover:ring-red-600 cursor-pointer w-full",
        feature:
            "bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg group transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-blue-400 dark:hover:ring-blue-600 cursor-pointer w-full",
        testimonial:
            "bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md group transition-all duration-700 hover:scale-105 hover:shadow-xl hover:ring-2 hover:ring-green-400 dark:hover:ring-green-600 cursor-pointer w-full",
        process:
            "bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md group transition-all duration-700 hover:scale-105 hover:shadow-xl hover:ring-2 hover:ring-yellow-400 dark:hover:ring-yellow-600 cursor-pointer w-full",
    };

    const iconColors = {
        default: "text-red-500",
        feature: "text-blue-500",
        testimonial: "text-green-500",
        process: "text-yellow-500",
    };

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    const CardContent = () => (
        <motion.div
            className={`${cardClasses[variant]} ${className}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.3 }}
            onClick={handleClick}
        >
            {/* Image Section */}
            <div
                className={`relative ${sizeClasses[size]} w-full flex items-center justify-center`}
            >
                <Image
                    src={image}
                    alt={imageAlt || title}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />

                {/* Icon Overlay */}
                {icon && (
                    <div className="absolute top-4 left-4 z-10">
                        <div
                            className={`inline-flex items-center justify-center h-12 w-12 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-lg ${iconColors[variant]}`}
                        >
                            {icon}
                        </div>
                    </div>
                )}

                {/* Custom Overlay Content */}
                {showOverlay && overlayContent && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                        {overlayContent}
                    </div>
                )}

                {/* Default Overlay for Process Cards */}
                {variant === "process" && showOverlay && !overlayContent && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                        <div className="text-white">
                            <h3 className="text-lg font-bold">{title}</h3>
                        </div>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-4 text-center">
                {/* Title */}
                {variant !== "process" && (
                    <h3 className="text-xl font-bold mb-2 flex items-center justify-center gap-2 text-slate-800 dark:text-white">
                        {title}
                    </h3>
                )}

                {/* Description */}
                {description && (
                    <p className="mb-4 text-slate-600 dark:text-slate-300 text-sm min-h-[48px] leading-relaxed">
                        {description}
                    </p>
                )}

                {/* Action Button for Feature Cards */}
                {variant === "feature" && link && (
                    <Link href={link}>
                        <button className="btn btn-outline btn-primary w-full transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                            Learn More
                        </button>
                    </Link>
                )}

                {/* Custom Action for Other Variants */}
                {variant !== "feature" && link && (
                    <Link href={link}>
                        <button className="btn btn-outline btn-primary w-full transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                            View Details
                        </button>
                    </Link>
                )}
            </div>
        </motion.div>
    );

    // Wrap in Link if link is provided
    if (link) {
        return (
            <Link href={link} className="block">
                <CardContent />
            </Link>
        );
    }

    return <CardContent />;
}
