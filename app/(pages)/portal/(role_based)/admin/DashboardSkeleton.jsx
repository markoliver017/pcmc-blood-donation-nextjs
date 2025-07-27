import React from 'react';

export default function DashboardSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Metrics Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="card bg-base-200">
                        <div className="card-body items-center text-center">
                            <div className="skeleton h-8 w-3/4 mb-2"></div>
                            <div className="skeleton h-4 w-1/2 mb-4"></div>
                            <div className="skeleton h-12 w-20 mb-4"></div>
                            <div className="skeleton h-10 w-28"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Section Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar Skeleton */}
                <div className="lg:col-span-2 card bg-base-200">
                    <div className="card-body">
                        <div className="skeleton h-8 w-1/3 mb-4"></div>
                        <div className="skeleton h-96 w-full"></div>
                    </div>
                </div>

                {/* Action Panel Skeleton */}
                <div className="card bg-base-200">
                    <div className="card-body">
                        <div className="skeleton h-8 w-1/2 mb-6"></div>
                        <div className="space-y-4">
                            <div className="skeleton h-10 w-full"></div>
                            <div className="skeleton h-24 w-full"></div>
                        </div>
                        <div className="divider"></div>
                        <div className="space-y-4">
                            <div className="skeleton h-10 w-full"></div>
                            <div className="skeleton h-24 w-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
