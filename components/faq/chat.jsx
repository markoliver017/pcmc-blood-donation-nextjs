"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";

export default function Chat({
    endpoint = "/api/faq-chat",
    title = "Local Chatbot",
}) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const submitMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Send the full conversation including the current user message
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

            // Prepare a placeholder assistant message we will stream into
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
                // Fallback if no stream body, try reading full text
                const full = await response.text();
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === assistantId ? { ...m, content: full } : m
                    )
                );
                return;
            }

            const decoder = new TextDecoder();
            // Stream chunks and append to the assistant message as they arrive
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
                    "Sorry, I encountered an error. Please make sure Ollama is running.",
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

        // Submit on Cmd+Enter (Mac) or Ctrl+Enter (Win/Linux)
        if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            submitMessage();
            return;
        }

        // Submit on Enter (no Shift) when not composing with IME
        if (!e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            submitMessage();
        }
    };

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
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

    return (
        <div className="flex flex-col h-[calc(80vh-56px)] bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <Bot className="w-6 h-6 text-blue-600" />
                        {title}
                    </h1>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {messages.length === 0 && (
                        <div className="text-center py-12">
                            <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-600 mb-2">
                                Welcome to {title}
                            </h3>
                            <p className="text-gray-500">
                                Start a conversation with your locally running
                                Llama model
                            </p>
                        </div>
                    )}

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
                                className={`max-w-3xl px-4 py-3 rounded-lg ${
                                    message.role === "user"
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-800 border border-gray-200"
                                }`}
                            >
                                <div className="prose prose-sm max-w-none">
                                    <pre className="whitespace-pre-wrap font-sans">
                                        {message.content}
                                    </pre>
                                </div>
                                <div
                                    className={`text-xs mt-2 ${
                                        message.role === "user"
                                            ? "text-blue-100"
                                            : "text-gray-500"
                                    }`}
                                >
                                    {formatTime(message.timestamp)}
                                </div>
                            </div>

                            {message.role === "user" && (
                                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
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
                            <div className="bg-white text-gray-800 border border-gray-200 px-4 py-3 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Form */}
            <div className="bg-white border-t border-gray-200 px-4 py-4">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="flex gap-3">
                        <div className="flex-1 relative">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your message... (Enter to send, Shift+Enter for new line, Cmd/Ctrl+Enter to send)"
                                disabled={isLoading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 dark:text-gray-700"
                                style={{ minHeight: "52px" }}
                                rows={1}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
