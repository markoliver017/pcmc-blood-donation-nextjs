"use client";

import { useState, useRef } from "react";
import { MessageCircle, X, Trash2, Bot } from "lucide-react";
import { Button } from "@components/ui/button";
import {
    DrawerState,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@components/ui/drawer";
import ChatDrawer from "@components/faq/ChatDrawer";
import SweetAlert from "@components/ui/SweetAlert";

export default function FloatingFAQButton() {
    const [open, setOpen] = useState(false);
    const clearConversationRef = useRef(null);

    const handleClearConversation = () => {
        SweetAlert({
            title: "Clear Conversation?",
            text: "Are you sure you want to clear this conversation? This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, clear it",
            cancelButtonText: "Cancel",
            onConfirm: () => {
                if (clearConversationRef.current) {
                    clearConversationRef.current();
                }
            },
        });
    };

    return (
        <>
            <DrawerState open={open} onOpenChange={setOpen} direction="right">
                <DrawerTrigger asChild>
                    <Button
                        className="fixed bottom-6 text-3xl right-6 h-14 w-14 rounded-full shadow-2xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 z-50 transition-all duration-300 hover:scale-110"
                        size="icon"
                        aria-label="Open FAQ Chat"
                    >
                        {/* <MessageCircle className="h-6 w-6 text-white" /> */}
                        <Bot className="min-w-8 min-h-8" />
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="min-w-full md:min-w-[500px]">
                    <DrawerHeader className="border-b dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <DrawerTitle className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    FAQ Assistant
                                </DrawerTitle>
                                <DrawerDescription>
                                    Ask me anything about blood donation and our
                                    services
                                </DrawerDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
                                    onClick={handleClearConversation}
                                    title="Clear conversation"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                                <DrawerClose asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full"
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </DrawerClose>
                            </div>
                        </div>
                    </DrawerHeader>
                    <div className="flex-1 overflow-hidden">
                        <ChatDrawer
                            endpoint="/api/faq-chat"
                            title="FAQ Assistant"
                            onClearConversation={(clearFn) => {
                                clearConversationRef.current = clearFn;
                            }}
                        />
                    </div>
                </DrawerContent>
            </DrawerState>
        </>
    );
}
