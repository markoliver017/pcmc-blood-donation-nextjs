import React from "react";
import { Heart, Award, Star } from "lucide-react";

const getMilestones = (total) => {
    const milestones = [];
    if (total >= 1)
        milestones.push({
            label: "First Donation",
            icon: <Star className="w-4 h-4 text-yellow-400" />,
        });
    if (total >= 5)
        milestones.push({
            label: "5 Donations",
            icon: <Award className="w-4 h-4 text-blue-500" />,
        });
    if (total >= 10)
        milestones.push({
            label: "10+ Donations",
            icon: <Award className="w-4 h-4 text-purple-500" />,
        });
    return milestones;
};

const ImpactMetrics = ({ totalDonations = 0, appointments = [] }) => {
    const livesSaved = totalDonations * 3;
    const milestones = getMilestones(totalDonations);

    if (totalDonations === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 border rounded shadow text-gray-500">
                <Heart className="w-8 h-8 mb-2 text-red-300" />
                <div className="font-semibold text-lg">No Impact Yet</div>
                <div className="text-sm">
                    Your impact stats will appear here after your first
                    donation.
                </div>
            </div>
        );
    }

    return (
        <div className="border rounded shadow p-4 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
                <Heart className="w-6 h-6 text-red-500" />
                <span className="text-lg font-bold">{livesSaved}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    lives saved
                </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                (Est. 1 donation = 3 lives)
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
                {milestones.map((m, idx) => (
                    <span
                        key={idx}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-800 rounded-full text-xs font-semibold border border-blue-200"
                    >
                        {m.icon} {m.label}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default ImpactMetrics;
