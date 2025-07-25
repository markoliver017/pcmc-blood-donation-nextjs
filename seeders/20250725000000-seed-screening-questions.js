// npx sequelize-cli db:seed --seed 20250725000000-seed-screening-questions.js

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
    // Insert sample screening questions
    await queryInterface.bulkInsert(
        "screening_questions",
        [
            {
                question_text: "Have you donated blood in the last 3 months?",
                question_type: "GENERAL",
                is_active: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                question_text:
                    "Have you recently experienced fever or flu-like symptoms?",
                question_type: "MEDICAL",
                is_active: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                question_text:
                    "Are you currently taking any prescription medication?",
                question_type: "MEDICAL",
                is_active: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ],
        {}
    );
}
