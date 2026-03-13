// OmniMark completion data
// Each entry: { label, kind, detail, documentation, insertText, insertTextFormat }
// insertTextFormat: 1 = plain text, 2 = snippet (uses $1, $2, ${1:placeholder})

const vscode = require("vscode");
const K = vscode.CompletionItemKind;

// ── Helper ────────────────────────────────────────────────────────────────────

function item(label, kind, detail, documentation, insertText, isSnippet = false) {
  const c = new vscode.CompletionItem(label, kind);
  c.detail = detail;
  c.documentation = new vscode.MarkdownString(documentation);
  c.insertText = isSnippet
    ? new vscode.SnippetString(insertText)
    : (insertText || label);
  return c;
}

// ── Keywords ──────────────────────────────────────────────────────────────────

const KEYWORD_COMPLETIONS = [
  // Rule keywords
  item("process",               K.Keyword, "Rule keyword", "Main entry point rule — fires once at program start.", "process\n\t$0"),
  item("process-start",         K.Keyword, "Rule keyword", "Initialization rule — fires before `process`.", "process-start\n\t$0"),
  item("process-end",           K.Keyword, "Rule keyword", "Termination rule — fires after `process` completes.", "process-end\n\t$0"),
  item("find",                  K.Keyword, "Rule keyword", "Pattern matching rule. Fires when the pattern matches in the current input.", "find ${1:pattern}\n\t$0"),
  item("element",               K.Keyword, "Rule keyword", "Markup rule — fires when the named XML/SGML element is encountered. **Must** contain `%c` or `suppress`.", "element ${1:name}\n\toutput \"${2:<%1>%c</%1>}\""),
  item("translate",             K.Keyword, "Rule keyword", "Markup rule — matches text patterns inside elements.", "translate ${1:pattern}\n\t$0"),
  item("data-content",          K.Keyword, "Rule keyword", "Handles parsed character data content of an element.", "data-content\n\t$0"),
  item("document-start",        K.Keyword, "Rule keyword", "Fires before the document body is parsed.", "document-start\n\t$0"),
  item("document-end",          K.Keyword, "Rule keyword", "Fires after the entire document has been parsed.", "document-end\n\t$0"),
  item("markup-comment",        K.Keyword, "Rule keyword", "Fires when an XML/SGML comment is encountered.", "markup-comment\n\tsuppress"),
  item("markup-error",          K.Keyword, "Rule keyword", "Fires when invalid markup is encountered.", "markup-error\n\t$0"),
  item("processing-instruction",K.Keyword, "Rule keyword", "Fires when a processing instruction `<?...?>` is encountered.", "processing-instruction\n\tsuppress"),

  // Control flow
  item("do",        K.Keyword, "Control flow", "Opens a `do...done` block.", "do\n\t$0\ndone"),
  item("done",      K.Keyword, "Control flow", "Closes a `do...done` block.", "done"),
  item("repeat",    K.Keyword, "Control flow", "Begins a `repeat...again` loop.", "repeat\n\t$0\nagain"),
  item("again",     K.Keyword, "Control flow", "Ends a `repeat...again` loop.", "again"),
  item("when",      K.Keyword, "Control flow", "Conditional guard — fires only if the condition is true.", "when ${1:condition}"),
  item("unless",    K.Keyword, "Control flow", "Negative conditional guard — fires only if the condition is false.", "unless ${1:condition}"),
  item("else",      K.Keyword, "Control flow", "Alternative branch in a conditional block.", "else"),
  item("exit",      K.Keyword, "Control flow", "Exits a `repeat...again` loop.", "exit when ${1:condition}"),
  item("return",    K.Keyword, "Control flow", "Returns a value from a function.", "return ${1:value}"),
  item("halt",      K.Keyword, "Control flow", "Terminates the program.", "halt"),
  item("throw",     K.Keyword, "Control flow", "Throws an exception to a `catch` handler.", "throw ${1:exception-name}"),
  item("catch",     K.Keyword, "Control flow", "Catches an exception thrown by `throw`.", "catch ${1:#program-error}"),
  item("always",    K.Keyword, "Control flow", "Executes regardless of whether an exception occurred (like `finally`).", "always"),
  item("over",      K.Keyword, "Control flow", "Iterates over all items in a shelf.", "over ${1:shelf}"),
  item("scan",      K.Keyword, "Control flow", "Pattern-matches against a value.", "scan ${1:variable}"),
  item("match",     K.Keyword, "Control flow", "Pattern branch inside a `do scan` block.", "match ${1:pattern}\n\t$0"),
  item("case",      K.Keyword, "Control flow", "Value branch inside a `do select` block.", "case ${1:value}\n\t$0"),
  item("select",    K.Keyword, "Control flow", "Value-based conditional (like switch/case).", "select ${1:expression}"),
  item("submit",    K.Keyword, "Control flow", "Sends input to the pattern processor (find rules).", "submit ${1:input}"),
  item("suppress",  K.Keyword, "Control flow", "Continues parsing but discards all output.", "suppress"),
  item("using",     K.Keyword, "Control flow", "Temporarily changes context (output, group, etc.).", "using ${1:output} as ${2:stream}\ndo\n\t$0\ndone"),

  // Actions
  item("output",      K.Keyword, "Action", "Sends text to the current output stream.", "output ${1:\"text\"}"),
  item("output-to",   K.Keyword, "Action", "Redirects current output to a stream.", "output-to ${1:stream}"),
  item("put",         K.Keyword, "Action", "Writes to a named stream.", "put ${1:stream} ${2:\"text\"}"),
  item("set",         K.Keyword, "Action", "Assigns a value to a variable.", "set ${1:variable} to ${2:value}"),
  item("open",        K.Keyword, "Action", "Opens a stream for writing.", "open ${1:stream} as ${2:buffer}"),
  item("close",       K.Keyword, "Action", "Closes a stream — required before reading.", "close ${1:stream}"),
  item("reopen",      K.Keyword, "Action", "Reopens a closed stream preserving its content.", "reopen ${1:stream}"),
  item("increment",   K.Keyword, "Action", "Increases a counter by 1.", "increment ${1:counter}"),
  item("decrement",   K.Keyword, "Action", "Decreases a counter by 1.", "decrement ${1:counter}"),
  item("remove",      K.Keyword, "Action", "Removes an item from a shelf.", "remove ${1:shelf}"),
  item("clear",       K.Keyword, "Action", "Clears a variable or shelf.", "clear ${1:variable}"),
  item("log",         K.Keyword, "Action", "Writes to the log output.", "log ${1:\"message\"}"),

  // Declarations
  item("global",   K.Keyword, "Declaration", "Declares a global variable.", "global ${1:stream} ${2:name}"),
  item("local",    K.Keyword, "Declaration", "Declares a local variable.", "local ${1:stream} ${2:name}"),
  item("define",   K.Keyword, "Declaration", "Defines a function.", "define ${1:stream} function ${2:name}\n\t(value ${3:stream} ${4:arg})\nas\n\t$0\n\treturn ${5:result}"),
  item("declare",  K.Keyword, "Declaration", "Declares program-level constructs.", "declare ${1:catch} ${2:name}"),
  item("include",  K.Keyword, "Declaration", "Includes code from another file.", "include \"${1:file.xin}\""),
  item("macro",    K.Keyword, "Declaration", "Defines a macro.", "macro ${1:name} is\n\t${2:value}\nmacro-end"),
  item("group",    K.Keyword, "Declaration", "Defines a named rule group.", "group ${1:name}"),

  // Types
  item("stream",    K.TypeParameter, "Type", "String/text variable type.", "stream"),
  item("counter",   K.TypeParameter, "Type", "Integer variable type.", "counter"),
  item("switch",    K.TypeParameter, "Type", "Boolean variable type.", "switch"),
  item("bcd",       K.TypeParameter, "Type", "Decimal number type for financial calculations.", "bcd"),
  item("referent",  K.TypeParameter, "Type", "Placeholder variable — can be output before value is assigned.", "referent"),
  item("variable",  K.TypeParameter, "Type modifier", "Allows dynamic shelf resizing.", "variable"),
  item("function",  K.TypeParameter, "Type modifier", "Used in `define` declarations.", "function"),
  item("value",     K.TypeParameter, "Type modifier", "Pass-by-value parameter modifier.", "value"),
  item("modifiable",K.TypeParameter, "Type modifier", "Pass-by-reference parameter modifier.", "modifiable"),

  // Character classes
  item("any",        K.EnumMember, "Character class", "Matches any single character including newline.", "any"),
  item("any-text",   K.EnumMember, "Character class", "Matches any single character except newline.", "any-text"),
  item("letter",     K.EnumMember, "Character class", "Matches any single letter (upper or lower case).", "letter"),
  item("uc",         K.EnumMember, "Character class", "Matches a single uppercase letter.", "uc"),
  item("lc",         K.EnumMember, "Character class", "Matches a single lowercase letter.", "lc"),
  item("digit",      K.EnumMember, "Character class", "Matches a single decimal digit (0–9).", "digit"),
  item("space",      K.EnumMember, "Character class", "Matches a single space character.", "space"),
  item("blank",      K.EnumMember, "Character class", "Matches a single space or tab.", "blank"),
  item("white-space",K.EnumMember, "Character class", "Matches space, tab, or newline.", "white-space"),
  item("line-start", K.EnumMember, "Character class", "Zero-width assertion — matches the start of a line.", "line-start"),
  item("line-end",   K.EnumMember, "Character class", "Zero-width assertion — matches the end of a line.", "line-end"),
  item("word-start", K.EnumMember, "Character class", "Zero-width assertion — matches the start of a word.", "word-start"),
  item("word-end",   K.EnumMember, "Character class", "Zero-width assertion — matches the end of a word.", "word-end"),

  // Operators
  item("format",    K.Operator, "Operator", "Converts a value to a formatted string. e.g. `\"d\" format mycount`", "format"),
  item("modulo",    K.Operator, "Operator", "Returns the remainder of integer division.", "modulo"),
  item("matches",   K.Operator, "Operator", "Tests whether a value matches a pattern.", "matches"),
  item("except",    K.Operator, "Operator", "Excludes characters from a character class.", "except"),
  item("lookahead", K.Operator, "Operator", "Zero-width pattern assertion.", "lookahead"),
  item("number-of", K.Operator, "Operator", "Returns the number of items in a shelf.", "number-of ${1:shelf}"),
  item("key",       K.Operator, "Operator", "The key associated with a shelf item.", "key"),
  item("is",        K.Operator, "Operator", "Tests a property. e.g. `attr \"id\" is specified`", "is"),
  item("isnt",      K.Operator, "Operator", "Negative property test.", "isnt"),
  item("has",       K.Operator, "Operator", "Tests shelf membership.", "has"),
  item("not",       K.Operator, "Operator", "Logical negation.", "not"),
  item("and",       K.Operator, "Operator", "Logical AND.", "and"),
  item("or",        K.Operator, "Operator", "Logical OR.", "or"),
];

// ── Built-in streams ──────────────────────────────────────────────────────────

const STREAM_COMPLETIONS = [
  item("#process-input",    K.Variable, "Built-in stream", "Standard input (stdin).", "#process-input"),
  item("#process-output",   K.Variable, "Built-in stream", "Standard output (stdout).", "#process-output"),
  item("#main-input",       K.Variable, "Built-in stream", "Input file specified on the command line.", "#main-input"),
  item("#main-output",      K.Variable, "Built-in stream", "Output file specified on the command line.", "#main-output"),
  item("#error",            K.Variable, "Built-in stream", "Standard error (stderr).", "#error"),
  item("#current-input",    K.Variable, "Built-in stream", "The current input stream.", "#current-input"),
  item("#current-output",   K.Variable, "Built-in stream", "All currently active output destinations.", "#current-output"),
  item("#markup-parser",    K.Variable, "Built-in stream", "The markup parser input stream.", "#markup-parser"),
  item("#program-error",    K.Variable, "Built-in exception", "Runtime error exception.", "#program-error"),
  item("#external-exception", K.Variable, "Built-in exception", "File/network error exception.", "#external-exception"),
  item("#implied",          K.Variable, "Built-in group", "The default rule group — always active.", "#implied"),
  item("#group",            K.Variable, "Built-in group", "All currently active rule groups.", "#group"),
  item("#command-line-names", K.Variable, "Built-in shelf", "Command-line argument values.", "#command-line-names"),
  item("#first",            K.Variable, "Built-in value", "The first item index of a shelf.", "#first"),
  item("#last",             K.Variable, "Built-in value", "The last item index of a shelf.", "#last"),
  item("#line-number",      K.Variable, "Built-in value", "Current line number in the input.", "#line-number"),
  item("#file-name",        K.Variable, "Built-in value", "Current file name being processed.", "#file-name"),
  item("#error-code",       K.Variable, "Built-in value", "Error code in a catch block.", "#error-code"),
  item("#message",          K.Variable, "Built-in value", "Error message in a catch block.", "#message"),
];

// ── Snippets ──────────────────────────────────────────────────────────────────

const SNIPPET_COMPLETIONS = [

  item("do when…done", K.Snippet, "Snippet", "Conditional block.",
    "do when ${1:condition}\n\t$0\ndone", true),

  item("do when…else…done", K.Snippet, "Snippet", "Conditional block with else branch.",
    "do when ${1:condition}\n\t$2\nelse\n\t$3\ndone", true),

  item("repeat…again", K.Snippet, "Snippet", "Basic loop.",
    "repeat\n\t$0\n\texit when ${1:condition}\nagain", true),

  item("repeat over…again", K.Snippet, "Snippet", "Iterate over a shelf.",
    "repeat over ${1:shelf}\n\toutput ${1} || \"%n\"\nagain", true),

  item("do scan…match", K.Snippet, "Snippet", "Pattern-match a value.",
    "do scan ${1:variable}\n\tmatch ${2:\"pattern\"}\n\t\t$3\n\telse\n\t\t$4\ndone", true),

  item("do select…case", K.Snippet, "Snippet", "Value-based conditional.",
    "do select ${1:expression}\n\tcase ${2:1} to ${3:5}\n\t\t$4\n\telse\n\t\t$5\ndone", true),

  item("using output as…done", K.Snippet, "Snippet", "Redirect output to a stream.",
    "using output as ${1:stream}\ndo\n\t$0\ndone", true),

  item("using group…done", K.Snippet, "Snippet", "Activate a rule group.",
    "using group ${1:name}\ndo\n\t$0\ndone", true),

  item("open…close", K.Snippet, "Snippet", "Open a buffer, write, close, output.",
    "open ${1:buf} as buffer\nput ${1} ${2:\"content\"}\nclose ${1}\noutput ${1}", true),

  item("do xml-parse", K.Snippet, "Snippet", "Parse an XML document.",
    "do xml-parse document\n\tscan file ${1:#main-input}\n\toutput \"%c\"\ndone", true),

  item("do sgml-parse", K.Snippet, "Snippet", "Parse an SGML document.",
    "do sgml-parse document\n\tscan file ${1:\"sgmldecl.sgm\"} || file ${2:\"my.dtd\"} || file ${3:#main-input}\n\toutput \"%c\"\ndone", true),

  item("catch #program-error", K.Snippet, "Snippet", "Handle runtime errors.",
    "catch #program-error code ${1:c} message ${2:m} location ${3:l}\n\toutput to #error \"Error \" || \"d\" format ${1} || \": \" || ${2} || \"%n\"", true),

  item("catch #external-exception", K.Snippet, "Snippet", "Handle file/network errors.",
    "catch #external-exception identity ${1:i} message ${2:m} location ${3:l}\n\toutput to #error \"External error: \" || ${2} || \"%n\"", true),

  item("define function", K.Snippet, "Snippet", "Define a function with return value.",
    "define ${1:stream} function ${2:name}\n\t(value ${3:stream} ${4:arg})\nas\n\t$0\n\treturn ${5:result}", true),

  item("define void function", K.Snippet, "Snippet", "Define a function with output only.",
    "define function ${1:name}\n\t(value ${2:stream} ${3:arg})\nas\n\t$0", true),

  item("global stream", K.Snippet, "Snippet", "Declare a global stream variable.",
    "global stream ${1:name} initial {\"${2:value}\"}", true),

  item("global counter", K.Snippet, "Snippet", "Declare a global counter variable.",
    "global counter ${1:name} initial {${2:0}}", true),

  item("global stream variable", K.Snippet, "Snippet", "Declare a global variable-size shelf.",
    "global stream ${1:name} variable", true),

  item("element rule", K.Snippet, "Snippet", "XML/SGML element transformation rule.",
    "element ${1:name}\n\toutput \"<${1}>%c</${1}>\"", true),

  item("element with attributes", K.Snippet, "Snippet", "Element rule passing through all attributes.",
    "element ${1:name}\n\toutput \"<${1}\"\n\trepeat over attributes\n\t\toutput \" \" || name of attributes || \"='\" || attributes || \"'\"\n\tagain\n\toutput \">%c</${1}>\"", true),

  item("full XML skeleton", K.Snippet, "Snippet", "Complete XML transformation program.",
    "process\n\tdo xml-parse document\n\t\tscan file #main-input\n\t\toutput \"%c\"\n\tdone\n\nelement ${1:root}\n\toutput \"<${1}>%c</${1}>\"\n\nelement *\n\toutput \"%c\"\n\nmarkup-comment\n\tsuppress\n\nprocessing-instruction\n\tsuppress", true),
];

module.exports = { KEYWORD_COMPLETIONS, STREAM_COMPLETIONS, SNIPPET_COMPLETIONS };
