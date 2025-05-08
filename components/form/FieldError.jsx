import { BiError } from "react-icons/bi";

export default function FieldError({ field }) {
    if (!field) return "";

    return (
        <p className="text-red-500 text-sm flex-items-center">
            <BiError />
            {field.message}
        </p>
    );
}
