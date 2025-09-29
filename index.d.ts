export interface MokaiOptions {
    /** Language id passed to the highlight function (if provided). Defaults to "" */
    language?: string;

    /** Read-only mode (disables editing). Defaults to false */
    readOnly?: boolean;

    /** Show line numbers gutter. Defaults to false */
    lineNumbers?: boolean;

    /** Use a tab character instead of spaces for indentation. Defaults to false */
    indentWithTabs?: boolean;

    /** Number of spaces that compose one indentation level (ignored if indentWithTabs). Defaults to 4 */
    tabSize?: number;

    /** Automatically insert matching closing brackets / quotes. Defaults to true */
    addClosing?: boolean;

    /** Automatically indent on new lines. Defaults to true */
    autoIndent?: boolean;

    /** Optional syntax highlighting function returning HTML; receives full code (always ends with a newline) */
    highlight?: (code: string, language: string) => string;

    /** Extra class name(s) added to the root element. */
    className?: string;

    /** Optional initial code value loaded into the editor. If omitted an empty document (with trailing newline) is initialized. */
    value?: string;
};

export type MokaiEventName = "change" | "keydown" | "keyup";

export type MokaiChangeEvent = {
    value: string;
};

export interface MokaiEditor {
    /** Current editor code (always stored with a trailing newline internally). */
    get(): string;

    /** Replace entire editor content. */
    set(value: string): void;

    /**
     * Listen to internal events. Only one listener per event is stored; subsequent calls to `on` with the
     * same event name replace the previous listener. Use `off(event)` to remove the current listener.
     */
    on(eventName: "change", listener: (event: MokaiChangeEvent) => void): void;
    on(eventName: "keydown", listener: (event: KeyboardEvent) => void): void;
    on(eventName: "keyup", listener: (event: KeyboardEvent) => void): void;

    /** Remove listener for the given event. */
    off(eventName: MokaiEventName): void;
};

/**
 * Create a new Mokai editor instance inside a parent container.
 * The parent element will receive the editor DOM structure as children.
 *
 * @param parent Container element (must be attached or attachable to the DOM)
 * @param options Optional editor customization
 */
declare function createMokaiEditor(parent: HTMLElement, options?: MokaiOptions): MokaiEditor;

export default createMokaiEditor;