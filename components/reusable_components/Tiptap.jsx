"use client";

import { FontFamily } from "@lib/tiptap/fontFamilyExtension";
import { FontSize } from "@lib/tiptap/fontSizeExtension";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { useEditor, EditorContent } from "@tiptap/react";
// import { FontFamily } from './fontFamilyExtension'

import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";

// Sample font family options
const fontFamilyOptions = [
    { label: "Default", value: "" },
    { label: "Arial", value: "Arial, sans-serif" },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Courier New", value: '"Courier New", monospace' },
];

const fontSizeOptions = [
    { label: "Small", value: 12 },
    { label: "Normal", value: 16 },
    { label: "Large", value: 24 },
    { label: "Xtra Large", value: 32 },
];

const Tiptap = ({ content = "", onContentChange }) => {
    const [fontSize, setFontSize] = useState(16);
    const [fontFamily, setFontFamily] = useState("");

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Underline,
            FontSize.configure({
                defaultFontSize: "16px",
                minFontSize: 8,
                maxFontSize: 72,
                fontSizeStep: 2,
            }),
            FontFamily.configure({
                defaultFontFamily: "", // or 'Arial, sans-serif'
            }),
            // You need to create or import a FontFamily extension like FontSize
            // For demo, assume you have a similar FontFamily extension configured here
        ],
        content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            if (typeof onContentChange === "function") onContentChange(html);
        },
        editorProps: {
            attributes: {
                class: "px-4 py-2 bg-white dark:bg-inherit text-gray-900 dark:text-gray-50 min-h-[80px] border border-gray-300 rounded",
                tabIndex: "3",
            },
        },
    });

    useEffect(() => {
        if (!editor) return;

        const updateToolbar = () => {
            const { from } = editor.state.selection;
            const marks = editor.state.doc.resolve(from).marks();

            // Font size
            const textStyleMark = marks.find(
                (mark) => mark.type.name === "textStyle"
            );
            const currentFontSize = textStyleMark?.attrs?.fontSize
                ? parseInt(textStyleMark.attrs.fontSize.replace("px", ""), 10)
                : 16;
            setFontSize(currentFontSize);

            // Font family example (if stored in textStyle attrs)
            const currentFontFamily = textStyleMark?.attrs?.fontFamily || "";
            setFontFamily(currentFontFamily);
        };

        updateToolbar();
        editor.on("selectionUpdate", updateToolbar);
        editor.on("transaction", updateToolbar);

        return () => {
            editor.off("selectionUpdate", updateToolbar);
            editor.off("transaction", updateToolbar);
        };
    }, [editor]);

    const toggleBold = () => editor.chain().focus().toggleBold().run();
    const toggleItalic = () => editor.chain().focus().toggleItalic().run();
    const toggleUnderline = () =>
        editor.chain().focus().toggleUnderline().run();

    const handleFontSizeChange = (size) => {
        setFontSize(size);
        editor.chain().focus().setFontSize(size).run();
    };

    const handleFontFamilyChange = (e) => {
        const family = e.target.value;
        setFontFamily(family);
        editor.chain().focus().setFontFamily(family).run(); // Assuming you have this extension
    };

    const undo = () => editor.chain().focus().undo().run();
    const redo = () => editor.chain().focus().redo().run();

    if (!editor) return null;

    return (
        <div className="border rounded p-4">
            <div className="mb-4 flex items-center gap-2">
                {/* Bold */}
                <button
                    onClick={toggleBold}
                    className={`px-2 py-1 border rounded ${
                        editor.isActive("bold") ? "bg-blue-500 text-white" : ""
                    }`}
                    title="Bold"
                    type="button"
                >
                    B
                </button>

                {/* Italic */}
                <button
                    onClick={toggleItalic}
                    className={`px-2 py-1 border rounded ${
                        editor.isActive("italic")
                            ? "bg-blue-500 text-white"
                            : ""
                    }`}
                    title="Italic"
                    type="button"
                >
                    I
                </button>

                {/* Underline */}
                <button
                    onClick={toggleUnderline}
                    className={`px-2 py-1 border rounded ${
                        editor.isActive("underline")
                            ? "bg-blue-500 text-white"
                            : ""
                    }`}
                    title="Underline"
                    type="button"
                >
                    U
                </button>

                {/* Font Size */}
                <select
                    value={fontSize}
                    onChange={(e) =>
                        handleFontSizeChange(Number(e.target.value))
                    }
                    className="px-3 py-1 border rounded"
                    title="Font Size"
                >
                    {fontSizeOptions.map(({ label, value }) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>

                {/* Font Family */}
                {/* <select
                    value={fontFamily}
                    onChange={(e) => {
                        const family = e.target.value
                        setFontFamily(family)
                        editor.chain().focus().setFontFamily(family).run()
                    }}
                >
                    <option value="">Default</option>
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value='"Courier New", monospace'>Courier New</option>
                </select> */}

                {/* Undo */}
                <button
                    onClick={undo}
                    disabled={!editor.can().undo()}
                    className="px-2 py-1 border rounded"
                    title="Undo"
                    type="button"
                >
                    ↺
                </button>

                {/* Redo */}
                <button
                    onClick={redo}
                    disabled={!editor.can().redo()}
                    className="px-2 py-1 border rounded"
                    title="Redo"
                    type="button"
                >
                    ↻
                </button>
            </div>

            <EditorContent editor={editor} />
        </div>
    );
};

export default Tiptap;
