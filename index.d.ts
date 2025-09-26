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
};

export interface MokaiEditor {
    /** Current editor code (always stored with a trailing newline internally). */
    getCode(): string;

    /** Replace entire editor content. */
    setCode(code: string): void;

    /** Listen to debounced content changes (fires after highlight / processing). */
    onChange(listener: (code: string) => void): void;

    /** Listen to keydown events before internal handling. */
    onKeyDown(listener: (event: KeyboardEvent) => void): void;

    /** Listen to keyup events after internal handling. */
    onKeyUp(listener: (event: KeyboardEvent) => void): void;
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