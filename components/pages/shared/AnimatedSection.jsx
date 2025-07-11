"use client";
import { motion } from "framer-motion";
import { forwardRef } from "react";

const AnimatedSection = forwardRef(
    (
        {
            children,
            className = "",
            animation = "fadeInUp", // "fadeInUp" | "fadeInLeft" | "fadeInRight" | "scaleIn" | "slideInUp"
            delay = 0,
            duration = 0.8,
            threshold = 0.2,
            once = true,
            ...props
        },
        ref
    ) => {
        const animations = {
            fadeInUp: {
                initial: { opacity: 0, y: 50 },
                animate: { opacity: 1, y: 0 },
                transition: { duration, delay },
            },
            fadeInLeft: {
                initial: { opacity: 0, x: -50 },
                animate: { opacity: 1, x: 0 },
                transition: { duration, delay },
            },
            fadeInRight: {
                initial: { opacity: 0, x: 50 },
                animate: { opacity: 1, x: 0 },
                transition: { duration, delay },
            },
            scaleIn: {
                initial: { opacity: 0, scale: 0.8 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration, delay },
            },
            slideInUp: {
                initial: { opacity: 0, y: 100 },
                animate: { opacity: 1, y: 0 },
                transition: { duration, delay },
            },
        };

        const selectedAnimation = animations[animation] || animations.fadeInUp;

        return (
            <motion.div
                ref={ref}
                className={className}
                initial={selectedAnimation.initial}
                whileInView={selectedAnimation.animate}
                viewport={{ once, amount: threshold }}
                transition={selectedAnimation.transition}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

AnimatedSection.displayName = "AnimatedSection";

export default AnimatedSection;
