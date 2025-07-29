import { Card } from "@components/ui/card";
import Skeleton from "./skeleton";

/**
 * DataTableSkeleton component for loading state
 * @param {Object} props - Component props
 * @param {number} props.rows - Number of skeleton rows to display
 * @param {number} props.columns - Number of skeleton columns to display
 * @returns {JSX.Element} DataTableSkeleton component
 */
export default function DataTableSkeleton({ rows = 5, columns = 8 }) {
    return (
        <Card className="w-full">
            <div className="p-4">
                {/* Table header skeleton */}
                <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-8 w-64" />
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                    </div>
                </div>

                {/* Search and filter skeleton */}
                <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-10 w-80" />
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>

                {/* Table skeleton */}
                <div className="rounded-md border">
                    {/* Header row */}
                    <div className="flex items-center border-b bg-muted/50 p-4">
                        {Array.from({ length: columns }).map((_, index) => (
                            <div key={index} className="flex-1 px-2">
                                <Skeleton className="h-4 w-full" />
                            </div>
                        ))}
                    </div>

                    {/* Data rows */}
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <div
                            key={rowIndex}
                            className="flex items-center border-b p-4"
                        >
                            {Array.from({ length: columns }).map(
                                (_, colIndex) => (
                                    <div key={colIndex} className="flex-1 px-2">
                                        {colIndex === 0 ? (
                                            // ID column
                                            <Skeleton className="h-4 w-12" />
                                        ) : colIndex === 1 ? (
                                            // Avatar column
                                            <Skeleton className="h-12 w-12 rounded-full" />
                                        ) : colIndex === 2 ? (
                                            // Name column
                                            <Skeleton className="h-4 w-32" />
                                        ) : colIndex === columns - 2 ? (
                                            // Status column
                                            <Skeleton className="h-6 w-20 rounded-full" />
                                        ) : colIndex === columns - 1 ? (
                                            // Actions column
                                            <Skeleton className="h-8 w-8 rounded" />
                                        ) : (
                                            // Regular columns
                                            <Skeleton className="h-4 w-24" />
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                    ))}
                </div>

                {/* Pagination skeleton */}
                <div className="flex items-center justify-between mt-4">
                    <Skeleton className="h-4 w-40" />
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-20" />
                    </div>
                </div>
            </div>
        </Card>
    );
}
