import { fetchFaqs } from "@/action/faqAction";
import { searchFAQs, formatFAQsForContext } from "@lib/utils/faq.utils";

export async function POST(request) {
    try {
        const { message, history } = await request.json();

        if (!message?.trim()) {
            return new Response(
                JSON.stringify({ error: "Message is required" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Build a minimal conversational context (optional, keeps the last few turns)
        let prompt = "";
        const recentHistory = history.slice(-6);
        for (const msg of recentHistory) {
            prompt += `${msg.role === "user" ? "Human" : "Assistant"}: ${
                msg.content
            }\n`;
        }
        console.log("User recent question", message);
        console.log("Prompt>>>>", prompt);

        const faqData = await fetchFaqs({ is_active: true });
        if (!faqData.success) {
            return new Response(
                JSON.stringify({ error: "Failed to fetch FAQs" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }
        // Retrieve relevant FAQs and format as grounding context
        const faqs = searchFAQs(message, faqData.data, 5);
        let faqContext = "(No relevant FAQs found)";

        // If we don't have any relevant FAQs, short-circuit with a clear message (no model call)
        // if (faqs.length === 0) {
        //     const canned =
        //         "I don't have enough information in the FAQs to answer that. Please contact support or visit the help center.";
        //     const readable = new ReadableStream({
        //         start(controller) {
        //             controller.enqueue(new TextEncoder().encode(canned));
        //             controller.close();
        //         },
        //     });
        //     return new Response(readable, {
        //         status: 200,
        //         headers: {
        //             "Content-Type": "text/plain; charset=utf-8",
        //             "Cache-Control": "no-cache, no-transform",
        //             "Transfer-Encoding": "chunked",
        //         },
        //     });
        // }

        if (faqs.length > 0) {
            faqContext = formatFAQsForContext(faqs);
        }

        console.log("FAQ Context>>>>", faqContext);

        const systemInstruction = `
            You are a helpful assistant that must answer ONLY using the FAQ context provided.

            Rules (read all the rules before responding):

            1. If the FAQ context contains a clear answer to the <<<HUMAN’s question>>>, 
            repeat ONLY that answer exactly. Do not add disclaimers, warnings, or outside advice.

            2. If the <<<HUMAN’s question>>> is incomplete, vague, or a single word, 
            ask politely for clarification. Do not attempt to answer.

            3. Never invent, guess, or use previous conversation or outside knowledge. 
            If an answer is not explicitly in the FAQ context, fall back to Rule 0.

            4. If <<<FAQ_CONTEXT>>> says "(No relevant FAQs found)", 
            you MUST ignore the previous conversation as a context and the <<<HUMAN’s question>>>, 
            and respond ONLY with this exact sentence:
            "I don't have enough information in the FAQs to answer that. Please contact support or visit the help center."

            Style:
            - Be short, clear, and direct.
            - Use plain, friendly language.
            - No extra commentary or filler.
            `;

        const composedPrompt = `
            ${systemInstruction}

            <<<FAQ_CONTEXT>>>
            ${faqContext}
            <<<END_FAQ_CONTEXT>>>

            <<<PREVIOUS_CONVERSATION>>>
            ${prompt.trim()}
            <<<END_PREVIOUS_CONVERSATION>>>

            <<<HUMAN_QUESTION>>>
            ${message.trim()}
            <<<END_HUMAN_QUESTION>>>

            Assistant:`;

        console.log("Composed Prompt>>>>", composedPrompt);

        // Call Ollama API with streaming enabled
        const apiUrl =
            process.env.OLLAMA_API_URL ?? "http://localhost:11434/api/generate";

        const ollamaResponse = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: process.env.OLLAMA_API_MODEL ?? "llama2",
                prompt: composedPrompt,
                stream: true,
                options: {
                    temperature: 0.1,
                    top_p: 0.9,
                    top_k: 40,
                },
            }),
        });

        if (!ollamaResponse.ok || !ollamaResponse.body) {
            throw new Error(`Ollama API error: ${ollamaResponse.status}`);
        }

        // Stream JSONL -> plaintext tokens
        const readable = new ReadableStream({
            async start(controller) {
                const reader = ollamaResponse.body.getReader();
                const encoder = new TextEncoder();
                const decoder = new TextDecoder();
                let buffer = "";
                try {
                    while (true) {
                        const { value, done } = await reader.read();
                        if (done) break;
                        buffer += decoder.decode(value, { stream: true });
                        let idx;
                        while ((idx = buffer.indexOf("\n")) !== -1) {
                            const line = buffer.slice(0, idx).trim();
                            buffer = buffer.slice(idx + 1);
                            if (!line) continue;
                            try {
                                const json = JSON.parse(line);
                                if (json.response)
                                    controller.enqueue(
                                        encoder.encode(json.response)
                                    );
                            } catch {
                                // ignore malformed lines
                            }
                        }
                    }
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(readable, {
            status: 200,
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache, no-transform",
                "Transfer-Encoding": "chunked",
            },
        });
    } catch (error) {
        console.error("FAQ Chat API Error:", error);
        return new Response(
            JSON.stringify({
                error: "Failed to process FAQ chat request",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
