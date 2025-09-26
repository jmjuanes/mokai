# mokai-syntax

![npm version](https://badgen.net/npm/v/mokai-syntax?labelColor=1d2734&color=21bf81)
![license](https://badgen.net/github/license/jmjuanes/mokai?labelColor=1d2734&color=21bf81)

Tiny zero‑dependency syntax highlighter used by the [Mokai](https://github.com/jmjuanes/mokai) web code editor. It is intentionally minimal: a handful of simple (yet carefully ordered) regular expressions that turn source code into an HTML string decorated with `<span class="token-x">` elements. No DOM required, works in browsers and server/runtime environments that support ES Modules.

> If you need a fully–featured, language‑rich, battle‑tested highlighter, you should use something like Prism, highlight.js, Shiki, or CodeMirror. `mokai-syntax` favors tiny footprint and predictable output over exhaustive language coverage.

## Install

### Install using a package manager

You can install `mokai-syntax` using **npm** or **yarn**:

```
## install using NPM
$ npm install mokai-syntax

## install using yarn
$ yarn add mokai-syntax
```

### Install using a CDN

You can also use it directly in the browser via a CDN like **unpkg**:

```html
<script type="module">
	import highlight from "https://unpkg.com/mokai-syntax/index.js";
	const html = highlight("const x = 1;", "javascript");
	document.getElementById("out").innerHTML = html;
</script>

<pre id="out" class="mokai-code"></pre>
```

## Quick start

```js
import highlight from "mokai-syntax";

const src = `function hello(name) {\n  console.log("Hello", name);\n}`;
const html = highlight(src, "javascript");

// html now contains escaped + tokenized markup you can drop inside a <pre><code>
document.querySelector("pre code").innerHTML = html;
```

### With the Mokai editor

```js
import * as Mokai from "mokai";
import highlight from "mokai-syntax";

const editor = Mokai.create(document.getElementById("editor"), {
	language: "javascript",
	highlight,          // directly pass the function
	className: "mokai-dark"
});
```

## API

### `highlight(code: string, language?: MokaiLanguage | string): string`

Default export. Returns an HTML string where recognized tokens are wrapped in:

```html
<span class="token-<name>">escaped text</span>
```

Unknown / unsupported parts of the input are safely HTML‑escaped and emitted without a wrapping span.

#### Parameters

* `code` - raw source code.
* `language` - one of: `html`, `javascript`, `css`, `markdown`. If omitted or not found, JavaScript rules are used as a fallback.

#### Return value

Escaped HTML string. You can inject it as `innerHTML` of a `<code>` or `<pre>` element (never into an attribute) inside a trusted context. The function is pure, side‑effect free, and synchronous.

#### TypeScript

Type definitions are bundled.

```ts
import type { MokaiLanguage } from "mokai-syntax";
```

## Supported tokens / CSS hooks

Each produced `<span>` has class `token-<tokenName>`. Some rules emit multiple space‑separated token names (e.g. `token-title token-function`). Style any of the following (present across the four built‑in languages):

```
comment, string, keyword, constant, number, punctuation, operator,
title, function, word,
tag, attr, attribute, unit,
selector-pseudo, selector-attr, selector-class, selector-id, selector-tag,
section, code, bullet, strong, emphasis, link, quote
```

Example minimal theme snippet:

```css
pre, code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.token-comment { color: #667; font-style: italic; }
.token-keyword { color: #c92c2c; }
.token-string  { color: #2f9c0a; }
.token-number  { color: #1c6dd0; }
.token-tag     { color: #0a68a0; }
.token-attr, .token-attribute { color: #b35d00; }
.token-operator, .token-punctuation { color: #222; }
```

You can also reuse / adapt the theme styles from the main `mokai` package if you want consistent visuals.

## Language coverage

Currently implemented:

| Language    | Notes |
|-------------|-------|
| html        | Basic tags + attributes + comments (no embedded scripts/styles) |
| javascript (js, jsx) | Strings, template literals, numbers, keywords, JSX tags/attributes, simple function detection |
| css         | Declarations, at-rules, numbers, units, colors, basic selectors, comments |
| markdown (md) | Headings, fenced/inline code, emphasis, strong, lists, links/images, quotes |

Adding more languages or extending rules means editing the `languages` object inside `index.js`. The design is intentionally straightforward: a language is an ordered array of rule objects tried left‑to‑right.

## Design constraints & limitations

* Not a full parser – regex rules may mis-highlight edge cases (e.g. nested template strings, complex JSX expressions, tricky Markdown inline constructs).
* No automatic language detection.
* All processing is linear over the input length; catastrophic backtracking is avoided by using anchored (`^`) patterns only.
* Output is HTML only (no ANSI / plain token stream abstraction). If you need structured tokens for other renderers you might wrap / fork the `highlight` function.
* Does not ship styles – you must provide your own CSS.

## Security note

All raw input characters are escaped unless they are inside a matched token; token content is also escaped before insertion. The function does not execute code. Still, only inject the returned HTML into trusted locations to avoid accidental XSS via surrounding context.

## Performance tips

* Call `highlight` only when code or language changes; memoize in reactive frameworks.
* Prefer doing the transformation off the main thread if highlighting very large blobs (Web Worker). The function is pure and serializable.

## License

Licensed under the MIT License.

> If you find a tokenization bug or want to propose a tiny improvement (while keeping the minimalist spirit) feel free to open an issue or PR.
