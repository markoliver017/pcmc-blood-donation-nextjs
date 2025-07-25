import ScreeningQuestionnaireForm from "@/(pages)/portal/(role_based)/donors/appointments/[id]/screening-questionaires/ScreeningQuestionnaireForm";
import React from "react";

export default function EventScreeningQuestionaire({ appointmentId }) {
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
