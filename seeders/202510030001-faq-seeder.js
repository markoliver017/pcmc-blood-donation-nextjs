// npx sequelize-cli db:seed --seed 202510030001-faq-seeder.js

/** @type {import('sequelize-cli').Seeder} */
export async function up(queryInterface, Sequelize) {
    // Get an admin user for created_by field
    const [adminUser] = await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE email = 'mark.roman@pcmc.gov.ph' LIMIT 1`,
        { type: Sequelize.QueryTypes.SELECT }
    );

    if (!adminUser) {
        throw new Error("Admin user not found. Please run user seeders first.");
    }

    // FAQ data to seed
    const faqData = [
        {
            question: "Who can donate blood?",
            answer: "Anyone who is at least 18 years old (16 with parental consent), weighs 110 lbs (50 kg) or more, and is in good general health may be eligible to donate.",
            category: "eligibility",
            keywords: [
                "eligibility",
                "age",
                "weight",
                "health",
                "requirements",
                "qualify",
            ],
            display_order: 1,
            is_active: true,
            created_by: adminUser.id,
            updated_by: adminUser.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            question: "How long does the donation process take?",
            answer: "The entire process from arrival to recovery takes about 30–45 minutes, but the actual blood donation typically takes only 8–10 minutes.",
            category: "donation_process",
            keywords: [
                "donation process",
                "time",
                "duration",
                "minutes",
                "procedure",
            ],
            display_order: 2,
            is_active: true,
            created_by: adminUser.id,
            updated_by: adminUser.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            question: "Why is donating blood important for children?",
            answer: "Children with cancer, premature babies, and those undergoing surgeries often need frequent and component-specific blood transfusions. Since they can't donate blood themselves, they rely entirely on adult donors.",
            category: "general",
            keywords: [
                "children",
                "cancer",
                "premature babies",
                "surgeries",
                "transfusions",
                "importance",
            ],
            display_order: 3,
            is_active: true,
            created_by: adminUser.id,
            updated_by: adminUser.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            question: "How do I schedule a donation?",
            answer: "You can book an appointment directly through the Mobile Blood Donation Portal, where you can choose your location, view available mobile blood drives, and reschedule or cancel with ease.",
            category: "appointments",
            keywords: [
                "schedule",
                "appointment",
                "booking",
                "portal",
                "mobile app",
                "reschedule",
                "cancel",
            ],
            display_order: 4,
            is_active: true,
            created_by: adminUser.id,
            updated_by: adminUser.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            question: "What if I recently got sick or traveled?",
            answer: "Temporary deferral may apply if you've had a recent illness (fever, cold, infection) or travel to areas with malaria, Zika, or dengue risk. Always complete the pre-screening questionnaire in the app to check your eligibility.",
            category: "eligibility",
            keywords: [
                "sick",
                "illness",
                "travel",
                "deferral",
                "malaria",
                "zika",
                "dengue",
                "pre-screening",
                "questionnaire",
            ],
            display_order: 5,
            is_active: true,
            created_by: adminUser.id,
            updated_by: adminUser.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            question: "Is donating blood safe?",
            answer: "Yes. All equipment is sterile and used only once. Donation is supervised by trained medical professionals, and your health is carefully monitored.",
            category: "health_safety",
            keywords: [
                "safety",
                "sterile",
                "equipment",
                "medical professionals",
                "monitoring",
                "health",
            ],
            display_order: 6,
            is_active: true,
            created_by: adminUser.id,
            updated_by: adminUser.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            question: "How often can I donate?",
            answer: "Whole blood: Every 90 days (12 weeks). Apheresed Platelets: Every 14 days.",
            category: "donation_process",
            keywords: [
                "frequency",
                "often",
                "whole blood",
                "platelets",
                "interval",
                "wait time",
            ],
            display_order: 7,
            is_active: true,
            created_by: adminUser.id,
            updated_by: adminUser.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            question: "What should I do before and after donating?",
            answer: "Before: Eat a healthy meal, drink plenty of fluids, avoid heavy exercise, get a full sleep of 7-8 hours a day before, avoid drinking alcoholic beverages 24 hours before donating, avoid smoking on the day of your appointment. After: Rest and hydrate, eat a snack provided by the staff, avoid smoking for at least three (3) hours after donation, avoid strenuous activity for the rest of the day.",
            category: "donation_process",
            keywords: [
                "preparation",
                "before donation",
                "after donation",
                "healthy meal",
                "hydration",
                "rest",
                "recovery",
                "instructions",
            ],
            display_order: 8,
            is_active: true,
            created_by: adminUser.id,
            updated_by: adminUser.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            question: "Who can I contact if I have questions?",
            answer: "You can reach us at: (0928) 479 5154 (Mobile) or (02) 8921 9781 (Direct Line). Kindly do not hesitate to contact us if you have any concerns or questions.",
            category: "general",
            keywords: [
                "contact",
                "phone",
                "mobile",
                "direct line",
                "questions",
                "concerns",
                "support",
            ],
            display_order: 9,
            is_active: true,
            created_by: adminUser.id,
            updated_by: adminUser.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            question: "Can I track my donations and get reminders?",
            answer: "Absolutely! The mobile portal allows you to track donation history, get alerts for your next eligible date, and receive notifications when your blood type is urgently needed.",
            category: "account",
            keywords: [
                "track",
                "donation history",
                "reminders",
                "alerts",
                "notifications",
                "mobile portal",
                "eligible date",
                "urgent need",
            ],
            display_order: 10,
            is_active: true,
            created_by: adminUser.id,
            updated_by: adminUser.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    faqData.forEach((faq) => {
        if (Array.isArray(faq.keywords)) {
            faq.keywords = JSON.stringify(faq.keywords);
        }
    });

    await queryInterface.bulkInsert("faqs", faqData, {});

    console.log("FAQ seeder completed successfully!");
}

export async function down(queryInterface) {
    await queryInterface.bulkDelete("faqs", null, {});
}
