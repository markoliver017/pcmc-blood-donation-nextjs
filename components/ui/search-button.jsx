"use client";
import { useFormStatus } from "react-dom";

export default function SubmitButton() {
    const status = useFormStatus();
    return (
        <button className="btn btn-success w-full" type="submit">
            {status.pending ? "Submitting..." : "Submit Form"}
        </button>
    );
}
