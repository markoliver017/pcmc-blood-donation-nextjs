"use client";

import { useState, useRef, useEffect } from "react";
import {
    Send,
    Bot,
    User,
    Loader2,
    Copy,
    ThumbsUp,
    ThumbsDown,
    Check,
} from "lucide-react";
import { Button } from "@components/ui/button";
import QuickQuestions from "./QuickQuestions";
import { toast, Toaster } from "sonner";

export default function ChatDrawer({
    endpoint = "/api/faq-chat",
    title = "FAQ Assistant",
    onClearConversation,
}) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState({});
    const [copiedId, setCopiedId] = useState(null);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const submitMessage = async (isQuickQuestion = false, content = "") => {
        if (!isQuickQuestion && (!input.trim() || isLoading)) {
            console.log("Input is empty or loading");
            return;
        }

        const userMessage = {
            id: Date.now().toString(),
            role: "user",
            content: isQuickQuestion ? content : input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const historyPayload = [
                ...messages.map((m) => ({ role: m.role, content: m.content })),
                { role: "user", content: userMessage.content },
            ];

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: userMessage.content,
                    history: historyPayload,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to get response");
            }

            const assistantId = (Date.now() + 1).toString();
            const assistantMessage = {
                id: assistantId,
                role: "assistant",
                content: "",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMessage]);

            const reader = response.body?.getReader();
            if (!reader) {
                const full = await response.text();
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === assistantId ? { ...m, content: full } : m
                    )
                );
                return;
            }

            const decoder = new TextDecoder();
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                if (!chunk) continue;
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === assistantId
                            ? { ...m, content: m.content + chunk }
                            : m
                    )
                );
            }
        } catch (error) {
            console.error("Error:", error);
            const errorMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content:
                    "Sorry, I encountered an error. Please make sure the FAQ service is running.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitMessage();
    };

    const handleKeyDown = (e) => {
        if (e.key !== "Enter") return;

        if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            submitMessage();
            return;
        }

        if (!e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            submitMessage();
        }
    };

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = Math.min(textarea.scrollHeight, 150) + "px";
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [input]);

    const formatTime = (date) => {
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleQuickQuestion = (question) => {
        setInput(question);
        // Auto-submit after a brief delay
        setTimeout(() => {
            submitMessage(true, question);
        }, 100);
    };

    const handleCopyMessage1 = async (content, messageId) => {
        try {
            await navigator.clipboard.writeText(content);
            setCopiedId(messageId);
            toast.success("Message copied to clipboard!");
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            // Fallback for older browsers
            console.log("Fallback for older browsers", err);
            toast.error("Failed to copy message");
            // const textArea = document.createElement("textarea");
            // textArea.value = content;
            // document.body.appendChild(textArea);
            // textArea.select();
            // try {
            //     document.execCommand("copy");
            //     setCopiedId(messageId);
            //     toast.success("Message copied to clipboard!");
            //     setTimeout(() => setCopiedId(null), 2000);
            // } catch (err) {
            // }
            // document.body.removeChild(textArea);
        }
    };

    const handleCopyMessage = async (content, messageId) => {
        try {
            // Modern API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(content);
            } else {
                // Fallback
                const textArea = document.createElement("textarea");
                textArea.value = content;
                textArea.style.position = "fixed"; // avoid scrolling
                textArea.style.opacity = "0"; // hidden but selectable
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                const successful = document.execCommand("copy");
                document.body.removeChild(textArea);

                if (!successful) {
                    throw new Error("Fallback copy failed");
                }
            }

            setCopiedId(messageId);
            toast.success("Message copied to clipboard!");
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error("Copy failed", err);
            toast.error("Failed to copy message");
        }
    };

    const handleFeedback = (messageId, type) => {
        setFeedback((prev) => ({
            ...prev,
            [messageId]: prev[messageId] === type ? null : type,
        }));

        // You can send feedback to backend here
        // Example: sendFeedbackToAPI(messageId, type);

        const feedbackText = type === "positive" ? "positive" : "negative";
        toast.info(`Thank you for your ${feedbackText} feedback!`);
    };

    // Expose clear function to parent
    useEffect(() => {
        if (onClearConversation) {
            onClearConversation(() => {
                setMessages([]);
                setFeedback({});
                setInput("");
            });
        }
    }, [onClearConversation]);

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-slate-900">
            {/* Messages Container */}
            <Toaster />
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-4xl mx-auto space-y-4">
                    {/* {messages.length === 0 && ( */}
                    <div className="text-center py-8">
                        <Bot className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                            Welcome to {title}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                            Ask me anything about blood donation, eligibility,
                            the donation process, or our services!
                        </p>
                        <QuickQuestions
                            onQuestionClick={handleQuickQuestion}
                            disabled={isLoading}
                        />
                    </div>
                    {/* )} */}

                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-3 ${
                                message.role === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            {message.role === "assistant" && (
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                            )}

                            <div
                                className={`max-w-[80%] ${
                                    message.role === "user" ? "" : "space-y-2"
                                }`}
                            >
                                <div
                                    className={`px-4 py-3 rounded-lg ${
                                        message.role === "user"
                                            ? "bg-blue-600 text-white"
                                            : "bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-slate-700"
                                    }`}
                                >
                                    <div className="prose prose-sm max-w-none dark:prose-invert">
                                        <pre className="whitespace-pre-wrap font-sans text-sm">
                                            {message.content}
                                        </pre>
                                    </div>
                                    <div
                                        className={`text-xs mt-2 ${
                                            message.role === "user"
                                                ? "text-blue-100"
                                                : "text-gray-500 dark:text-gray-400"
                                        }`}
                                    >
                                        {formatTime(message.timestamp)}
                                    </div>
                                </div>

                                {/* Copy and Feedback buttons for assistant messages */}
                                {message.role === "assistant" &&
                                    message.content && (
                                        <div className="flex items-center gap-2 px-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 px-2 text-xs dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700"
                                                onClick={() =>
                                                    handleCopyMessage(
                                                        message.content,
                                                        message.id
                                                    )
                                                }
                                            >
                                                {copiedId === message.id ? (
                                                    <>
                                                        <Check className="w-3 h-3 mr-1" />
                                                        Copied
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3 h-3 mr-1" />
                                                        Copy
                                                    </>
                                                )}
                                            </Button>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className={`h-7 w-7 p-0 hover:bg-green-50 dark:hover:bg-green-900/20 dark:text-slate-400 ${
                                                        feedback[message.id] ===
                                                        "positive"
                                                            ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleFeedback(
                                                            message.id,
                                                            "positive"
                                                        )
                                                    }
                                                >
                                                    <ThumbsUp className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className={`h-7 w-7 p-0 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-slate-400 ${
                                                        feedback[message.id] ===
                                                        "negative"
                                                            ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleFeedback(
                                                            message.id,
                                                            "negative"
                                                        )
                                                    }
                                                >
                                                    <ThumbsDown className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                            </div>

                            {message.role === "user" && (
                                <div className="w-8 h-8 bg-gray-600 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3 justify-start">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-slate-700 px-4 py-3 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Loading...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Form */}
            <div className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 md:p-4 p-2">
                <div className="max-w-4xl mx-auto">
                    <form
                        onSubmit={handleSubmit}
                        className="flex gap-1 md:gap-3"
                    >
                        <div className="flex-1 relative">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
                                disabled={isLoading}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                                style={{ minHeight: "82px" }}
                                rows={1}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
