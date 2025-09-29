# mokai

> Tiny, dependency‑free code editor for the web – minimal DOM, minimal API, fast edits.

![npm version](https://badgen.net/npm/v/mokai?labelColor=1d2734&color=21bf81)
![license](https://badgen.net/github/license/jmjuanes/mokai?labelColor=1d2734&color=21bf81)

Why another embeddable editor? I wanted something extremely small and predictable for editing short snippets of HTML / JS / CSS / Markdown without shipping a full IDE. Mokai focuses on: tiny surface area, no virtual DOM, no workers by default, and opt‑in syntax highlighting.

## Demo

Visit https://www.josemi.xyz/mokai for a live demo.

## Features

- ~1 small function: default export returns an editor object.
- No dependencies, no build step required (ESM + CDN friendly).
- Optional line numbers.
- Optional auto indent + bracket / quote auto‑closing.
- Pluggable syntax highlighting (bring your own or use `mokai-syntax`).
- Theming via plain CSS classes (`mokai-themes` package).
- Esc + Tab / Esc + Shift+Tab focus escape (avoid keyboard trap).

## Install

### Using a package manager

You can install `mokai` via **npm** or **yarn**:

```bash
# npm
npm install mokai

# yarn
yarn add mokai
```

Then import the stylesheet (ships as `styles.css`) and the editor:

```js
import "mokai/styles.css";         // core layout + base token hooks (no colors)
import mokai from "mokai";
```

### Via CDN (unpkg example)

```html
<link rel="stylesheet" href="https://unpkg.com/mokai/styles.css">
<link rel="stylesheet" href="https://unpkg.com/mokai-themes/styles.css">
<div id="editor"></div>
<script type="module">
    import mokai from "https://unpkg.com/mokai/index.js";
    const editor = mokai(document.getElementById("editor"), {
        language: "javascript",
        className: "mokai-dark", // requires theme CSS from mokai-themes
        lineNumbers: true,
    });
    editor.set("console.log('Hello Mokai');\n");
    editor.on("change", ({ value }) => console.log("Changed:", value));
</script>
```

## Quick start (module bundler)

```js
import "mokai/styles.css";            // structural styles
import "mokai-themes/styles.css";     // optional: bundled themes
import mokai from "mokai";
import highlight from "mokai-syntax"; // optional highlighting

const editor = mokai(document.getElementById("editor"), {
    language: "javascript",
    highlight,
    className: "mokai-one-dark",
    lineNumbers: true,
});

editor.on("change", ({ value }) => {
    console.log("Current code:", value);
});

editor.set("function hi() {\n  console.log('hi');\n}\n");
```

## API

### `mokai(parent: HTMLElement, options?: MokaiOptions): MokaiEditor`

Creates the editor inside `parent` (Mokai appends its internal DOM). Returns an object implementing:

| Method | Description |
|--------|-------------|
| `get()` | Returns current code (always ends with a newline). |
| `set(code)` | Replaces the entire content (adds trailing newline if missing). |
| `on(event, listener)` | Subscribe to an event (`change`, `keydown`, `keyup`). For `change` you get `{ value }`. Keyboard events receive the native event. |
| `off(event)` | Unsubscribe / remove the listener for that event. |

### Options (`MokaiOptions`)

| Option | Type | Default | Notes |
|--------|------|---------|-------|
| `language` | `string` | `""` | Passed to your `highlight` function. |
| `readOnly` | `boolean` | `false` | Disables content edits. |
| `lineNumbers` | `boolean` | `false` | Shows a gutter with line numbers. |
| `indentWithTabs` | `boolean` | `false` | Use `\t` instead of spaces. |
| `tabSize` | `number` | `4` | Number of spaces per indent (ignored if tabs). |
| `autoIndent` | `boolean` | `true` | Indent new lines and create extra line after closing braces when appropriate. |
| `addClosing` | `boolean` | `true` | Auto insert matching `()`, `[]`, `{}`, quotes. |
| `highlight` | `(code, lang) => string` | `undefined` | Return HTML string (Mokai injects as `innerHTML`). Entire code passed (always newline‑terminated). |
| `className` | `string` | `""` | Extra class names applied to root `.mokai` element (used for themes). |

### TypeScript

Types are bundled. Import them if you need compile‑time safety:

```ts
import type { MokaiOptions, MokaiEditor } from "mokai";
```

## Syntax highlighting

Mokai does not bundle a highlighter. You can:

1. Use the tiny companion package `mokai-syntax` (HTML / JS / CSS / Markdown) – predictable, minimal.
2. Integrate a third‑party library (Prism, highlight.js, Shiki, etc.). Just ensure you return raw HTML with escaped content + token spans from your `highlight` function.

Example with `mokai-syntax`:

```js
import highlight from "mokai-syntax";
const editor = mokai(parent, {
    language: "javascript",
    highlight: (code, lang) => highlight(code, lang),
});

editor.on("change", ({ value }) => console.log(value));
```

Example with highlight.js:

```js
import hljs from "highlight.js";
const editor = mokai(parent, {
    language: "javascript",
    highlight: (code, lang) => hljs.highlight(code, { language: lang || "plaintext" }).value,
});

editor.on("change", ({ value }) => {/* handle updated code */});
```

## Themes

Install `mokai-themes` for a small bundle of ready‑made themes:

```bash
npm install mokai-themes
```

```js
import "mokai/styles.css";          // core editor structure
import "mokai-themes/styles.css";   // theme classes

const editor = mokai(parent, { className: "mokai-dark" });
```

Available themes (see `mokai-themes` README for details): `mokai-light`, `mokai-dark`, `mokai-monoblue`, `mokai-one-light`, `mokai-one-dark`.

Create your own by defining `.mokai-my-theme { ... }` plus token color rules (e.g. `.mokai-my-theme .token-keyword { color:#c92c2c; }`) and pass `className: "mokai-my-theme"`.

## Accessibility & Focus Management

Mokai is designed to avoid trapping keyboard focus within the editor, supporting accessible navigation for all users. Editor content uses `contenteditable` (with `plaintext-only` where supported) and does not permanently trap focus.

- **Move focus forward:** Press `Esc` then `Tab` to shift focus to the next focusable element.
- **Move focus backward:** Press `Esc` then `Shift+Tab` to shift focus to the previous focusable element.
- **Indentation:** The `Tab` key is reserved for code indentation, as is common in code editors.

These shortcuts help prevent keyboard trap scenarios, ensuring users can easily navigate away from the editor when needed. Mokai intentionally does not provide a built-in shortcuts help UI; document any shortcuts in your host application as needed.

## Design notes / limitations

- Not a full IDE: no search panel, no multi‑file model, no undo stack persistence beyond browser default selection behavior.
- Highlighting is whatever you provide – Mokai just injects HTML.
- Entire document is re‑highlighted (keep code blocks modest for best performance).
- Internally Mokai ensures the stored code ends with a newline; account for that if doing diffing.

## Migration from CodeCake

If you used the earlier name `codecake`:

| Before (`codecake`) | Now (`mokai`) |
|---------------------|---------------|
| `import * as CodeCake from "codecake";` | `import mokai from "mokai";` |
| `CodeCake.create(parent, opts)` | `mokai(parent, opts)` (default export) |
| `cake.getCode() / cake.setCode()` | `editor.get() / editor.set()` |
| `cake.onChange(code => { ... })` | `editor.on("change", ({ value }) => { ... })` |
| `cake.onKeyDown(fn) / cake.onKeyUp(fn)` | `editor.on("keydown", fn) / editor.on("keyup", fn)` |
| `CodeCake.highlight` (bundled) | Use `mokai-syntax` or another highlighter |
| Themes `codecake-light/dark` | Themes now provided by `mokai-themes` (`mokai-light`, `mokai-dark`, etc.) |
| CSS `codecake.css` | `mokai/styles.css` |

No behavioral breaking changes other than renaming and moving the optional highlighter to a separate package.

## Security

If you supply a `highlight` function, ensure it escapes untrusted content. The companion `mokai-syntax` already escapes all raw characters. Only inject the resulting HTML into trusted containers (never into attributes or unsanitized contexts) to avoid XSS.

## License

Mokai is released under the [MIT License](./LICENSE).

> Questions / tiny improvements welcome – open an issue or PR.
