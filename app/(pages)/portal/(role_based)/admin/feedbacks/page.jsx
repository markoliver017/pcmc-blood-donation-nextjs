import FeedbackQuestionDataTable from "@components/feedback_questions/FeedbackQuestionDataTable";

export default function AdminFeedbackPage() {
    return (
        <div className="container mx-auto p-1 md:p-6">
            <h1 className="text-2xl font-bold">Manage Feedback Questions</h1>
            <FeedbackQuestionDataTable />
        </div>
    );
}
