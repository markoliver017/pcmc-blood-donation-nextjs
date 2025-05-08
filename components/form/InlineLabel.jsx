export default function InlineLabel({ children }) {
    return (
        <label className="fieldset-label text-gray-900 text-lg font-semibold min-w-auto lg:min-w-[400px] dark:text-slate-50">
            {children}
        </label>
    );
}
