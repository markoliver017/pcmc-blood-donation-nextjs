import FeedbackQuestionDataTable from "@components/feedback_questions/FeedbackQuestionDataTable";

export default function AdminFeedbackPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-4">Manage Feedback Questions</h1>
            <FeedbackQuestionDataTable />
        </div>
    );
}
