"use client";

import { Star, StarHalf } from "lucide-react";

const StarRating = ({ rating = 0, totalStars = 5 }) => {
    const getStarColor = () => {
        if (rating >= 4) return "text-green-500";
        if (rating >= 3) return "text-yellow-500";
        if (rating >= 2) return "text-orange-500";
        if (rating > 0) return "text-red-500";
        return "text-gray-300";
    };

    const color = getStarColor();

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= totalStars; i++) {
            if (i <= rating) {
                // Full star
                stars.push(<Star key={i} className={`h-5 w-5 ${color}`} fill="currentColor" />);
            } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
                // Half star
                stars.push(<StarHalf key={i} className={`h-5 w-5 ${color}`} fill="currentColor" />);
            } else {
                // Empty star
                stars.push(<Star key={i} className="h-5 w-5 text-gray-300" fill="currentColor" />);
            }
        }
        return stars;
    };

    return (
        <div className="flex items-center gap-2">
            <div className="flex">{renderStars()}</div>
            {rating > 0 && (
                <span className={`font-bold text-sm ${color}`}>
                    ({rating.toFixed(1)})
                </span>
            )}
        </div>
    );
};

export default StarRating;
