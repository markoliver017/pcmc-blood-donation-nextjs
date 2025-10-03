import { Badge } from "@components/ui/badge";

/**
 * Category badge component with color coding
 * @param {Object} props
 * @param {string} props.category - FAQ category
 * @param {string} props.className - Additional CSS classes
 */
export default function FaqCategoryBadge({ category, className = "" }) {
    const categoryConfig = {
        general: {
            label: "General",
            variant: "secondary",
            className: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
        },
        donation_process: {
            label: "Donation Process",
            variant: "default",
            className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        },
        eligibility: {
            label: "Eligibility",
            variant: "default",
            className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        },
        health_safety: {
            label: "Health & Safety",
            variant: "destructive",
            className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        },
        appointments: {
            label: "Appointments",
            variant: "default",
            className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        },
        account: {
            label: "Account",
            variant: "default",
            className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        },
        blood_types: {
            label: "Blood Types",
            variant: "default",
            className: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
        },
        after_donation: {
            label: "After Donation",
            variant: "default",
            className: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
        },
    };

    const config = categoryConfig[category] || categoryConfig.general;

    return (
        <Badge
            variant={config.variant}
            className={`${config.className} ${className}`}
        >
            {config.label}
        </Badge>
    );
}
