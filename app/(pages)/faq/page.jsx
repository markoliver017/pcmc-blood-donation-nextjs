import Chat from "@components/faq/chat";

export const metadata = {
    title: "FAQ Chat",
    description: "Chat that answers strictly from local FAQs",
};

export default function FAQPage() {
    return (
        <main className="w-1/2 mx-auto">
            <Chat endpoint="/api/faq-chat" title="FAQ Chat" />
        </main>
    );
}
