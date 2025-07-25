import { screeningQuestionnaireSchema } from "../zod/screeningDetailSchema";

describe("screeningQuestionnaireSchema", () => {
    it("should validate a correct questionnaire submission", () => {
        const data = {
            answers: [
                { question_id: 1, response: "NO", additional_info: "" },
                { question_id: 2, response: "YES", additional_info: "Fever" },
            ],
        };
        const result = screeningQuestionnaireSchema.safeParse(data);
        expect(result.success).toBe(true);
    });

    it("should fail if answers is not an array", () => {
        const result = screeningQuestionnaireSchema.safeParse({ answers: {} });
        expect(result.success).toBe(false);
    });

    it("should fail if response is not one of the enum values", () => {
        const data = {
            answers: [
                { question_id: 1, response: "MAYBE", additional_info: "" },
            ],
        };
        const result = screeningQuestionnaireSchema.safeParse(data);
        expect(result.success).toBe(false);
    });

    it("should fail if question_id is not a positive number", () => {
        const data = {
            answers: [{ question_id: -1, response: "NO", additional_info: "" }],
        };
        const result = screeningQuestionnaireSchema.safeParse(data);
        expect(result.success).toBe(false);
    });
});
