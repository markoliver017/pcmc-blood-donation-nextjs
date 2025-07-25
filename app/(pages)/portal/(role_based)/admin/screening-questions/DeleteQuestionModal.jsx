"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

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

import { deleteScreeningQuestion } from "@action/screeningQuestionAction";

export default function DeleteQuestionModal({ question, onClose, onSuccess }) {
    const deleteMutation = useMutation({
        mutationFn: () => deleteScreeningQuestion(question.id),
        onSuccess: (result) => {
            if (result.success) {
                toast.success(result.message);
                onSuccess();
            } else {
                toast.error(result.message);
            }
            onClose();
        },
        onError: (error) => {
            toast.error("Failed to delete question.");
            onClose();
        },
    });

    return (
        <AlertDialog open={!!question} onOpenChange={() => onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        screening question: **"{question?.question_text}"**
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => deleteMutation.mutate()}
                        disabled={deleteMutation.isPending}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
