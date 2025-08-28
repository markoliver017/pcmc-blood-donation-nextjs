import { auth } from "@lib/auth";
import { redirect } from "next/navigation";
import {
    Donor,
    User,
    BloodType,
    Agency,
    BloodDonationCollection,
    BloodDonationEvent,
} from "@lib/models";
import DonorIdCard from "@components/donors/DonorIdCard";
import { formatSeqObj } from "@lib/utils/object.utils";

export default async function DonorIdCardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/signin");
    }

    try {
        // Fetch donor data with associations
        const donor = await Donor.findOne({
            where: { user_id: session.user.id },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: [
                        "first_name",
                        "middle_name",
                        "last_name",
                        "full_name",
                        "gender",
                        "image",
                        "email",
                    ],
                },
                {
                    model: BloodType,
                    as: "blood_type",
                    required: false,
                    attributes: ["blood_type"],
                },
                {
                    model: Agency,
                    as: "agency",
                    required: false,
                    attributes: ["name"],
                },
            ],
        });

        if (!donor) {
            return (
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-md mx-auto text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Donor Registration Required
                        </h1>
                        <p className="text-gray-600 mb-6">
                            You need to complete your donor registration to view
                            your Donor ID.
                        </p>
                        <a
                            href="/portal/(role_based)/donors/profile"
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            Complete Registration
                        </a>
                    </div>
                </div>
            );
        }

        // Fetch 10 most recent blood donations
        const bloodDonations = await BloodDonationCollection.findAll({
            where: { donor_id: donor.id },
            include: [
                {
                    model: BloodDonationEvent,
                    as: "event",
                    attributes: ["date", "title"],
                },
            ],
            attributes: ["volume", "createdAt"],
            order: [["createdAt", "DESC"]],
            limit: 10,
        });

        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6 no-print">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Donor ID Card
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Your official blood donor identification card
                        </p>
                    </div>

                    <DonorIdCard
                        donor={formatSeqObj(donor)}
                        donations={formatSeqObj(bloodDonations)}
                    />
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error fetching donor data:", error);
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">
                        Error Loading Donor ID
                    </h1>
                    <p className="text-gray-600 mb-6">
                        There was an error loading your donor information.
                        Please try again later.
                    </p>
                    <a
                        href="/portal/(role_based)/donors"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Back to Dashboard
                    </a>
                </div>
            </div>
        );
    }
}
