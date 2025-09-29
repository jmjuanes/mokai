// Type definitions for mokai-syntax
// Project: mokai (syntax highlighting helper)

/**
 * Supported primary language keys.
 */
export type MokaiLanguage = "html" | "javascript" | "css" | "markdown" | "json" | "yaml";

/**
 * Highlight a code snippet into HTML with span tokens.
 *
 * The function is pure (no DOM usage) and returns an HTML string with escaped content
 * wrapped in <span class="token-..."> elements according to simple regex-based rules.
 * Unrecognized languages (or undefined) fall back to JavaScript rules.
 *
 * @param code The raw source code to highlight.
 * @param language Optional language id; defaults to "javascript".
 * @returns HTML string containing highlighted/escaped code.
 */
declare function highlight(code: string, language?: MokaiLanguage | string): string;

export default highlight;
