# mokai-themes

![npm version](https://badgen.net/npm/v/mokai-themes?labelColor=1d2734&color=21bf81)
![license](https://badgen.net/github/license/jmjuanes/mokai?labelColor=1d2734&color=21bf81)

Theme collection for the tiny [Mokai](https://github.com/jmjuanes/mokai) web code editor (and its companion highlighter `mokai-syntax`). It ships a single stylesheet (`styles.css`) with a small set of class‑based themes you can opt into. No JavaScript, no build step – just drop the CSS and add a class.

## Install

### Install using a package manager

Install using **npm** or **yarn**:

```
# install using npm
$ npm install mokai mokai-themes

# install using yarn
$ yarn add mokai mokai-themes
```

### Install using a CDN

You can also use it directly in the browser via a CDN like **unpkg**:

```html
<link rel="stylesheet" href="https://unpkg.com/mokai-themes/styles.css">
```

## Available themes

| Class name        | Style intent / notes |
|-------------------|----------------------|
| `mokai-light`     | Neutral light, subtle colors |
| `mokai-dark`      | Default dark variant |
| `mokai-monoblue`  | Light, blue‑tinted, bold keywords |
| `mokai-one-light` | Inspired by VS Code One Light |
| `mokai-one-dark`  | Inspired by VS Code One Dark |

All themes define colors for editor UI (background, foreground, line numbers, scrollbars) plus token classes produced by `mokai-syntax` (e.g. `token-keyword`, `token-string`, `token-comment`, etc.).

## Basic usage with Mokai editor

```html
<link rel="stylesheet" href="https://unpkg.com/mokai/styles.css">
<link rel="stylesheet" href="https://unpkg.com/mokai-themes/styles.css">
<div id="editor"></div>
<script type="module">
	import mokai from "https://unpkg.com/mokai/index.js";
	import highlight from "https://unpkg.com/mokai-syntax/index.js"; // optional

	const editor = mokai(document.getElementById("editor"), {
		className: "mokai-dark",   // pick any theme class
		language: "javascript",
		highlight: highlight,
	});
	editor.setCode("console.log('Hello Mokai');\n");
</script>
```

If you installed via npm, import the CSS through your bundler / framework:

```js
import "mokai/styles.css";       // core editor structural styles (if packaged there)
import "mokai-themes/styles.css"; // theme definitions
```

## Token classes

The themes color these token classes (non‑exhaustive list):

```
token-attr, token-attribute, token-bullet, token-code, token-comment, token-constant,
token-emphasis, token-keyword, token-link, token-number, token-operator, token-punctuation,
token-quote, token-section, token-selector-attr, token-selector-class, token-selector-id,
token-selector-pseudo, token-selector-tag, token-string, token-title.function, token-unit,
token-strong
```

You can override any of them later in your own CSS after importing the theme file.

## Customizing / extending a theme

Easiest approach: append overrides after the import.

```css
/* After importing mokai-themes/styles.css */
.mokai-dark .token-string { color: #8bd49c; }
.mokai-dark .token-keyword { font-weight: 600; }
```

Creating a new theme (example: high‑contrast):

```css
.mokai-high-contrast {
	background:#000; color:#fff;
}
.mokai-high-contrast .mokai-lines { color:#666; }
.mokai-high-contrast .token-keyword { color:#ff8a00; }
.mokai-high-contrast .token-string { color:#00ff99; }
.mokai-high-contrast .token-comment { color:#7f7f7f; font-style:italic; }
/* add other tokens as needed */
```

Then just pass `className: "mokai-high-contrast"` when creating the editor.

## File size & performance

Only a single CSS file; the cost is minimal. Remove unused theme blocks with a CSS tree‑shaker (e.g. PurgeCSS) if you only ship one theme to production.

## FAQ

**Do I have to use these themes?**  
No. They’re optional helpers. You can write your own from scratch; just replicate the structure of `.mokai-<name>` and style the token classes.

**Why not ship each theme as a separate file?**  
Simplicity and small raw size. If you prefer separate files you can manually split them or copy only the blocks you use.

**Will you add more themes?**  
Possibly, but the goal is to stay minimal. PRs for small, broadly useful themes are welcome.

## License

Under the MIT License.

> Found a color mismatch or want to propose an improvement? Open an issue / PR.
