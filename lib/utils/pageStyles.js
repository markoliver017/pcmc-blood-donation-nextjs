// Shared styling utilities for landing pages

// Color scheme matching the existing design system
export const colors = {
    primary: {
        red: "#ef4444",
        blue: "#3b82f6",
        green: "#10b981",
        yellow: "#f59e0b",
    },
    text: {
        primary: "text-slate-900 dark:text-white",
        secondary: "text-slate-600 dark:text-slate-300",
        muted: "text-slate-500 dark:text-slate-400",
    },
    background: {
        primary: "bg-white dark:bg-slate-800",
        secondary: "bg-slate-50 dark:bg-slate-900",
        gradient:
            "bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-900",
    },
};

// Gradient backgrounds
export const gradients = {
    hero: "bg-gradient-to-r from-red-50 via-white to-blue-50 dark:from-red-900 dark:via-slate-900 dark:to-blue-900",
    card: "bg-gradient-to-r from-red-50 to-blue-50 dark:from-red-900 dark:to-blue-900",
    accent: "bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400",
    overlay: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))",
};

// Typography classes
export const typography = {
    h1: "text-4xl sm:text-5xl lg:text-6xl font-extrabold",
    h2: "text-3xl sm:text-4xl font-extrabold",
    h3: "text-2xl sm:text-3xl font-bold",
    h4: "text-xl sm:text-2xl font-bold",
    body: "text-base sm:text-lg",
    small: "text-sm",
    caption: "text-xs",
};

// Spacing utilities
export const spacing = {
    section: "py-16 md:py-20",
    container: "px-4 md:px-6 lg:px-8",
    card: "p-6 md:p-8",
    button: "px-6 py-3",
};

// Border and shadow utilities
export const effects = {
    card: "rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300",
    button: "rounded-lg shadow-md hover:shadow-lg transition-all duration-200",
    image: "rounded-xl overflow-hidden",
};

// Responsive utilities
export const responsive = {
    container: "max-w-screen-xl mx-auto",
    grid: {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    },
};

// Animation classes
export const animations = {
    hover: {
        scale: "hover:scale-105 transition-transform duration-300",
        lift: "hover:-translate-y-1 transition-transform duration-300",
        glow: "hover:shadow-lg hover:shadow-red-500/25 transition-shadow duration-300",
    },
    focus: {
        ring: "focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
        outline: "focus:outline-none focus:ring-2 focus:ring-red-500",
    },
};

// Component-specific styles
export const components = {
    pageHeader: {
        container:
            "relative w-full min-h-[300px] sm:min-h-[400px] flex items-center justify-center mb-16",
        content: "relative z-20 text-center px-4 w-full max-w-4xl mx-auto",
        title: "text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg mb-4",
        subtitle:
            "text-lg sm:text-xl lg:text-2xl text-slate-100 font-medium mb-8 max-w-3xl mx-auto drop-shadow",
    },
    card: {
        base: "bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md group transition-all duration-700 hover:scale-105 hover:shadow-xl",
        content: "p-4 text-center",
        title: "text-xl font-bold mb-2 text-slate-800 dark:text-white",
        description:
            "text-slate-600 dark:text-slate-300 text-sm min-h-[48px] leading-relaxed",
    },
    button: {
        primary:
            "btn btn-primary btn-lg flex items-center gap-2 px-8 py-3 text-lg font-semibold shadow-lg hover:scale-105 transition-transform duration-200",
        secondary:
            "btn btn-outline btn-primary btn-lg px-8 py-3 text-lg font-semibold hover:bg-primary hover:text-white transition-all duration-200",
    },
};

// Utility function to combine classes
export const cn = (...classes) => classes.filter(Boolean).join(" ");

// Page-specific style presets
export const pageStyles = {
    about: {
        hero: {
            background: "/pcmc-building.png",
            title: "About PCMC Pediatric Blood Center",
            subtitle:
                "Saving lives through safe and reliable blood donation services",
        },
    },
    whyDonate: {
        hero: {
            background: "/blood-donation-img1.jpg",
            title: "Why Donate Blood?",
            subtitle: "Because Every Drop Counts—Especially for Children",
        },
    },
    donationProcess: {
        hero: {
            background: "/blood-donation-img-4.jpg",
            title: "Blood Donation Process",
            subtitle: "Simple, Safe, and Life-Saving",
        },
    },
    eligibility: {
        hero: {
            background: "/blood-donation-img-2.jpg",
            title: "Eligibility Requirements",
            subtitle: "Make Sure You're Ready to Help Save a Child's Life",
        },
    },
    successStories: {
        hero: {
            background: "/blood-donation-img-3.jpg",
            title: "Success Stories",
            subtitle: "Real Stories of Hope and Healing",
        },
    },
    contact: {
        hero: {
            background: "/pcmc-hospital-bg.jpg",
            title: "Contact Us",
            subtitle: "Have questions? We're here to help!",
        },
    },
};
