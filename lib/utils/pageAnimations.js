// Shared animation variants for landing pages

// Basic animation variants
export const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 },
};

export const fadeInLeft = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8 },
};

export const fadeInRight = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8 },
};

export const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6 },
};

export const slideInUp = {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 },
};

// Staggered animations for lists/grids
export const staggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

export const staggerItem = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
};

// Page header animations
export const pageHeaderAnimations = {
    container: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.8 },
    },
    breadcrumbs: {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay: 0.2 },
    },
    title: {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, delay: 0.3 },
    },
    subtitle: {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, delay: 0.4 },
    },
    decorativeLine: {
        initial: { opacity: 0, scaleX: 0 },
        animate: { opacity: 1, scaleX: 1 },
        transition: { duration: 0.8, delay: 0.5 },
    },
};

// Card animations
export const cardAnimations = {
    container: {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
    },
    hover: {
        scale: 1.05,
        transition: { duration: 0.3 },
    },
};

// Button animations
export const buttonAnimations = {
    hover: {
        scale: 1.05,
        transition: { duration: 0.2 },
    },
    tap: {
        scale: 0.95,
        transition: { duration: 0.1 },
    },
};

// Section animations
export const sectionAnimations = {
    container: {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8 },
    },
    content: {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay: 0.2 },
    },
};

// Timeline animations
export const timelineAnimations = {
    container: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.8 },
    },
    item: {
        initial: { opacity: 0, x: -50 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6 },
    },
};

// Statistics counter animations
export const counterAnimations = {
    container: {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.6 },
    },
    number: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: 0.2 },
    },
};

// Image animations
export const imageAnimations = {
    container: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.8 },
    },
    hover: {
        scale: 1.05,
        transition: { duration: 0.3 },
    },
};

// Text animations
export const textAnimations = {
    title: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
    },
    body: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay: 0.1 },
    },
};

// Utility functions for animation timing
export const getStaggerDelay = (index, baseDelay = 0.1) => ({
    delay: baseDelay * index,
});

export const getSequentialDelay = (index, baseDelay = 0.2) => ({
    delay: baseDelay * index,
});

// Viewport options for animations
export const viewportOptions = {
    once: true,
    amount: 0.2,
    margin: "0px 0px -100px 0px",
};

// Animation presets for common use cases
export const animationPresets = {
    hero: {
        container: pageHeaderAnimations.container,
        title: pageHeaderAnimations.title,
        subtitle: pageHeaderAnimations.subtitle,
    },
    grid: {
        container: staggerContainer,
        item: staggerItem,
    },
    card: {
        container: cardAnimations.container,
        hover: cardAnimations.hover,
    },
    section: {
        container: sectionAnimations.container,
        content: sectionAnimations.content,
    },
};
