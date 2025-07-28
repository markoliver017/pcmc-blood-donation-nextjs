import ScreeningQuestionnaireForm from "@/(pages)/portal/(role_based)/donors/appointments/[id]/screening-questionaires/ScreeningQuestionnaireForm";
import {
    getActiveScreeningQuestions,
    getScreeningDetails,
} from "@/action/screeningDetailAction";
import Skeleton from "@components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function EventScreeningQuestionaire({ appointmentId }) {
    const { data: questions, isLoading: questionsLoading } = useQuery({
        queryKey: ["questions"],
        queryFn: async () => {
            const res = await getActiveScreeningQuestions();
            if (!res.success) {
                throw res;
            }
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    const { data: existingAnswers, isLoading: existingAnswersLoading } =
        useQuery({
            queryKey: ["existingAnswers", appointmentId],
            queryFn: async () => {
                const res = await getScreeningDetails(appointmentId);
                if (!res.success) {
                    throw res;
                }
                return res.data;
            },
            enabled: !!appointmentId,
        });

    if (!appointmentId) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-15rem)]">
                <div className="text-center text-red-500 font-bold">
                    Appointment not found or you do not have permission to view
                    this page.
                </div>
            </div>
        );
    }

    if (questionsLoading || existingAnswersLoading) {
        return <Skeleton />;
    }

    if (!questions) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-15rem)]">
                <div className="text-center text-red-500 font-bold">
                    Questions not found or you do not have permission to view
                    this page.
                </div>
            </div>
        );
    }

    // const questionsPromise = getActiveScreeningQuestions();
    // const screeningDetailsPromise = getScreeningDetails(appointmentId);

    // const [questionsResult, screeningDetailsResult] = await Promise.all([
    //     questionsPromise,
    //     screeningDetailsPromise,
    // ]);

    return (
        <div>
            <ScreeningQuestionnaireForm
                questions={questions}
                appointmentId={appointmentId}
                existingAnswers={existingAnswers || []}
            />
        </div>
    );
}
