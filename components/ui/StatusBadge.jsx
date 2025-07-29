import { cn } from "@lib/utils";

/**
 * StatusBadge component for displaying appointment status with appropriate styling
 * @param {Object} props - Component props
 * @param {string} props.status - The appointment status
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} StatusBadge component
 */
export default function StatusBadge({ status, className }) {
    const getStatusConfig = (status) => {
        const normalizedStatus = status?.toLowerCase();

        switch (normalizedStatus) {
            case "registered":
                return {
                    label: "REGISTERED",
                    className: "badge-info text-blue-800 bg-blue-100",
                };
            case "examined":
                return {
                    label: "EXAMINED",
                    className: "badge-warning text-yellow-800 bg-yellow-100",
                };
            case "collected":
                return {
                    label: "COLLECTED",
                    className: "badge-success text-green-800 bg-green-100",
                };
            case "cancelled":
                return {
                    label: "CANCELLED",
                    className: "badge-error text-red-800 bg-red-100",
                };
            case "deferred":
                return {
                    label: "DEFERRED",
                    className: "badge-warning text-orange-800 bg-orange-100",
                };
            case "no show":
                return {
                    label: "NO SHOW",
                    className: "badge-error text-red-800 bg-red-100",
                };
            default:
                return {
                    label: status?.toUpperCase() || "UNKNOWN",
                    className: "badge-secondary text-gray-800 bg-gray-100",
                };
        }
    };

    const config = getStatusConfig(status);

    return (
        <div
            className={cn(
                "badge p-2 font-semibold text-xs border-0",
                config.className,
                className
            )}
        >
            {config.label}
        </div>
    );
}
