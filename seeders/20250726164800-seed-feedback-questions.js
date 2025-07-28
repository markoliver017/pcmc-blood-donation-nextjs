// npx sequelize-cli db:seed --seed 20250726164800-seed-feedback-questions.js
"use strict";

import { v4 as uuidv4 } from "uuid";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "feedback_questions",
            [
                {
                    id: uuidv4(),
                    question_text:
                        "How would you rate your overall experience at our donation center?",
                    is_active: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuidv4(),
                    question_text:
                        "Was the staff friendly, professional, and accommodating?",
                    is_active: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuidv4(),
                    question_text:
                        "How would you rate the cleanliness and comfort of the facility?",
                    is_active: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuidv4(),
                    question_text:
                        "Was the pre-donation screening process clear and efficient?",
                    is_active: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuidv4(),
                    question_text:
                        "Did you feel comfortable and well-cared for during the actual donation?",
                    is_active: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuidv4(),
                    question_text:
                        "How was the wait time for your appointment?",
                    is_active: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuidv4(),
                    question_text:
                        "Were the post-donation refreshments and recovery area satisfactory?",
                    is_active: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuidv4(),
                    question_text:
                        "How easy was it to schedule your donation appointment?",
                    is_active: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuidv4(),
                    question_text:
                        "Would you recommend donating blood at our center to others?",
                    is_active: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuidv4(),
                    question_text:
                        "Do you have any suggestions for how we can improve our services?",
                    is_active: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuidv4(),
                    question_text:
                        "Did you receive clear pre-donation and post-donation instructions?",
                    is_active: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("feedback_questions", null, {});
    },
};
