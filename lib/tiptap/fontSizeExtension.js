import { Extension } from "@tiptap/core";
// import TextStyle from '@tiptap/extension-text-style';

export const FontSize = Extension.create({
    name: "fontSize",

    addOptions() {
        return {
            types: ["textStyle"],
            defaultFontSize: "16px",
            minFontSize: 8,
            maxFontSize: 72,
            fontSizeStep: 2,
        };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: this.options.defaultFontSize,
                        parseHTML: (element) =>
                            element.style.fontSize.replace(/['"]+/g, "") ||
                            this.options.defaultFontSize,
                        renderHTML: (attributes) => {
                            if (!attributes.fontSize) {
                                return {};
                            }
                            return {
                                style: `font-size: ${attributes.fontSize}`,
                            };
                        },
                    },
                },
            },
        ];
    },

    addCommands() {
        return {
            setFontSize:
                (fontSize) =>
                ({ chain }) => {
                    return chain()
                        .setMark("textStyle", { fontSize: `${fontSize}px` })
                        .run();
                },
            unsetFontSize:
                () =>
                ({ chain }) => {
                    return chain()
                        .setMark("textStyle", { fontSize: null })
                        .removeEmptyTextStyle()
                        .run();
                },
            increaseFontSize:
                () =>
                ({ chain, state }) => {
                    const { selection } = state;
                    const { $from } = selection;
                    const marks = $from.marks();
                    const textStyleMark = marks.find(
                        (mark) => mark.type.name === "textStyle"
                    );
                    const currentFontSize = textStyleMark?.attrs.fontSize
                        ? parseInt(
                              textStyleMark.attrs.fontSize.replace("px", ""),
                              10
                          )
                        : parseInt(
                              this.options.defaultFontSize.replace("px", ""),
                              10
                          );
                    const newFontSize = Math.min(
                        currentFontSize + this.options.fontSizeStep,
                        this.options.maxFontSize
                    );
                    return chain()
                        .setMark("textStyle", { fontSize: `${newFontSize}px` })
                        .run();
                },
            decreaseFontSize:
                () =>
                ({ chain, state }) => {
                    const { selection } = state;
                    const { $from } = selection;
                    const marks = $from.marks();
                    const textStyleMark = marks.find(
                        (mark) => mark.type.name === "textStyle"
                    );
                    const currentFontSize = textStyleMark?.attrs.fontSize
                        ? parseInt(
                              textStyleMark.attrs.fontSize.replace("px", ""),
                              10
                          )
                        : parseInt(
                              this.options.defaultFontSize.replace("px", ""),
                              10
                          );
                    const newFontSize = Math.max(
                        currentFontSize - this.options.fontSizeStep,
                        this.options.minFontSize
                    );
                    return chain()
                        .setMark("textStyle", { fontSize: `${newFontSize}px` })
                        .run();
                },
        };
    },
});
