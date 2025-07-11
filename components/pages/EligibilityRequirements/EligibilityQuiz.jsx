"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import {
    CheckCircle,
    XCircle,
    AlertCircle,
    ArrowRight,
    RefreshCw,
} from "lucide-react";

export default function EligibilityQuiz() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [isEligible, setIsEligible] = useState(false);

    const questions = [
        {
            id: 1,
            question:
                "Are you at least 18 years old? (16 with parental consent)",
            type: "yesno",
            critical: true,
        },
        {
            id: 2,
            question: "Do you weigh at least 110 lbs (50 kg)?",
            type: "yesno",
            critical: true,
        },
        {
            id: 3,
            question: "Are you in good general health today?",
            type: "yesno",
            critical: true,
        },
        {
            id: 4,
            question:
                "Have you had any illness, cold, or fever in the last 48 hours?",
            type: "yesno",
            critical: false,
        },
        {
            id: 5,
            question: "Have you had dental work in the last 24 hours?",
            type: "yesno",
            critical: false,
        },
        {
            id: 6,
            question:
                "Have you had a tattoo or piercing in the last 12 months?",
            type: "yesno",
            critical: false,
        },
        {
            id: 7,
            question:
                "Have you traveled to a malaria-endemic area in the last 12 months?",
            type: "yesno",
            critical: false,
        },
        {
            id: 8,
            question: "Do you have any chronic medical conditions?",
            type: "yesno",
            critical: false,
        },
    ];

    const handleAnswer = (answer) => {
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion]: answer,
        }));
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            calculateResults();
        }
    };

    const calculateResults = () => {
        const criticalAnswers = questions
            .filter((q) => q.critical)
            .map((q) => answers[q.id - 1]);

        const allCriticalYes = criticalAnswers.every(
            (answer) => answer === "yes"
        );
        setIsEligible(allCriticalYes);
        setShowResults(true);
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setAnswers({});
        setShowResults(false);
        setIsEligible(false);
    };

    if (showResults) {
        return (
            <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-4xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                            <div className="flex justify-center mb-6">
                                {isEligible ? (
                                    <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                        <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                                        <AlertCircle className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                )}
                            </div>

                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                {isEligible
                                    ? "You May Be Eligible!"
                                    : "Further Assessment Needed"}
                            </h2>

                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                                {isEligible
                                    ? "Based on your answers, you meet the basic eligibility requirements. Please schedule an appointment for a complete medical screening."
                                    : "Some of your answers indicate that additional screening may be needed. Please contact our medical staff for a detailed assessment."}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                                {isEligible ? (
                                    <button className="btn btn-primary btn-lg px-8 py-3 text-lg font-semibold">
                                        Schedule Appointment
                                    </button>
                                ) : (
                                    <button className="btn btn-primary btn-lg px-8 py-3 text-lg font-semibold">
                                        Contact Medical Staff
                                    </button>
                                )}
                                <button
                                    onClick={resetQuiz}
                                    className="btn btn-outline btn-lg px-8 py-3 text-lg font-semibold"
                                >
                                    <RefreshCw className="w-5 h-5 mr-2" />
                                    Retake Quiz
                                </button>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Important Note
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    This quiz is for preliminary screening only.
                                    Final eligibility will be determined by our
                                    medical staff during your appointment. All
                                    information is kept confidential.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        );
    }

    const currentQ = questions[currentQuestion];

    return (
        <section
            id="eligibility-quiz"
            className="py-16 bg-gray-50 dark:bg-gray-800"
        >
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Quick Eligibility Quiz
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Answer a few questions to get a preliminary assessment
                        of your eligibility to donate blood. This takes about
                        2-3 minutes.
                    </p>
                </motion.div>

                <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8"
                >
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <span>
                                Question {currentQuestion + 1} of{" "}
                                {questions.length}
                            </span>
                            <span>
                                {Math.round(
                                    ((currentQuestion + 1) / questions.length) *
                                        100
                                )}
                                %
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                                style={{
                                    width: `${
                                        ((currentQuestion + 1) /
                                            questions.length) *
                                        100
                                    }%`,
                                }}
                            ></div>
                        </div>
                    </div>

                    {/* Question */}
                    <div className="text-center mb-8">
                        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            {currentQ.question}
                        </h3>
                        {currentQ.critical && (
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm font-medium">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                Critical Question
                            </div>
                        )}
                    </div>

                    {/* Answer Options */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <button
                            onClick={() => handleAnswer("yes")}
                            className={`flex-1 max-w-xs px-6 py-4 rounded-lg border-2 font-semibold transition-all duration-200 ${
                                answers[currentQuestion] === "yes"
                                    ? "border-green-500 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300"
                                    : "border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400"
                            }`}
                        >
                            <CheckCircle className="w-5 h-5 mr-2 inline" />
                            Yes
                        </button>
                        <button
                            onClick={() => handleAnswer("no")}
                            className={`flex-1 max-w-xs px-6 py-4 rounded-lg border-2 font-semibold transition-all duration-200 ${
                                answers[currentQuestion] === "no"
                                    ? "border-red-500 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300"
                                    : "border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400"
                            }`}
                        >
                            <XCircle className="w-5 h-5 mr-2 inline" />
                            No
                        </button>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-center">
                        <button
                            onClick={nextQuestion}
                            disabled={!answers[currentQuestion]}
                            className={`btn btn-primary btn-lg px-8 py-3 text-lg font-semibold flex items-center ${
                                !answers[currentQuestion]
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            {currentQuestion === questions.length - 1
                                ? "See Results"
                                : "Next Question"}
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
