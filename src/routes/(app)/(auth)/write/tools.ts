import IconBold from "$lib/icons/bold.svg?component";
import IconItalic from "$lib/icons/italic.svg?component";
import IconStrikethrough from "$lib/icons/strikethrough.svg?component";
import IconUnderline from "$lib/icons/underline.svg?component";
import { KeyCode, type editor } from "monaco-editor/esm/vs/editor/editor.api";
import type { SvelteComponent } from "svelte";

type ToolIcon = typeof SvelteComponent<{ size?: number }>;

export interface Tool {
    /** Text to display for the tool. */
    label: string;
    /** Icon to display for the tool. */
    icon: ToolIcon;
    /** Shortcut key to use for the tool - always paired with Ctrl or Cmd. */
    shortcutKey?: number;
    // /** Whether the tool is currently active. */
    // active?: (editor: Monaco.editor.IStandaloneCodeEditor) => boolean;
    /** Executes the tool behavior. */
    execute: (editor: editor.IStandaloneCodeEditor) => void;
}

export const TOOLS: Tool[] = [
    {
        label: "Bold",
        icon: IconBold,
        shortcutKey: KeyCode.KeyB,
        execute: (editor) => applyMark(editor, "**", "**"),
    },
    {
        label: "Italic",
        icon: IconItalic,
        shortcutKey: KeyCode.KeyI,
        execute: (editor) => applyMark(editor, "_", "_"),
    },
    {
        label: "Underline",
        icon: IconUnderline,
        shortcutKey: KeyCode.KeyU,
        execute: (editor) => applyMark(editor, "<ins>", "</ins>"),
    },
    {
        label: "Strikethrough",
        icon: IconStrikethrough,
        shortcutKey: KeyCode.Minus,
        execute: (editor) => applyMark(editor, "~~", "~~"),
    },
];

/**
 * Applies the given prefix/suffix to the current editor selection. If there
 * is no selection, the prefix/suffix is inserted at the cursor position and the
 * cursor is moved to the point before the suffix.
 */
function applyMark(editor: editor.IStandaloneCodeEditor, prefix: string, suffix: string) {
    const sel = editor?.getSelection();
    if (!sel) return;

    const wasEmpty = sel.isEmpty();
    const inner = editor.getModel()?.getValueInRange(sel) ?? "";
    editor.executeEdits("", [
        {
            range: sel,
            text: `${prefix}${inner}${suffix}`,
            forceMoveMarkers: true,
        },
    ]);

    editor.focus();

    if (wasEmpty) {
        editor.setSelection({
            startLineNumber: sel.startLineNumber,
            startColumn: sel.startColumn + prefix.length,
            endLineNumber: sel.endLineNumber,
            endColumn: sel.endColumn + prefix.length,
        });
    }
}