"use client";

import { HelpCircle } from "lucide-react";
import { Button } from "@components/ui/button";

const QUICK_QUESTIONS = [
    {
        id: 1,
        question: "Who can donate blood?",
        icon: "👥",
    },
    {
        id: 2,
        question: "How long does the donation process take?",
        icon: "⏱️",
    },
    {
        id: 3,
        question: "Why is donating blood important for children?",
        icon: "🩸",
    },
    {
        id: 4,
        question: "How do I schedule a donation?",
        icon: "📅",
    },
    {
        id: 5,
        question: "What if I recently got sick or traveled?",
        icon: "📋",
    },
    {
        id: 6,
        question: "Is donating blood safe? ",
        icon: "✅",
    },
];

export default function QuickQuestions({ onQuestionClick, disabled = false }) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                <HelpCircle className="w-4 h-4" />
                <span>Quick Questions</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
                {QUICK_QUESTIONS.map((item) => (
                    <Button
                        key={item.id}
                        variant="outline"
                        className="justify-start text-left h-auto py-3 px-4 hover:bg-blue-50 dark:text-slate-200 dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-700 dark:hover:text-slate-200 transition-colors"
                        onClick={() => onQuestionClick(item.question)}
                        disabled={disabled}
                    >
                        <span className="mr-2 text-lg">{item.icon}</span>
                        <span className="text-sm whitespace-normal">
                            {item.question}
                        </span>
                    </Button>
                ))}
            </div>
        </div>
    );
}
