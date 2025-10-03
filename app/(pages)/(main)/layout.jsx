import FloatingFAQButton from "@components/faq/FloatingFAQButton";

export default function layout({ children }) {
    return (
        <>
            <FloatingFAQButton />
            {children}
        </>
    );
}
