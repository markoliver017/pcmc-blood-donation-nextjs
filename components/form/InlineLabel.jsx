"use client";
import RequiredLabelComponent from "./RequiredLabelComponent";

export default function InlineLabel({ children, required = true, optional = false }) {
    return (
        <label className="fieldset-label text-gray-900 text-lg font-semibold min-w-auto lg:min-w-[200px] dark:text-slate-50">
            {children}

            {required ?
                <RequiredLabelComponent /> : ""
            }
            {optional ?
                <i className="text-slate-500 text-sm"><sup>(optional)</sup></i> : ""
            }
        </label>
    );
}
