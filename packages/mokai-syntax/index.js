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
    css: {
        aliases: [],
        rules: [
            {
                starts: /^\/\*/,
                ends: /\*\//,
                rules: [
                    {regex: /^(.+)/, token: "comment"},
                ],
            },
            {regex: /^([{},;])/, token: "punctuation"},
            {regex: /^(@(font-face|import|keyframes))/, token: "keyword"},
            {
                regex: /^([a-z\-]+\s*:\s*[^;\n]+);/,
                rules: [
                    {
                        regex: /^([a-z\-]+\s*:)/,
                        rules: [
                            {regex: /^([a-z\-]+)/, token: "attribute"},
                            {regex: /^(:)/, token: "punctuation"},
                        ],
                    },
                    {regex: /^(#[\da-f]{3,8})/, token: "constant"},
                    {regex: /^([+-]?([0-9]*[.])?[0-9]+)/, token: "number"},
                    {regex: /^(\'(?:.)*?\')|^(\"(?:.)*?\")/, token: "string"},
                    {regex: new RegExp(`^\\b(${cssConstants.join("|")})\\b`), token: "constant"},
                    {regex: /^\b(cm|mm|in|px|pt|pc|em|rem|vw|vh)\b/, token: "unit"},
                ],
            },
            {regex: /^(::?[a-z]+)/, token: "selector-pseudo"},
            {regex: /^(\[[^\]]+\])/, token: "selector-attr"},
            {regex: /^(\.[\w\-\_]+)/, token: "selector-class"},
            {regex: /^(\#[\w\-\_]+)/, token: "selector-id"},
            {regex: /^(body|html|a|div|table|td|tr|th|input|button|textarea|label|form|svg|g|path|rect|circle|ul|li|ol)\b/, token: "selector-tag"},
            {regex: /^(\'(?:.)*?\')|^(\"(?:.)*?\")/, token: "string"},
        ],
    },
    markdown: {
        aliases: ["md"],
        rules: [
            {regex: /^(#{1,6}[^\n]+)/, token: "section"},
            {regex: /^(\`{3}[^\`{3}]+\`{3})/, token: "code"},
            {regex: /^(\`[^\`\n]+\`)/, token: "code"},
            {regex: /^ *([\*\-+:]|\d+\.) /, token: "bullet"},
            {regex: /^(\*{2}[^\*\n]+\*{2})/, token: "strong"},
            {regex: /^(\*[^\*\n]+\*)/, token: "emphasis"},
            {
                regex: /^(!?\[[^\]\n]*]\([^\)\n]+\))/,
                rules: [
                    {
                        regex: /^(\[.+\])/,
                        rules: [
                            {regex: /^([^\[\]]+)/, token: "string"},
                        ],
                    },
                    {
                        regex: /^(\(.+\))/,
                        rules: [
                            {regex: /^([^\(\)]+)/, token: "link"},
                        ],
                    }
                ],
            },
            {regex: /^(\> [^\n]+)/, token: "quote"},
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
