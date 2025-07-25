"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Building, Plus, Edit, Trash2, HomeIcon } from "lucide-react";

import WrapperHeadMain from "@components/layout/WrapperHeadMain";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Card, CardContent } from "@components/ui/card";
import DeleteQuestionModal from "./DeleteQuestionModal";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@components/ui/alert-dialog";

import {
    getAllScreeningQuestions,
    deleteScreeningQuestion,
} from "@action/screeningQuestionAction";
import AddQuestionModal from "./AddQuestionModal";
import EditQuestionModal from "./EditQuestionModal";
import { toast } from "react-toastify";

export default function ScreeningQuestionsPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10; // items per page
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [deletingQuestion, setDeletingQuestion] = useState(null);
    const queryClient = useQueryClient();

    // Fetch screening questions
    const {
        data: questionsData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["screeningQuestions", currentPage],
        queryFn: () => getAllScreeningQuestions(currentPage, limit),
        keepPreviousData: true,
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: deleteScreeningQuestion,
        onSuccess: (result) => {
            if (result.success) {
                toast.success(result.message);
                queryClient.invalidateQueries({
                    queryKey: ["screeningQuestions"],
                });
                setDeletingQuestion(null);
            } else {
                toast.error(result.error);
            }
        },
        onError: (error) => {
            toast.error("Failed to delete question");
        },
    });

    const handleEditClick = (question) => {
        setEditingQuestion(question);
    };

    const handleDeleteClick = (question) => {
        setDeletingQuestion(question);
    };

    const handleDelete = () => {
        if (deletingQuestion) {
            deleteMutation.mutate(deletingQuestion.id);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-red-500">
                    Error loading screening questions
                </p>
            </div>
        );
    }

    const questions = questionsData?.data?.questions || [];
    const pagination = questionsData?.data?.pagination || {
        page: 1,
        totalPages: 1,
    };

    return (
        <div>
            <WrapperHeadMain
                icon={<Building />}
                pageTitle="Screening Questions"
                breadcrumbs={[
                    {
                        path: "/",
                        icon: <HomeIcon className="w-4" />,
                        title: "Home",
                    },
                    {
                        path: "/portal/admin",
                        icon: <Building className="w-4" />,
                        title: "Admin",
                    },
                    {
                        path: "/portal/admin/screening-questions",
                        icon: <Building className="w-4" />,
                        title: "Screening Questions",
                    },
                ]}
            />

            <div className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Screening Questions</h1>
                    <Dialog
                        open={isAddModalOpen}
                        onOpenChange={setIsAddModalOpen}
                    >
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Question
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Add New Screening Question
                                </DialogTitle>
                            </DialogHeader>
                            <AddQuestionModal
                                onClose={() => setIsAddModalOpen(false)}
                                onSuccess={() => {
                                    queryClient.invalidateQueries([
                                        "screeningQuestions",
                                    ]);
                                    setIsAddModalOpen(false);
                                }}
                            />
                        </DialogContent>
                    </Dialog>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Question</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Expected Response</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {questions.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="text-center py-8 text-muted-foreground"
                                        >
                                            No screening questions found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    questions.map((question) => (
                                        <TableRow key={question.id}>
                                            <TableCell className="font-medium">
                                                {question.question_text}
                                            </TableCell>
                                            <TableCell className="uppercase">
                                                {question.question_type}
                                            </TableCell>
                                            <TableCell>
                                                {question.expected_response ||
                                                    "-"}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        question.is_active
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                >
                                                    {question.is_active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(question.createdAt)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            handleEditClick(question)
                                                        }
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-600"
                                                        onClick={() =>
                                                            handleDeleteClick(question)
                                                        }
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* Pagination controls */}
                <div className="flex justify-end mt-4 gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1 || isLoading}
                        onClick={() =>
                            setCurrentPage((p) => Math.max(p - 1, 1))
                        }
                    >
                        Prev
                    </Button>
                    <span className="self-center text-sm">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={
                            currentPage === pagination.totalPages || isLoading
                        }
                        onClick={() =>
                            setCurrentPage((p) =>
                                Math.min(p + 1, pagination.totalPages)
                            )
                        }
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/* Edit Modal */}
            {editingQuestion && (
                <Dialog
                    open={!!editingQuestion}
                    onOpenChange={() => setEditingQuestion(null)}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Screening Question</DialogTitle>
                        </DialogHeader>
                        <EditQuestionModal
                            question={editingQuestion}
                            onClose={() => setEditingQuestion(null)}
                            onSuccess={() => {
                                queryClient.invalidateQueries([
                                    "screeningQuestions",
                                ]);
                                setEditingQuestion(null);
                            }}
                        />
                    </DialogContent>
                </Dialog>
            )}

            {/* Delete Confirmation */}
            <AlertDialog
                open={!!deletingQuestion}
                onOpenChange={() => setDeletingQuestion(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the screening question "
                            {deletingQuestion?.question_text}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleteMutation.isLoading}
                        >
                            {deleteMutation.isLoading
                                ? "Deleting..."
                                : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
