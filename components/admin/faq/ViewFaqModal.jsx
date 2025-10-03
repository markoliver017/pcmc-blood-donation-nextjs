"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFaqById, deleteFaq } from "@action/faqAction";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import FaqCategoryBadge from "./FaqCategoryBadge";
import Skeleton_line from "@components/ui/skeleton_line";
import SweetAlert from "@components/ui/SweetAlert";
import notify from "@components/ui/notify";
import { toastCatchError } from "@lib/utils/toastError.utils";

export default function ViewFaqModal({ faqId, isOpen, onClose, onEdit }) {
    const queryClient = useQueryClient();

    // Fetch FAQ data
    const { data: response, isLoading } = useQuery({
        queryKey: ["faq", faqId],
        queryFn: () => fetchFaqById(faqId),
        enabled: !!faqId && isOpen,
    });

    const faqData = response?.success ? response.data : null;

    // Delete mutation
    const { mutate: handleDelete, isPending: isDeleting } = useMutation({
        mutationFn: async (id) => {
            const res = await deleteFaq(id);
            if (!res.success) {
                throw res;
            }
            return res;
        },
        onSuccess: (data) => {
            notify({
                error: false,
                message: data.message || "FAQ deleted successfully!",
            });
            queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
            onClose();
        },
        onError: (error) => {
            toastCatchError(error);
        },
    });

    const confirmDelete = () => {
        SweetAlert({
            title: "Are you sure?",
            text: "This will deactivate the FAQ. You can reactivate it later.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            onConfirm: () => handleDelete(faqId),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        FAQ Details
                    </DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <Skeleton_line />
                ) : !faqData ? (
                    <div className="py-8">
                        <p className="text-center text-muted-foreground">
                            FAQ not found or you don't have permission to view
                            it.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Status and Category */}
                        <div className="flex items-center gap-2">
                            <FaqCategoryBadge category={faqData.category} />
                            <Badge
                                variant={
                                    faqData.is_active ? "default" : "secondary"
                                }
                            >
                                {faqData.is_active ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant="outline">
                                Order: {faqData.display_order}
                            </Badge>
                        </div>

                        {/* Question */}
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                                Question
                            </h3>
                            <p className="text-lg font-medium dark:text-white">
                                {faqData.question}
                            </p>
                        </div>

                        {/* Answer */}
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                                Answer
                            </h3>
                            <div
                                className="prose dark:prose-invert max-w-none dark:text-white"
                                dangerouslySetInnerHTML={{
                                    __html: faqData.answer,
                                }}
                            />
                        </div>

                        {/* Keywords */}
                        {faqData.keywords && faqData.keywords.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                                    Keywords
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {faqData.keywords.map((keyword, index) => (
                                        <Badge key={index} variant="outline">
                                            {keyword}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Metadata */}
                        <div className="pt-4 border-t space-y-2">
                            {faqData.creator && (
                                <div className="text-sm text-muted-foreground">
                                    <span className="font-semibold">
                                        Created by:
                                    </span>{" "}
                                    {faqData.creator.name} (
                                    {faqData.creator.email})
                                    <br />
                                    <span className="font-semibold">
                                        Created on:
                                    </span>{" "}
                                    {new Date(
                                        faqData.createdAt
                                    ).toLocaleString()}
                                </div>
                            )}
                            {faqData.updater && (
                                <div className="text-sm text-muted-foreground">
                                    <span className="font-semibold">
                                        Last updated by:
                                    </span>{" "}
                                    {faqData.updater.name} (
                                    {faqData.updater.email})
                                    <br />
                                    <span className="font-semibold">
                                        Updated on:
                                    </span>{" "}
                                    {new Date(
                                        faqData.updatedAt
                                    ).toLocaleString()}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <DialogFooter className="flex justify-between sm:justify-between">
                    <Button
                        variant="destructive"
                        onClick={confirmDelete}
                        disabled={isDeleting || !faqData}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                        <Button
                            onClick={() => {
                                onEdit(faqData);
                                onClose();
                            }}
                            disabled={!faqData}
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
