const createEventEmitter = () => {
    const listeners = {};
    return {
        on: (eventName, listener) => {
            listeners[eventName] = listener;
        },
        off: eventName => {
            delete listeners[eventName];
        },
        emit: (eventName, payload) => {
            (typeof listeners[eventName] === "function") && listeners[eventName](payload);
        },
    };
};

const insertText = text => {
    const sel = window.getSelection();
    const range = sel.getRangeAt(0);
    const textElement = document.createTextNode(text);
    range.insertNode(textElement);
    range.setStartAfter(textElement);
    sel.removeAllRanges();
    sel.addRange(range);
};

const getCodeBeforeOrAfter = (parent, dir) => {
    const {startContainer, startOffset, endContainer, endOffset} = window.getSelection().getRangeAt(0);
    const range = document.createRange();
    range.selectNodeContents(parent);
    dir === -1 ? range.setEnd(startContainer, startOffset) : range.setStart(endContainer, endOffset);
    return range.toString();
};

const debounce = fn => {
    let timer = null;
    return wait => {
        clearTimeout(timer);
        wait === 1 ? fn() : (timer = window.setTimeout(fn, wait)); 
    };
};

const getTextNodeAtPosition = (root, index) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, el => {
        if (index > el.textContent.length){
            index = index - el.textContent.length;
            return NodeFilter.FILTER_REJECT
        }
        return NodeFilter.FILTER_ACCEPT;
    });
    return {
        node: walker.nextNode() || root,
        position: index,
    };
};

const getEditorTemplate = () => {
    const templateContent = [
        `<div class="mokai">`,
        `    <div class="mokai-gutters" style="display:none;">`,
        `        <div class="mokai-gutter mokai-lines" style="display:none;"></div>`,
        `    </div>`,
        `    <div class="mokai-editor" spellcheck="false" autocorrect="off"></div>`, 
        `</div>`,
    ];
    const templateElement = document.createElement("template");
    templateElement.innerHTML = templateContent.join("").trim();
    return templateElement.content.firstChild;
};

export default (parent, options = {}) => {
    let prevCode = "", linesCount = -1, focus = false, escKeyPressed = false;
    const emitter = createEventEmitter();
    const tab = options?.indentWithTabs ? "\t" : " ".repeat(options.tabSize || 4);
    const endl = String.fromCharCode(10);
    const autoIndent = options?.autoIndent ?? true;
    const addClosing = options?.addClosing ?? true;
    const openChars = `[({"'`, closeChars = `])}"'`;
    parent.appendChild(getEditorTemplate());
    const editor = parent.querySelector(".mokai-editor");
    const lines = parent.querySelector(".mokai-lines");
    !options?.readOnly && editor.setAttribute("contenteditable", "plaintext-only");
    (options?.className || "").split(" ").filter(c => !!c).forEach(c => parent.querySelector(".mokai").classList.add(c));
    options?.lineNumbers && (parent.querySelector(".mokai-gutters").style.display = "");
    options?.lineNumbers && (lines.style.display = "");
    // 'plaintext-only' mode is not supported in Firefox
    if (!options?.readOnly && editor.contentEditable !== "plaintext-only") {
        editor.setAttribute("contenteditable", "true");
        editor.addEventListener("paste", event => {
            const insertText = event.clipboardData.getData("text/plain");
            event.preventDefault()
            // insert text at cursor position
            const sel = window.getSelection();
            const range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(insertText));
            update(10);
        });
    }
    // Manage code
    const setCode = (newCode, wait) => {
        editor.textContent = newCode;
        prevCode = editor.textContent || "";
        update(wait ?? 50);
    };
    const getCode = () => editor.textContent || "";
    const getCodeBefore = () => getCodeBeforeOrAfter(editor, -1);
    const getCodeAfter = () => getCodeBeforeOrAfter(editor, +1);
    // Position managers
    const savePosition = () => {
        const range = window.getSelection().getRangeAt(0);
        range.setStart(editor, 0);
        return range.toString().length;
    };
    const restorePosition = index => {
        const selection = window.getSelection();
        const pos = getTextNodeAtPosition(editor, index);
        selection.removeAllRanges();
        const range = new Range();
        range.setStart(pos.node, pos.position);
        selection.addRange(range);
    };
    // Debounce code update
    const update = debounce(() => {
        const position = focus && savePosition();
        let currentCode = getCode();
        if (!currentCode.endsWith(endl)) {
            currentCode = currentCode + endl;
            editor.textContent = currentCode;
        }
        if (options.lineNumbers) {
            const count = Math.max(currentCode.split(endl).length - 1, 1);
            if (linesCount !== count) {
                lines.innerText = Array.from({length: count}, (v, i) => i + 1).join("\n");
                linesCount = count;
            }
        }
        (typeof options.highlight === "function") && (editor.innerHTML = options.highlight(currentCode, options.language || ""));
        emitter.emit("change", { value: currentCode });
        focus && restorePosition(position);
    });
    // Register editor events listeners
    editor.addEventListener("keydown", event => {
        emitter.emit("keydown", event);
        if (!event.defaultPrevented && !options?.readOnly) {
            prevCode = getCode();
            // Handle inserting new line
            if (event.key === "Enter" && autoIndent) {
                event.preventDefault();
                const lines = getCodeBefore().split(endl);
                const extraLine = /^[)}\]]/.test(getCodeAfter());
                const pos = savePosition();
                const lastLine = lines[lines.length - 1];
                const lastIndentation = (/^([\s]*)/.exec(lastLine))?.[0] || "";
                const lastChar = lastLine.trim().slice(-1);
                const indentation = lastIndentation + (/[\[\{]/.test(lastChar) ? tab : "");
                setCode(prevCode.substring(0, pos) + endl + indentation + (extraLine ? (endl + lastIndentation) : "") + prevCode.substring(pos, prevCode.length), 1);
                restorePosition(pos + 1 + indentation.length);
            }
            // Handle backspace
            else if (event.key === "Backspace" || (event.key === "Tab" && !escKeyPressed && event.shiftKey)) {
                if (window.getSelection().type === "Caret") {
                    let removeChars = 0;
                    const pos = savePosition();
                    const lines = prevCode.slice(0, pos).split(endl);
                    const line = lines[lines.length - 1] || ""; 
                    if (line !== "" && line.trim() === "") {
                        event.preventDefault();
                        removeChars = (line.length % tab.length === 0) ? tab.length : line.length % tab.length;
                        setCode(prevCode.substring(0, pos - removeChars) + prevCode.substring(pos, prevCode.length), 1);
                    }
                    restorePosition(pos - removeChars);
                }
            }
            // Handle insert tab
            else if (event.key === "Tab" && !escKeyPressed && !event.shiftKey) {
                event.preventDefault();
                insertText(tab);
            }
            // Skip closing char
            else if (addClosing && closeChars.includes(event.key) && getCodeAfter().charAt(0) === event.key) {
                event.preventDefault();
                restorePosition(savePosition() + 1);
            }
            // Handle closing chars
            else if (addClosing && openChars.includes(event.key)) {
                event.preventDefault();
                const [start, end] = [getCodeBefore().length, getCodeAfter().length];
                const pos = savePosition();
                const wrapText = (prevCode.length - start - end > 0) ? prevCode.substring(start, prevCode.length - end) : "";
                setCode(prevCode.substring(0, pos - wrapText.length) + event.key + wrapText + closeChars[openChars.indexOf(event.key)] + prevCode.substring(pos, prevCode.length), 1);
                restorePosition(pos + 1);
            }
            // Save if escape key has been pressed to avoid trapping keyboard focus
            escKeyPressed = event.key === "Escape";
        }
    });
    editor.addEventListener("keyup", event => {
        emitter.emit("keyup", event);
        if (!event.defaultPrevented && !options?.readOnly && prevCode !== getCode()) {
            return update(250);
        }
    });
    editor.addEventListener("focus", () => focus = true);
    editor.addEventListener("blur", () => focus = false);
    editor.addEventListener("scroll", () => lines.style.top = `-${editor.scrollTop}px`);
    editor.addEventListener("paste", () => update(10));
    // Initialize editor values
    options?.value ? setCode(options?.value) : update(1);
    return {
        get: () => getCode(),
        set: code => setCode(code || "", 1),
        on: (eventName, listener) => emitter.on(eventName, listener),
        off: eventName => emitter.off(eventName),
    };
};
