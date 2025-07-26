"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFeedbackQuestions, deleteFeedbackQuestion, updateFeedbackQuestion } from "@action/feedbackQuestionAction";
import { columns } from "./columns";
import { Button } from "@components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import CreateFeedbackQuestionForm from "./CreateFeedbackQuestionForm";
import EditFeedbackQuestionForm from "./EditFeedbackQuestionForm";
import { toast, Toaster } from "sonner";
import { DataTable } from "@components/reusable_components/Datatable";
import { X } from "lucide-react";

export default function FeedbackQuestionDataTable() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["feedback_questions"],
        queryFn: async () => {
            const result = await getFeedbackQuestions();
            return result.success ? result.data : [];
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteFeedbackQuestion,
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries(["feedback_questions"]);
            } else {
                toast.error(response.message);
            }
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete question.");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updateFeedbackQuestion(id, data),
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({ queryKey: ["feedback_questions"] });
                setIsEditOpen(false);
            } else {
                toast.error(response.message);
            }
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update question.");
        },
    });

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this question?")) {
            deleteMutation.mutate(id);
        }
    };

    const openEditDialog = (question) => {
        setSelectedQuestion(question);
        setIsEditOpen(true);
    };

    const updateStatus = (id, is_active) => {
        updateMutation.mutate({ id, data: { is_active } });
    };

    // Add the delete handler to the columns definition
    const tableColumns = columns.map(col => {
        if (col.id === 'actions') {
            return {
                ...col,
                cell: ({ row }) => {
                    const question = row.original;
                    return (
                        <div className="flex-items-center">

                            <Button variant="default" size="sm" onClick={() => openEditDialog(question)}>
                                Edit
                            </Button>
                            {question.is_active ? (
                                <Button variant="outline" className="bg-error" size="sm" onClick={() => updateStatus(question.id, !question.is_active)}>
                                    Deactivate
                                </Button>
                            ) : (
                                <Button variant="outline" className="bg-success" size="sm" onClick={() => updateStatus(question.id, !question.is_active)}>
                                    Activate
                                </Button>
                            )}
                                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(question.id)}>
                                <X />
                            </Button>
                        </div>
                    );
                }
            };
        }
        return col;
    });

    if (isLoading) return <div>Loading questions...</div>;
    if (isError) return <div>Error fetching questions.</div>;

    return (
        <div className="w-full">
            <Toaster />
            <div className="flex justify-end mb-4">
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>Add New Question</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create New Feedback Question</DialogTitle>
                        </DialogHeader>
                        <CreateFeedbackQuestionForm onOpenChange={setIsCreateOpen} />
                    </DialogContent>
                </Dialog>
            </div>
            <DataTable
                columns={tableColumns}
                data={data}
                meta={{
                    openEditDialog,
                    updateStatus,
                    handleDelete,
                }}
            />
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Feedback Question</DialogTitle>
                    </DialogHeader>
                    {selectedQuestion && (
                        <EditFeedbackQuestionForm
                            question={selectedQuestion}
                            onOpenChange={setIsEditOpen}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
