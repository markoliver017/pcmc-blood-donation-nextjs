"use client";

const ToggleAny = ({ value, onChange, children }) => {
    return (
        <div className="flex items-center gap-1 w-max rounded-2xl">
            <div
                className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    value ? "bg-green-500" : "bg-gray-300"
                }`}
                onClick={() => onChange()} // Update the value on click
            >
                <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                        value ? "translate-x-6" : "translate-x-0"
                    }`}
                ></div>
            </div>

            {children}
        </div>
    );
};

export default ToggleAny;
