const escape = text => {
    return text.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

const jsKeywords = [
    "as", "async", "await", "break", "case", "catch", "class", "const", "continue", "constructor", "debugger", "default",
    "delete", "do", "else", "export", "extends", "finally", "for", "from", "function", "if", "implements", "import",
    "in", "instanceof", "let", "new", "of", "return", "static", "super", "switch", "symbol", "this", "throw",
    "try", "typeof", "undefined", "var", "void", "while", "with", "yield",
];

const cssConstants = [
    "absolute", "relative", "fixed", "sticky", "bold", "normal", "auto", "none", "solid", "dashed",
    "sans-serif", "sans", "serif", "monospace", "red", "white", "black", "blue", "yellow", "green", "orange", "gray",
];

// Languajes definition
const languages = {
    html: {
        aliases: [],
        rules: [
            {
                starts: /^<!--/,
                ends: /-->/,
                rules: [
                    {regex: /^(.+)/, token: "comment"},
                ],
            },
            {
                regex: /^(<([\w]+)(?![^>]*\/>)[^>]*>)/,
                rules: [
                    {
                        regex: /^(<[\w]+)/,
                        rules: [
                            {regex: /^(<)/, token: "punctuation"},
                            {regex: /^([\w]+)/, token: "tag"},
                        ],
                    },
                    {
                        regex: /^([\w\.\-\_]+="[^"]+")/,
                        rules: [
                            {regex: /^([\w\.\-\_]+)/, token: "attr"},
                            {regex: /^(=)/, token: "punctuation"},
                            {regex: /^(".*?")/, token: "string"},
                        ],
                    },
                    {regex: /^(>)/, token: "punctuation"},
                ],
            },
            {
                regex: /^(<\/[\w]+>)/,
                rules: [
                    {regex: /^([<\/>])/, token: "punctuation"},
                    {regex: /^([\w]+)/, token: "tag"},
                ],
            },
        ],
    },
    javascript: {
        aliases: ["js", "jsx"],
        rules: [
            {regex: /^(\/\/.*)/, token: "comment"},
            {
                starts: /^\/\*/,
                ends: /\*\//,
                rules: [
                    {regex: /^(.+)/, token: "comment"},
                ],
            },
            {regex: /^(\'.*?\')|^(\".*?\")/, token: "string"},
            {
                regex: /^(\`[^\`]*?\`)/,
                rules: [
                    {regex: /^(.+)/, token: "string"},
                ],
            },
            {regex: new RegExp(`^\\b(${jsKeywords.join("|")})\\b`), token: "keyword"},
            {regex: /^\b(true|false|null)\b/, token: "constant"},
            {regex: /^([+-]?([0-9]*[.])?[0-9]+)\b/, token: "number"},
            {regex: /^([{}[\](\):;\\.,])/, token: "punctuation"},
            {
                regex: /^(<(?:=>|[^>])+(?:\/)?>)/,
                rules: [
                    {
                        regex: /^(<\/?[\w]+)/,
                        rules: [
                            {regex: /^(<)/, token: "punctuation"},
                            {regex: /^([\w]+)/, token: "tag"},
                        ],
                    },
                    {
                        regex: /^([\w\.\-\_]+=(?:"[^"]*"|\{[^\}]*}))/,
                        rules: [
                            {regex: /^([\w\.\-\_]+)/, token: "attr"},
                            {regex: /^(=)/, token: "punctuation"},
                            {regex: /^("(?:.)*?"|\{(?:.)*?})/, token: "string"},
                        ],
                    },
                    {regex: /^(>)/, token: "punctuation"},
                ],
            },
            {regex: /^([?!&@~\/\-+*%=<>|])/, token: "operator"},
            {
                regex: /^([a-zA-Z][\w]*\s*\()/,
                rules: [
                    {regex: /^([^\(]+)/, token: "title function"},
                    {regex: /^(\()/, token: "punctuation"},
                ],
            },
            {regex: /^([\w]+)/, token: "word"},
        ],
    },
    json: {
        aliases: [],
        rules: [
            {regex: /^(\/\/.*)/, token: "comment"},
            {
                starts: /^\/\*/,
                ends: /\*\//,
                rules: [
                    {regex: /^(.+)/, token: "comment"},
                ],
            },
            {regex: /^(\s*[\{\}\[\],])/, token: "punctuation"},
            {regex: /^(\s*\"(\\.|[^\"])*\"\s*:)/, token: "attr"},
            {regex: /^(\s*\"(\\.|[^\"])*\")/, token: "string"},
            {regex: /^(\s*\b(true|false|null)\b)/, token: "constant"},
            {regex: /^(\s*[+-]?([0-9]*[.])?[0-9]+\b)/, token: "number"},
        ],
    },
    yaml: {
        aliases: ["yml"],
        rules: [
            {regex: /^(#.*)/, token: "comment"},
            {
                regex: /^([a-zA-Z][\w\-]*:\s*)([^\n#]+)/,
                rules: [
                    {regex: /^([a-zA-Z][\w\-]*:\s*)/, token: "attr"},
                    {regex: /^(\b(true|false|null)\b)/, token: "constant"},
                    {regex: /^([+-]?([0-9]*[.])?[0-9]+\b)/, token: "number"},
                    {regex: /^('(?:.)*?')|^("(?:.)*?")/, token: "string"},
                    {regex: /^([^\n#]+)/, token: "string"},
                ],
            },
            {
                regex: /^(-\s*)([^\n#]+)/,
                rules: [
                    {regex: /^(-\s*)/, token: "punctuation"},
                    {regex: /^(\b(true|false|null)\b)/, token: "constant"},
                    {regex: /^([+-]?([0-9]*[.])?[0-9]+\b)/, token: "number"},
                    {regex: /^('(?:.)*?')|^("(?:.)*?")/, token: "string"},
                    {regex: /^([^\n#]+)/, token: "string"},
                ],
            },
            {regex: /^([\-:,\[\]\{\}])/ , token: "punctuation"},
        ],
    },
    css: {
        aliases: [],
        rules: [
            // ... (sin cambios)
        ],
    },
    markdown: {
        aliases: ["md"],
        rules: [
            // ... (sin cambios)
        ],
    },
};

const getRule = (rules, str) => {
    return rules.find(rule => {
        if (rule.starts) {
            return rule.starts.test(str) && rule.ends.test(str);
        }
        return rule.regex.test(str);
    });
};

const getMatch = (rule, str) => {
    if (rule.starts) {
        const match = rule.ends.exec(str);
        return str.substring(0, match.index + match[0].length);
    }
    return rule.regex.exec(str)[0];
};

const highlight = (code, rules) => {
    let text = "", i = 0;
    while (i < code.length) {
        const subCode = code.substring(i);
        const rule = getRule(rules, subCode);
        if (rule) {
            const match = getMatch(rule, subCode);
            if (match.length > 0) {
                text = text + (rule.rules ? highlight(match, rule.rules) : `<span class="token-${rule.token}">${escape(match)}</span>`);
                i = i + match.length;
                continue;
            }
        }
        text = text + escape(code[i]);
        i = i + 1;
    }
    return text;
};

export default (code, language = "javascript") => {
    return highlight(code, languages[language]?.rules || []);
};
