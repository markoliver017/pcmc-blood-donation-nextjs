// Content management utilities for landing pages
// Extracts and organizes content from PAGES_CONTENT.md

// About Us Page Content
export const aboutUsContent = {
    hero: {
        title: "About PCMC Pediatric Blood Center",
        subtitle:
            "Saving lives through safe and reliable blood donation services",
    },
    overview: {
        title: "Overview",
        description:
            "The Pediatric Blood Center Mobile Blood Donation Portal is a user-friendly, secure digital platform designed to connect volunteer blood donors with pediatric patients in need. Focused on convenience, safety, and community engagement, this mobile portal enables donors to easily register, schedule, and track their donations, while providing critical updates about pediatric blood needs.",
        features: [
            {
                title: "Donor Registration & Profile",
                description:
                    "Secure signup/login system, blood type registration, donation history tracker",
                icon: "UserPlus",
            },
            {
                title: "Appointment Scheduling",
                description:
                    "Real-time availability of mobile blood drives, option to book or reschedule appointments",
                icon: "Calendar",
            },
            {
                title: "Donation Tracking & History",
                description:
                    "Summary of past donations, eligibility countdown timer, status tracking",
                icon: "Activity",
            },
            {
                title: "Alerts & Notifications",
                description:
                    "Emergency pediatric blood appeals, blood type-specific requests, donation reminders",
                icon: "Bell",
            },
            {
                title: "Education & Community Engagement",
                description:
                    "Pediatric patient stories, information about blood types, FAQs, volunteer spotlight",
                icon: "BookOpen",
            },
            {
                title: "Privacy & Security",
                description:
                    "NPC and DPA compliant data handling, consent forms, secure data storage",
                icon: "Shield",
            },
        ],
    },
    mission: {
        title: "Our Mission",
        statement:
            "We are committed to saving and improving the lives of children in need by empowering volunteer blood donors. Our mobile platform makes blood donation simple, accessible and meaningful – bridging compassion with action.",
    },
    benefits: [
        {
            title: "Convenience",
            description: "Schedule and manage appointments from your phone",
        },
        {
            title: "Impact Awareness",
            description: "See how your donation helps save young lives",
        },
        {
            title: "Personalization",
            description: "Get alerts for when your blood type is needed",
        },
    ],
};

// Why Donate Page Content
export const whyDonateContent = {
    hero: {
        title: "Why Donate Blood?",
        subtitle: "Because Every Drop Counts—Especially for Children",
    },
    reasons: [
        {
            title: "Save Lives—Especially Young Ones",
            description:
                "Every single blood donation can save up to three lives. Many of them are children facing necessary surgical procedures, cancer, anemia, trauma, and other life-threatening conditions. Pediatric patients often require smaller, more frequent transfusions, meaning more donors are needed to meet their unique needs.",
            icon: "Heart",
            color: "red",
        },
        {
            title: "Children Can't Donate—But You Can",
            description:
                "Kids fighting for their lives depend on healthy adult volunteers. Whether it's a newborn in the Neonatal Intensive Care Unit or a child undergoing chemotherapy, your donation may be their only chance. Some of our patients depend on lifelong, regular transfusions to survive, for example, patients with Thalassemia.",
            icon: "Baby",
            color: "blue",
        },
        {
            title: "It Will Only Take 30 Minutes of Your Time",
            description:
                "From arrival to recovery, donating blood is quick, safe, and easy—and it makes a lifelong impact. Use the mobile portal to donate at your convenience, close to home or work.",
            icon: "Clock",
            color: "green",
        },
        {
            title: "Join a Life-Saving Community",
            description:
                "Be part of a caring network of volunteers helping children in your community. Track your donations, earn milestones, and see the real-world impact of your contribution.",
            icon: "Users",
            color: "yellow",
        },
        {
            title: "It's Good for Your Health Too",
            description:
                "Regular blood donation can stimulate red blood cell production, provide a mini health check (Blood pressure check, hemoglobin determination, etc.), and encourage a sense of purpose and emotional well-being.",
            icon: "Activity",
            color: "purple",
        },
    ],
    quote: "You may not know the child whose life you save—but they'll never forget your gift.",
};

// Donation Process Page Content
export const donationProcessContent = {
    hero: {
        title: "Blood Donation Process",
        subtitle: "Simple, Safe, and Life-Saving",
    },
    steps: [
        {
            number: 1,
            title: "Registration & Pre-screening",
            description:
                "Create a donor profile, complete a health questionnaire, and consent to donate. First-time donors receive orientation content on pediatric-specific donation needs.",
            details: [
                "Create a donor profile (basic info, blood type if known)",
                "Complete a health questionnaire (recent illnesses, medications, travel history)",
                "Consent to donate and agree to data privacy terms",
            ],
            icon: "ClipboardList",
            mobileFeature: "Via the Mobile Portal",
        },
        {
            number: 2,
            title: "Appointment Scheduling",
            description:
                "Choose location and select date & time. Locate nearest mobile blood drive via GPS and view available slots in real-time.",
            details: [
                "Locate nearest mobile blood drive via GPS",
                "View available slots in real-time",
                "Confirm or reschedule easily",
                "Receive automated reminders before your appointment",
            ],
            icon: "Calendar",
            mobileFeature: "📱 Choose Location & 📆 Select Date & Time",
        },
        {
            number: 3,
            title: "On-Site Screening & Eligibility Check",
            description:
                "At the Mobile Blood Unit: Identity verification, vital signs check, and final medical screening by a qualified staff member.",
            details: [
                "Identity verification",
                "Vital signs check (blood pressure, pulse, hemoglobin levels)",
                "Final medical screening by a qualified staff member",
            ],
            icon: "Stethoscope",
            mobileFeature: "🏥 At the Mobile Blood Unit",
        },
        {
            number: 4,
            title: "Blood Donation",
            description:
                "The procedure takes 8–10 minutes with approximately 1 pint (470 mL) of blood collected. Special labeling and routing for pediatric use.",
            details: [
                "Comfortable donation area prepared",
                "Donation typically takes 8–10 minutes",
                "Approx. 1 pint (470 mL) of blood collected",
                "Special labeling and routing for pediatric use",
            ],
            icon: "Droplets",
            mobileFeature: "🩸 The Procedure",
        },
        {
            number: 5,
            title: "Refreshment & Recovery",
            description:
                "Post-donation care includes resting for 10–15 minutes, light snacks and drinks provided, and staff monitoring for any side effects.",
            details: [
                "Donor rests for 10–15 minutes",
                "Light snacks and drinks provided",
                "Staff monitors for any side effects",
            ],
            icon: "Coffee",
            mobileFeature: "🍎 Post-Donation Care",
        },
        {
            number: 6,
            title: "Digital Follow-Up",
            description:
                "Via the Mobile Portal: Donation confirmed and logged, health metrics updated in profile, and countdown begins for next eligible donation date.",
            details: [
                "Donation confirmed and logged",
                "Health metrics (e.g. hemoglobin) updated in profile",
                "Countdown begins for next eligible donation date",
                "Optional: Receive updates when your donation helps a pediatric patient",
            ],
            icon: "Smartphone",
            mobileFeature: "📲 Via the Mobile Portal",
        },
        {
            number: 7,
            title: "Recognition & Engagement",
            description:
                "Rewards & Motivation: Earn digital badges for milestone donations, access exclusive donor community events, and invite friends.",
            details: [
                "Earn digital badges for milestone donations",
                "Access exclusive donor community events",
                "Invite friends and track referral impact",
            ],
            icon: "Award",
            mobileFeature: "🎖️ Rewards & Motivation",
        },
    ],
};

// Eligibility Requirements Page Content
export const eligibilityContent = {
    hero: {
        title: "Eligibility Requirements to Donate Blood",
        subtitle: "Make Sure You're Ready to Help Save a Child's Life",
    },
    introduction:
        "Before donating, every volunteer must meet basic health and safety standards to protect both the donor and the child receiving the blood.",
    categories: [
        {
            title: "Basic Eligibility",
            items: [
                {
                    requirement: "Age",
                    details:
                        "Must be at least 18 years old (16 with parental consent, where permitted)",
                },
                {
                    requirement: "Weight",
                    details: "Minimum 110 lbs (50 kg)",
                },
                {
                    requirement: "Health",
                    details:
                        "Must be in good general health (no fever, infection, or flu-like symptoms)",
                },
            ],
        },
        {
            title: "Medical & Lifestyle Requirements",
            items: [
                {
                    requirement: "Hemoglobin Level",
                    details:
                        "Must meet minimum hemoglobin/iron levels (tested during pre-screening)\n12.5 – 18.0 g/dL – Female\n13.5 – 18.0 g/dL - Male",
                },
                {
                    requirement: "Medications",
                    details:
                        "Some medications may temporarily or permanently defer donation. (e.g., blood thinners, certain antibiotics)",
                },
                {
                    requirement: "Medical Conditions",
                    details:
                        "Cannot donate if you have:\n• Active infections (HIV, hepatitis, etc.)\n• Certain chronic diseases (e.g., uncontrolled diabetes, active cancer)\n• Recent major surgeries (within 6–12 months)",
                },
            ],
        },
        {
            title: "Travel & Risk Factors",
            items: [
                {
                    requirement: "Recent Travel",
                    details:
                        "Travel to areas with malaria, Zika, or other infectious outbreaks may cause temporary deferral.",
                },
                {
                    requirement: "Tattoos/Piercings",
                    details:
                        "Must wait 1 year after receiving a tattoo or piercing",
                },
                {
                    requirement: "Vaccinations",
                    details:
                        "Temporary deferrals may apply depending on the type and timing of vaccines received.",
                },
            ],
        },
        {
            title: "Donation Frequency",
            items: [
                {
                    requirement: "Whole Blood",
                    details: "Every 90 days (12 weeks)",
                },
                {
                    requirement: "Apheresed Platelets",
                    details: "Every 14 days, up to 24 times/year",
                },
            ],
        },
    ],
    note: "All donors will undergo a confidential health screening and mini-physical examination before donation to confirm eligibility.",
    portalFeatures: [
        "Complete pre-screening forms in advance",
        "Track your next eligible donation date",
        "Get notified if you're temporarily deferred",
    ],
};

// Contact Us Page Content
export const contactContent = {
    hero: {
        title: "Contact Us",
        subtitle:
            "Have questions or want to learn more about donating blood for children in need? We're here to help!",
    },
    contactInfo: {
        organization: "Pediatric Blood Center",
        phone: {
            mobile: "(0928) 479 5154",
            landline: "(02) 8921 9781",
        },
        location: "PCMC Building, Quezon City, Philippines",
    },
    officeHours: {
        title: "Office Hours",
        hours: [
            "Monday - Friday: 8:00 AM - 5:00 PM",
            "Saturday: 8:00 AM - 12:00 PM",
            "Sunday: Closed",
        ],
    },
    departments: [
        {
            name: "Blood Donation Services",
            phone: "(02) 8921 9781",
            email: "blooddonation@pcmc.gov.ph",
        },
        {
            name: "Donor Relations",
            phone: "(0928) 479 5154",
            email: "donorrelations@pcmc.gov.ph",
        },
        {
            name: "Emergency Requests",
            phone: "(02) 8921 9780",
            email: "emergency@pcmc.gov.ph",
        },
    ],
};

// Success Stories Page Content (to be created)
export const successStoriesContent = {
    hero: {
        title: "Success Stories",
        subtitle: "Real Stories of Hope and Healing",
    },
    testimonials: [
        {
            name: "Maria Santos",
            role: "Regular Donor",
            story: "I've been donating blood for 5 years now, and knowing that my donations help children in need gives me such joy. The mobile portal makes it so easy to schedule appointments and track my donation history.",
            image: "/avatar-1.png",
            donations: 12,
        },
        {
            name: "Juan Dela Cruz",
            role: "First-time Donor",
            story: "I was nervous about my first donation, but the staff at PCMC made me feel so comfortable. The process was quick and easy, and I'm proud to be part of this life-saving mission.",
            image: "/avatar-2.png",
            donations: 1,
        },
        {
            name: "Ana Rodriguez",
            role: "Parent of Recipient",
            story: "My daughter received blood transfusions during her treatment. Thanks to generous donors, she's now healthy and thriving. Words can't express our gratitude.",
            image: "/avatar-3.png",
            donations: 0,
        },
    ],
    impact: {
        title: "Our Impact",
        statistics: [
            {
                number: "1000+",
                label: "Lives Saved",
                description: "Children helped through blood donations",
            },
            {
                number: "5000+",
                label: "Donors Registered",
                description: "Active donors in our community",
            },
            {
                number: "50+",
                label: "Blood Drives",
                description: "Organized annually",
            },
            {
                number: "100%",
                label: "Safe",
                description: "All donations screened and tested",
            },
        ],
    },
};

// Utility function to get content by page
export const getPageContent = (pageName) => {
    const contentMap = {
        about: aboutUsContent,
        whyDonate: whyDonateContent,
        donationProcess: donationProcessContent,
        eligibility: eligibilityContent,
        contact: contactContent,
        successStories: successStoriesContent,
    };

    return contentMap[pageName] || null;
};
