// fontFamilyExtension.js
import TextStyle from '@tiptap/extension-text-style'

export const FontFamily = TextStyle.extend({
    name: 'fontFamily',

    addOptions() {
        return {
            types: ['textStyle'],
            defaultFontFamily: '',
        }
    },

    addAttributes() {
        return {
            fontFamily: {
                default: this.options.defaultFontFamily,
                parseHTML: element => element.style.fontFamily || this.options.defaultFontFamily,
                renderHTML: attributes => {
                    if (!attributes.fontFamily) {
                        return {}
                    }
                    return {
                        style: `font-family: ${attributes.fontFamily}`,
                    }
                },
            },
        }
    },

    addCommands() {
        return {
            setFontFamily:
                (fontFamily) =>
                    ({ chain }) => {
                        return chain().setMark('textStyle', { fontFamily }).run()
                    },
            unsetFontFamily:
                () =>
                    ({ chain }) => {
                        return chain().setMark('textStyle', { fontFamily: null }).removeEmptyTextStyle().run()
                    },
        }
    },
})
