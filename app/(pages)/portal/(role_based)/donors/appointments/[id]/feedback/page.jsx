import {
    FeedbackQuestion,
    FeedbackResponse,
    DonorAppointmentInfo,
    EventTimeSchedule,
    BloodDonationEvent,
    Agency,
    Donor,
} from "@lib/models";
import DonorFeedbackForm from "@components/feedback_responses/DonorFeedbackForm";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@components/ui/card";
import { Button } from "@components/ui/button";
import Link from "next/link";
import { Calendar, MapPin, Clock, Building, User } from "lucide-react";
import { format, parse } from "date-fns";
import { redirect } from "next/navigation";
import { auth } from "@lib/auth";
import { formatSeqObj } from "@lib/utils/object.utils";

export default async function FeedbackPage({ params }) {
    const appointmentId = parseInt(params.id, 10);

    const session = await auth();
    if (!session) {
        redirect("/login");
    }
    const { user } = session;

    if (user.role_name !== "Donor") {
        redirect("/portal");
    }

    // 1. Fetch appointment details
    const appointment = formatSeqObj(
        await DonorAppointmentInfo.findByPk(appointmentId, {
            include: [
                {
                    model: Donor,
                    as: "donor",
                    attributes: ["id", "user_id"],
                    where: {
                        user_id: user.id,
                    },
                    required: true,
                },
                {
                    model: EventTimeSchedule,
                    as: "time_schedule",
                    include: {
                        model: BloodDonationEvent,
                        as: "event",
                        include: { model: Agency, as: "agency" },
                    },
                },
            ],
        })
    );

    if (!appointment) {
        return (
            <div className="container mx-auto py-10 flex justify-center">
                <Card className="w-full max-w-lg text-center">
                    <CardHeader>
                        <CardTitle>Appointment Not Found</CardTitle>
                        <CardDescription>
                            The appointment you are looking for does not exist
                            or you do not have access to it.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/portal/donors/appointments">
                                Go Back to Appointments
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // 2. Fetch active feedback questions
    const activeQuestions = formatSeqObj(
        await FeedbackQuestion.findAll({
            where: { is_active: true },
            order: [["createdAt", "ASC"]],
        })
    );
    console.log(activeQuestions);

    if (activeQuestions.length === 0) {
        redirect(
            "/portal/donors/appointments?error=feedback_questions_not_found"
        );
    }

    // 3. Check if feedback has already been submitted
    const existingFeedback = formatSeqObj(
        await FeedbackResponse.findOne({
            where: { donor_appointment_id: appointmentId },
        })
    );

    if (existingFeedback) {
        return (
            <div className="container mx-auto py-10 flex justify-center">
                <Card className="w-full max-w-lg text-center">
                    <CardHeader>
                        <CardTitle>Feedback Already Submitted</CardTitle>
                        <CardDescription>
                            You have already provided feedback for this
                            appointment. Thank you!
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button asChild>
                            <Link href="/portal/donors/appointments">
                                Go Back to Appointments
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const event = appointment.time_schedule.event;
    const timeSchedule = appointment.time_schedule;

    // 4. Render the form
    return (
        <div className="container mx-auto py-10">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">
                        Submit Your Feedback
                    </CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">
                        Your feedback on the "{event.title}" event is important
                        to us.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-8 p-4 border rounded-lg bg-secondary/50">
                        <h3 className="text-xl font-semibold mb-3">
                            Appointment Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-md">
                            <div className="flex items-center gap-2">
                                <Building className="w-5 h-5 text-primary" />
                                <span>
                                    <strong>Agency:</strong> {event.agency.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" />
                                <span>
                                    <strong>Location:</strong>{" "}
                                    {event.agency.agency_address}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary" />
                                <span>
                                    <strong>Date:</strong>{" "}
                                    {new Date(
                                        timeSchedule.event.date
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary" />
                                <span>
                                    <strong>Time:</strong>{" "}
                                    {format(
                                        parse(
                                            timeSchedule.time_start,
                                            "HH:mm:ss",
                                            new Date()
                                        ),
                                        "hh:mm a"
                                    )}{" "}
                                    -{" "}
                                    {format(
                                        parse(
                                            timeSchedule.time_end,
                                            "HH:mm:ss",
                                            new Date()
                                        ),
                                        "hh:mm a"
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-4">
                        Feedback Questions
                    </h3>
                    <p className="text-muted-foreground mb-6">
                        Please rate your experience for the following questions
                        from 1 (Poor) to 5 (Excellent).
                    </p>
                    <DonorFeedbackForm
                        questions={activeQuestions}
                        appointmentId={appointmentId}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
