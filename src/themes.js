import {EditorView} from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

const createTheme = (mainStyles, highlightStyles, isDark) => {
    const theme = EditorView.theme({
        '&': {
            backgroundColor: mainStyles.background,
            color: mainStyles.foreground,
        },
        '.cm-content': {
            caretColor: mainStyles.caret,
        },
        '.cm-cursor, .cm-dropCursor': {
            borderLeftColor: mainStyles.caret,
        },
        '&.cm-selectionMatch .cm-snippetField': {
            backgroundColor: mainStyles.selection,
        },
        '&.cm-focused .cm-selectionBackgroundm .cm-selectionBackground, .cm-content ::selection':
        {
            backgroundColor: mainStyles.selection,
        },
        '.cm-activeLine': {
            borderTop: "1px solid " + mainStyles.lineHighlight,
            borderBottom: "1px solid " + mainStyles.lineHighlight,
            background: "transparent"
        },
        '.cm-gutters': {
            backgroundColor: mainStyles.gutterBackground,
            color: mainStyles.gutterForeground,
        },
        '.cm-activeLineGutter': {
            borderTop: "1px solid " + mainStyles.lineHighlight,
            borderBottom: "1px solid " + mainStyles.lineHighlight,
            background: "transparent"
        }
    }, 
    { dark: isDark });
    
    const highlightStyle = HighlightStyle.define(highlightStyles);
	const extension = [theme, syntaxHighlighting(highlightStyle)];
	return extension;
}

export const lightTheme = createTheme(
    {
        background: '#FFFFFF',
		foreground: '#4D4D4C',
		caret: '#AEAFAD',
		selection: '#D6D6D6',
		gutterBackground: '#FFFFFF',
		gutterForeground: '#4D4D4C80',
		lineHighlight: '#f2f1f1'
    },
    [
		{
			tag: tags.comment,
			color: '#8E908C',
		},
		{
			tag: [tags.variableName, tags.self, tags.propertyName, tags.attributeName, tags.regexp],
			color: '#289dc8',
		},
		{
			tag: [tags.number, tags.bool, tags.null],
			color: '#F5871F',
		},
		{
			tag: [tags.className, tags.typeName, tags.definition(tags.typeName)],
			color: '#C99E00',
		},
		{
			tag: [tags.string, tags.special(tags.brace)],
			color: '#718C00',
		},
		{
			tag: tags.operator,
			color: '#3E999F',
		},
		{
			tag: [tags.definition(tags.propertyName), tags.function(tags.variableName)],
			color: '#4271AE',
		},
		{
			tag: tags.keyword,
			color: '#8959A8',
		},
		{
			tag: tags.derefOperator,
			color: '#4D4D4C',
		},
	],
    false
);

export const darkTheme = createTheme(
    {
        background: '#242424',
		foreground: '#fafafa',
		caret: '#AEAFAD',
		selection: '#D6D6D6',
		gutterBackground: '#242424',
		gutterForeground: '#a1a1a1',
		lineHighlight: '#EFEFEF11'
    },
    [
		{
			tag: tags.comment,
			color: '#8E908C',
		},
		{
			tag: [tags.variableName, tags.self, tags.propertyName, tags.attributeName, tags.regexp],
			color: '#42c5f5',
		},
		{
			tag: [tags.number, tags.bool, tags.null],
			color: '#F5871F',
		},
		{
			tag: [tags.className, tags.typeName, tags.definition(tags.typeName)],
			color: '#e8b809',
		},
		{
			tag: [tags.string, tags.special(tags.brace)],
			color: '#71d111',
		},
		{
			tag: tags.operator,
			color: '#45a9b0',
		},
		{
			tag: [tags.definition(tags.propertyName), tags.function(tags.variableName)],
			color: '#5d93d9',
		},
		{
			tag: tags.keyword,
			color: '#b54df7',
		},
		{
			tag: tags.derefOperator,
			color: '#a1a1a1',
		},
	],
    true
)