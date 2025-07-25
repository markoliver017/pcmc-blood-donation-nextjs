// screeningDetailAction.test.js
// Mocking dependencies
jest.mock("@lib/auth", () => ({
    auth: jest.fn(),
}));
jest.mock("@lib/models", () => ({
    ScreeningQuestion: { findAll: jest.fn() },
    ScreeningDetail: { bulkCreate: jest.fn(), findAll: jest.fn() },
    DonorAppointmentInfo: { findOne: jest.fn() },
    sequelize: { transaction: jest.fn() },
}));

import {
    getActiveScreeningQuestions,
    getScreeningDetails,
    upsertManyScreeningDetails,
} from "../../app/action/screeningDetailAction";
import { auth } from "@lib/auth";
import {
    ScreeningQuestion,
    ScreeningDetail,
    DonorAppointmentInfo,
    sequelize,
} from "@lib/models";

describe("screeningDetailActions", () => {
    beforeEach(() => {
        sequelize.transaction.mockImplementation(async (fn) => fn(jest.fn()));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getScreeningDetails", () => {
        it("should return details if user is authenticated", async () => {
            auth.mockResolvedValue({ user: { id: 1 } });
            const mockDetails = [{ id: 1, response: "YES" }];
            ScreeningDetail.findAll.mockResolvedValue(mockDetails);
            const result = await getScreeningDetails(1);
            expect(result.success).toBe(true);
            expect(result.data).toEqual(mockDetails);
        });

        it("should return error if user is not authenticated", async () => {
            auth.mockResolvedValue(null);
            const result = await getScreeningDetails(1);
            expect(result.success).toBe(false);
            expect(result.error).toBe("Unauthorized");
        });
    });

    describe("getActiveScreeningQuestions", () => {
        it("should return active screening questions", async () => {
            auth.mockResolvedValue({ user: { id: 1 } });
            const mockQuestions = [{ id: 1, question_text: "Q1" }];
            ScreeningQuestion.findAll.mockResolvedValue(mockQuestions);
            const result = await getActiveScreeningQuestions();
            expect(result.success).toBe(true);
        });
    });

    describe("upsertManyScreeningDetails", () => {
        it("should upsert screening details for a valid donor", async () => {
            auth.mockResolvedValue({ user: { id: 1, role_name: "Donor" } });
            DonorAppointmentInfo.findOne.mockResolvedValue({
                id: 1,
                donor_id: 1,
            });
            const answers = [
                { question_id: 1, response: "NO", additional_info: "" },
            ];

            const result = await upsertManyScreeningDetails(1, answers);

            expect(result.success).toBe(true);
            expect(result.message).toBe(
                "Screening questionnaire submitted successfully."
            );
            expect(ScreeningDetail.bulkCreate).toHaveBeenCalledWith(
                expect.any(Array),
                {
                    transaction: expect.any(Object),
                    updateOnDuplicate: ["response", "additional_info"],
                }
            );
        });

        it("should return an error if user is not a donor", async () => {
            auth.mockResolvedValue({ user: { id: 1, role_name: "Admin" } });
            const result = await upsertManyScreeningDetails(1, []);
            expect(result.success).toBe(false);
            expect(result.message).toBe("Unauthorized: Donor role required");
        });
    });
});
