// OmniMark hover documentation — offline, based on OmniMark 11.0 docs
// Each entry: { detail, description, syntax?, example? }
// "detail" = short one-liner shown in bold at top of hover
// "description" = longer explanation
// "syntax" = optional syntax template
// "example" = optional code example
// "url" = link to official docs page

const BASE_URL = "https://developers.stilo.com/docs11.0.3/html/keyword/";

const DOCS = {

  // ── RULE KEYWORDS ────────────────────────────────────────────────────────

  "process": {
    detail: "Main processing rule",
    description: "Fires once when program execution begins. This is the entry point of an OmniMark program — equivalent to `main()` in C. Use it to set up processing, open files, and submit input.",
    syntax: "process\n  [actions]",
    example: "process\n  submit file #main-input",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/244.html"
  },
  "process-start": {
    detail: "Initialization rule — fires before process",
    description: "Fires before the `process` rule. Use it for early initialization such as opening database connections, reading configuration, or allocating resources.",
    syntax: "process-start\n  [actions]",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/246.html"
  },
  "process-end": {
    detail: "Termination rule — fires after process",
    description: "Fires after the `process` rule completes. Use it for cleanup: closing connections, writing summaries, freeing resources.",
    syntax: "process-end\n  [actions]",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/245.html"
  },
  "find": {
    detail: "Pattern matching rule",
    description: "Defines a pattern to match in the current input stream. When the pattern matches, the rule fires and its actions execute. Rules are tried in order — the first matching rule wins. Input not matched by any find rule passes through to output.",
    syntax: "find [pattern]\n  [actions]",
    example: 'find letter+\n  increment wordcount\n\nfind "hello" => greeting\n  output "Found: " || greeting',
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/118.html"
  },
  "element": {
    detail: "Markup rule — fires when an XML/SGML element is encountered",
    description: "Fires when the named element is found during XML or SGML parsing. Every element in the document must be handled — either with a specific rule or a wildcard `element *`. The rule **must** contain `%c` (continue parsing) or `suppress` — without one of these, parsing will stall permanently.",
    syntax: "element [name]\n  output \"...%c...\"",
    example: 'element para\n  output "<p>%c</p>"\n\nelement *\n  output "%c"',
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/112.html"
  },
  "translate": {
    detail: "Markup rule — matches text patterns inside elements",
    description: "Fires when data content matching a specified pattern occurs within an element during markup processing. Combines pattern matching with markup processing.",
    syntax: "translate [pattern] within [element]\n  [actions]",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/351.html"
  },
  "data-content": {
    detail: "Captures parsed character data content of an element",
    description: "Used inside an element rule to handle the text content of an element separately from its child elements.",
    syntax: "element [name]\n  output \"<tag>\"\n  data-content\n    output \"%q\"\n  output \"</tag>\"",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/83.html"
  },
  "document-start": {
    detail: "Fires just before implicit XML/SGML document parsing begins",
    description: "Initialization rule for aided-translation-type programs. Fires before the document body is parsed. Use for outputting XML declarations or document headers.",
    syntax: "document-start\n  output \"<?xml version='1.0'?>%n\"",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/107.html"
  },
  "document-end": {
    detail: "Fires after XML/SGML document parsing completes",
    description: "Termination rule for aided-translation-type programs. Fires after the entire document has been parsed. Use for outputting closing tags or summaries.",
    syntax: "document-end\n  output \"</root>%n\"",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/106.html"
  },
  "dtd-start": {
    detail: "Fires after DOCTYPE is declared, before the DTD body is processed",
    description: "Used in programs that process SGML or XML documents containing a DTD.",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/109.html"
  },
  "dtd-end": {
    detail: "Fires after the DTD has been completely processed",
    description: "Used in programs that process SGML or XML documents containing a DTD. Fires after all entity and element declarations have been read.",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/108.html"
  },
  "markup-comment": {
    detail: "Fires when an XML/SGML comment is encountered",
    description: "Use to preserve or discard comments. Must contain `%c` or `suppress`.",
    syntax: "markup-comment\n  suppress  ; discard comments\n\nmarkup-comment\n  output \"<!-- \" || comment-data || \" -->\"",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/197.html"
  },
  "markup-error": {
    detail: "Fires when invalid markup is encountered",
    description: "Allows custom handling of markup errors in SGML or XML input.",
    syntax: "markup-error\n  output to #error \"Markup error: \" || error-message || \"%n\"",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/198.html"
  },
  "processing-instruction": {
    detail: "Fires when a processing instruction (<?...?>) is encountered",
    description: "Handles XML/SGML processing instructions. Use `pi-name` and `pi-data` to access the target and content.",
    syntax: "processing-instruction\n  suppress  ; discard PIs",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/248.html"
  },

  // ── CONTROL FLOW ─────────────────────────────────────────────────────────

  "do": {
    detail: "Opens a block of actions",
    description: "Begins a `do...done` block. Used with `when`, `select`, `scan`, `xml-parse`, `sgml-parse`, and other constructs to group actions together.",
    syntax: "do [when condition]\n  [actions]\n[else]\n  [actions]\ndone",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/103.html"
  },
  "done": {
    detail: "Closes a do...done block",
    description: "Ends a `do...done` block.",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/104.html"
  },
  "when": {
    detail: "Conditional guard — can be applied to almost any rule or action",
    description: "Adds a condition to a rule or action. The rule or action only fires/executes if the condition is true. Can be applied to find rules, element rules, output, set, and most other actions.",
    syntax: "find \"pattern\" when [condition]\n  [actions]\n\ndo when [condition]\n  [actions]\ndone",
    example: 'find "cat" when count = 4\n  output "found cat at count 4"',
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/363.html"
  },
  "unless": {
    detail: "Negative conditional guard",
    description: "Inverse of `when`. The action fires only if the condition is false.",
    syntax: "throw my-error unless condition-is-met",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/357.html"
  },
  "else": {
    detail: "Alternative branch in a conditional block",
    description: "Provides an alternative action in `do when...else...done` or `do select...else...done` blocks. Can be combined with `when` to create `else when` chains.",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/111.html"
  },
  "repeat": {
    detail: "Begins a loop",
    description: "Starts a `repeat...again` loop. The loop continues until an `exit` action is encountered. Can be combined with `over` to iterate over a shelf, or with `scan` for pattern-based iteration.",
    syntax: "repeat\n  [actions]\n  exit when [condition]\nagain",
    example: "repeat\n  increment x\n  exit when x = 10\nagain",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/284.html"
  },
  "again": {
    detail: "Ends a repeat...again loop",
    description: "Closes a `repeat...again` loop, causing execution to return to the `repeat` statement.",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/284.html"
  },
  "exit": {
    detail: "Exits a repeat loop",
    description: "Terminates a `repeat...again` loop immediately. Usually used with `when` as a loop condition: `exit when condition`.",
    syntax: "exit\nexit when [condition]",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/114.html"
  },
  "over": {
    detail: "Iterates over all items in a shelf",
    description: "Used with `repeat` to iterate over every item in a shelf. The loop body executes once per shelf item, with the shelf variable pointing to the current item.",
    syntax: "repeat over [shelf]\n  [actions]\nagain",
    example: "repeat over names\n  output names || \"%n\"\nagain",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/228.html"
  },
  "catch": {
    detail: "Catches an exception thrown by throw",
    description: "Defines an exception handler. Execution jumps to the catch block when the corresponding `throw` is executed. OmniMark cleans up local scopes between the throw and the catch. Built-in exceptions: `#program-error`, `#external-exception`.",
    syntax: "catch #program-error code c message m location l\n  [error handling actions]\n\ncatch my-exception",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/1386.html"
  },
  "throw": {
    detail: "Throws an exception to a catch handler",
    description: "Transfers execution to the nearest enclosing `catch` with a matching name. OmniMark automatically cleans up local scopes and executes any `always` blocks on the way. Can pass data to the catch handler.",
    syntax: "throw [catch-name]\nthrow [catch-name] because [value]",
    example: "throw server-die because \"maintenance\"",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/349.html"
  },
  "always": {
    detail: "Executes regardless of whether an exception occurred (like finally)",
    description: "Actions in an `always` block execute whether processing completed normally or an exception was thrown. Equivalent to `finally` in Java/C#. Used to ensure cleanup always happens.",
    syntax: "repeat\n  [actions]\n  catch #program-error\n  always\n    close my-file  ; runs always\nagain",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/1340.html"
  },
  "return": {
    detail: "Returns a value from a function",
    description: "Exits the current function and optionally returns a value to the caller.",
    syntax: "return [expression]",
    example: "define counter function add\n  (value counter x, value counter y)\nas\n  return x + y",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/289.html"
  },
  "halt": {
    detail: "Terminates the program immediately",
    description: "Stops program execution immediately with an optional exit code.",
    syntax: "halt\nhalt with [exit-code]",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/153.html"
  },
  "submit": {
    detail: "Sends input to the pattern processor (find rules)",
    description: "Sends a string or file to the pattern processor, firing find rules against it. The current input is suspended until the submitted input is fully processed.",
    syntax: "submit [string]\nsubmit file [filename]",
    example: 'submit "Mary had a little lamb"\nsubmit file "input.txt"',
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/336.html"
  },
  "suppress": {
    detail: "Continues parsing but discards all output",
    description: "Used in markup rules as an alternative to `%c`. Continues parsing the element content but suppresses (discards) any output generated. Equivalent to `output \"%c\"` but with output thrown away.",
    syntax: "element comment\n  suppress",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/337.html"
  },
  "output": {
    detail: "Sends text to the current output stream",
    description: "Writes a string to the current output destination. Supports format escape sequences like `%n` (newline), `%t` (tab), `%c` (continue parsing), and format operators like `\"d\" format counter`.",
    syntax: "output [string-expression]",
    example: 'output "Hello world%n"\noutput "d" format mycount || "%n"',
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/227.html"
  },
  "output-to": {
    detail: "Redirects current output to a stream permanently",
    description: "Changes the destination of the current output to the named stream for the remainder of the current scope. Unlike `using output as`, this change is not automatically reverted.",
    syntax: "output-to [stream]",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/229.html"
  },
  "put": {
    detail: "Writes to a named stream (shorthand for using output as)",
    description: "Writes a string directly to a named stream without changing the current output. Shorthand for `using output as [stream] do output ... done`.",
    syntax: "put [stream] [string]",
    example: 'put my-file "line of text%n"',
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/263.html"
  },
  "open": {
    detail: "Opens a stream for writing",
    description: "Opens a stream variable as a file or buffer. If opened as `buffer`, the stream accumulates content in memory. A stream must be closed before it can be read. Using `open` on an already-opened stream discards existing content.",
    syntax: "open [stream] as file [filename]\nopen [stream] as buffer",
    example: "open mystream as buffer\nput mystream \"content\"\nclose mystream\noutput mystream",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/226.html"
  },
  "close": {
    detail: "Closes a stream — required before reading",
    description: "Closes a stream. A stream **must** be closed before it can be read or output. Closing makes the accumulated content available for reading.",
    syntax: "close [stream]",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/65.html"
  },
  "reopen": {
    detail: "Reopens a closed stream preserving its content",
    description: "Reopens a previously closed stream for appending. Unlike `open` (which discards content), `reopen` preserves existing content and appends new content.",
    syntax: "reopen [stream]\nreopen [stream] as file [filename]",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/282.html"
  },
  "set": {
    detail: "Assigns a value to a variable or file",
    description: "Assigns a value to a variable. For streams, `set` is shorthand for `open...put...close`. Can also write directly to a file with `set file \"name.txt\" to \"value\"`.",
    syntax: "set [variable] to [expression]\nset file [filename] to [string]\nset new [shelf] to [value]",
    example: 'set title to "Hamlet"\nset count to count + 1\nset new names to "Alice"',
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/304.html"
  },
  "increment": {
    detail: "Increases a counter by 1 (or by a specified amount)",
    description: "Increments a counter variable. By default increments by 1. Use `by` to specify a different amount.",
    syntax: "increment [counter]\nincrement [counter] by [amount]",
    example: "increment wordcount\nincrement score by 10",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/162.html"
  },
  "decrement": {
    detail: "Decreases a counter by 1 (or by a specified amount)",
    description: "Decrements a counter variable. By default decrements by 1. Use `by` to specify a different amount.",
    syntax: "decrement [counter]\ndecrement [counter] by [amount]",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/88.html"
  },
  "remove": {
    detail: "Removes an item from a shelf",
    description: "Removes the current (last) item from a shelf. Use `remove shelf item N` to remove a specific item by position. Commonly used to implement stack (remove last) and queue (remove item 1) behavior.",
    syntax: "remove [shelf]\nremove [shelf] item [n]",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/281.html"
  },
  "using": {
    detail: "Temporarily changes program context (output, group, etc.)",
    description: "Temporarily changes the current output destination, active rule group, or other context for the duration of a `do...done` block. After the block, the previous context is restored.",
    syntax: "using output as [stream]\ndo\n  [actions]\ndone\n\nusing group [name]\ndo\n  [actions]\ndone",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/359.html"
  },
  "define": {
    detail: "Defines a function",
    description: "Declares a function. Functions can return a value (specify return type before `function`) or only produce output (no return type). Parameters can be `value` (by value) or `modifiable` (by reference).",
    syntax: "define [return-type] function [name]\n  ([param-type] [type] [name], ...)\nas\n  [actions]\n  return [value]",
    example: "define counter function add\n  (value counter x, value counter y)\nas\n  return x + y",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/97.html"
  },
  "declare": {
    detail: "Declares program-level constructs (catches, properties, etc.)",
    description: "Used to declare catches, stream properties, and other program-level items before they are used.",
    syntax: "declare catch [name]\ndeclare catch [name] because value stream reason\ndeclare #process-input has unbuffered",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/86.html"
  },
  "include": {
    detail: "Includes code from another file",
    description: "Includes the content of another OmniMark file at the point of the declaration. Equivalent to a textual substitution. Commonly used `.xin` files are reusable libraries.",
    syntax: "include \"filename.xin\"",
    example: 'include "omutil.xin"\ninclude "omtcp.xin"',
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/163.html"
  },
  "global": {
    detail: "Declares a global variable",
    description: "Declares a variable that is accessible throughout the entire program. Global declarations typically appear at the top of the program.",
    syntax: "global [type] [name]\nglobal [type] [name] initial {[value]}\nglobal [type] [name] variable",
    example: "global counter wordcount initial {0}\nglobal stream title initial {\"untitled\"}\nglobal stream names variable",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/150.html"
  },
  "local": {
    detail: "Declares a local variable",
    description: "Declares a variable that is only accessible within the rule or function where it is declared. Local variables are created when the rule fires and destroyed when it completes.",
    syntax: "local [type] [name]\nlocal [type] [name] initial {[value]}",
    example: "element para\n  local stream content\n  open content as buffer\n  using output as content\n  do\n    output \"%c\"\n  done\n  close content",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/193.html"
  },
  "macro": {
    detail: "Defines a macro (text substitution)",
    description: "Defines a macro — a named text substitution expanded before compilation. Macros can take token arguments. All occurrences of the macro name are replaced with the macro body at compile time.",
    syntax: "macro [name] is\n  [text or code]\nmacro-end",
    example: 'macro company is\n  "Acme Corporation"\nmacro-end\n\noutput "Welcome to " || company',
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/196.html"
  },
  "group": {
    detail: "Defines a named rule group",
    description: "Organizes rules into named groups that can be activated or deactivated selectively. Only rules in active groups fire. The default group `#implied` is always active. All rules before the first `group` statement belong to `#implied`.",
    syntax: "group [name]\n\nusing group [name]\ndo\n  submit [input]\ndone",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/151.html"
  },
  "scan": {
    detail: "Pattern-matches against a value (do scan) or iterates scanning (repeat scan)",
    description: "Used in two forms: `do scan` tests a value against patterns and executes the matching branch; `repeat scan` iterates over an input consuming it pattern by pattern.",
    syntax: "do scan [expression]\n  match \"pattern\"\n    [actions]\n  else\n    [actions]\ndone",
    example: 'do scan day\n  match "Monday"\n    output "Start of week%n"\n  match "Friday"\n    output "TGIF%n"\n  else\n    output "Midweek%n"\ndone',
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/300.html"
  },
  "match": {
    detail: "Pattern branch inside a do scan block",
    description: "Defines a pattern to match inside a `do scan` or `repeat scan` block. If the pattern matches, the associated actions execute.",
    syntax: "do scan [expression]\n  match [pattern]\n    [actions]\ndone",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/200.html"
  },
  "select": {
    detail: "Value-based conditional (like switch/case)",
    description: "Selects one of several actions based on the value of an expression. Each `case` specifies a range or value. Unlike `do when`, `do select` tests a single expression against multiple values.",
    syntax: "do select [expression]\n  case [value] to [value]\n    [actions]\n  else\n    [actions]\ndone",
    example: "do select count\n  case 1 to 5\n    output \"low%n\"\n  case 6 to 10\n    output \"high%n\"\n  else\n    output \"out of range%n\"\ndone",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/302.html"
  },

  // ── TYPE KEYWORDS ─────────────────────────────────────────────────────────

  "stream": {
    detail: "String/text variable type",
    description: "A variable that holds a string (sequence of characters). Streams can be opened as buffers for multi-step construction, or set directly. Must be closed before reading.",
    syntax: "global stream [name]\nlocal stream [name] initial {\"value\"}",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/333.html"
  },
  "counter": {
    detail: "Integer variable type",
    description: "A variable that holds an integer value. Supports `increment`, `decrement`, and arithmetic operators. Can be formatted for output with `\"d\" format counter`.",
    syntax: "global counter [name] initial {0}\nlocal counter [name]",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/76.html"
  },
  "switch": {
    detail: "Boolean variable type",
    description: "A variable that holds a boolean value (`true` or `false`). Used with `do when`, `exit when`, and other conditional constructs.",
    syntax: "global switch [name] initial {false}\nlocal switch [name]",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/342.html"
  },
  "bcd": {
    detail: "Decimal number type for financial calculations",
    description: "A variable type for precise decimal arithmetic. Unlike floating point, BCD provides accurate fractions for financial calculations. Requires `include \"ombcd.xin\"`.",
    syntax: "local bcd [name]\nset [name] to bcd 19.95",
    example: 'include "ombcd.xin"\nlocal bcd price\nset price to bcd 19.95\noutput "<$,NNZ.ZZ>" format price',
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/56.html"
  },
  "variable": {
    detail: "Modifier for shelves — allows dynamic resizing",
    description: "Declares a shelf that can grow or shrink as needed. Without `variable`, shelves have a fixed size. Use `variable` when the number of items is not known in advance.",
    syntax: "global stream [name] variable\nglobal counter [name] variable initial {1, 2, 3}",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/360.html"
  },
  "referent": {
    detail: "Placeholder variable — can be output before value is assigned",
    description: "A referent is a placeholder that can be placed in the output stream before its final value is known. When the value is later assigned, the output is updated. Useful for page numbers, cross-references, and any forward-reference scenario.",
    syntax: "output \"Page 1 of \" || referent \"total\"\n; ... later ...\nset referent \"total\" to \"d\" format pagecount",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/285.html"
  },

  // ── CHARACTER CLASSES ─────────────────────────────────────────────────────

  "any": {
    detail: "Character class — matches any single character",
    description: "Matches any single character, including newlines. Use `find any` as a catch-all at the end of your find rules to absorb unmatched input.",
    syntax: "find any\nfind any+",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/45.html"
  },
  "any-text": {
    detail: "Character class — matches any character except newline",
    description: "Matches any single character except a newline character. Useful for matching within a single line.",
    syntax: "find any-text+",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/46.html"
  },
  "letter": {
    detail: "Character class — matches a single letter (upper or lower case)",
    description: "Matches any single alphabetic character, either uppercase or lowercase.",
    syntax: "find letter+\nfind letter {3}",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/189.html"
  },
  "uc": {
    detail: "Character class — matches a single uppercase letter",
    description: "Matches any single uppercase letter (A–Z). Useful for matching capitalized words or identifiers.",
    syntax: "find uc letter*  ; matches capitalized words",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/356.html"
  },
  "lc": {
    detail: "Character class — matches a single lowercase letter",
    description: "Matches any single lowercase letter (a–z).",
    syntax: "find lc+",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/187.html"
  },
  "digit": {
    detail: "Character class — matches a single decimal digit (0–9)",
    description: "Matches any single digit character from 0 to 9.",
    syntax: "find digit+\nfind digit {4}  ; exactly 4 digits",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/101.html"
  },
  "space": {
    detail: "Character class — matches a single space character",
    description: "Matches a single space character (ASCII 32). Use `blank` for space-or-tab, or `white-space` for space, tab, or newline.",
    syntax: "find space+",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/323.html"
  },
  "blank": {
    detail: "Character class — matches a single space or tab",
    description: "Matches either a space or a tab character. More permissive than `space` but not `white-space`.",
    syntax: "find blank+",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/57.html"
  },
  "white-space": {
    detail: "Character class — matches space, tab, or newline",
    description: "Matches any whitespace character: space, tab, or newline. Use for consuming whitespace between tokens.",
    syntax: "find white-space+",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/364.html"
  },
  "line-start": {
    detail: "Zero-width assertion — matches the start of a line",
    description: "Matches the position at the start of a line without consuming any characters.",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/190.html"
  },
  "line-end": {
    detail: "Zero-width assertion — matches the end of a line",
    description: "Matches the position at the end of a line without consuming any characters.",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/188.html"
  },
  "word-start": {
    detail: "Zero-width assertion — matches the start of a word",
    description: "Matches the position at the beginning of a word (transition from non-letter to letter).",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/366.html"
  },
  "word-end": {
    detail: "Zero-width assertion — matches the end of a word",
    description: "Matches the position at the end of a word (transition from letter to non-letter).",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/365.html"
  },

  // ── BUILT-IN STREAMS ──────────────────────────────────────────────────────

  "#process-input": {
    detail: "Built-in stream bound to standard input (stdin)",
    description: "The standard input stream. Bound to the keyboard or piped input in command-line use. Declare as `unbuffered` for CGI or network programs.",
    syntax: "declare #process-input has unbuffered",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/27.html"
  },
  "#process-output": {
    detail: "Built-in stream bound to standard output (stdout)",
    description: "The standard output stream. Declare as `binary-mode` for CGI programs to ensure correct newline handling across platforms.",
    syntax: "declare #process-output has binary-mode",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/28.html"
  },
  "#main-input": {
    detail: "Built-in stream bound to the input file(s) specified on the command line",
    description: "If an input file is specified on the command line, `#main-input` is bound to it. Otherwise it is bound to standard input. Commonly used as the source for `submit` or `do xml-parse`.",
    syntax: "submit file #main-input\ndo xml-parse document\n  scan file #main-input\n  output \"%c\"\ndone",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/25.html"
  },
  "#main-output": {
    detail: "Built-in stream bound to the output file specified on the command line",
    description: "If an output file is specified on the command line (`-o filename`), `#main-output` is bound to it. Otherwise it is bound to standard output.",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/26.html"
  },
  "#error": {
    detail: "Built-in stream bound to standard error (stderr)",
    description: "The standard error stream. Use for diagnostic output, error messages, and logging that should not mix with the main output.",
    syntax: "output to #error \"Error: \" || message || \"%n\"",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/10.html"
  },
  "#current-output": {
    detail: "Represents all current output destinations",
    description: "Stands for all currently active output destinations. Used to add a new destination to all currently active ones without losing the existing ones.",
    syntax: "output using my-buffer and #current-output\ndo\n  output \"goes to both\"\ndone",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/17.html"
  },
  "#current-input": {
    detail: "Represents the current input stream",
    description: "Refers to whatever stream is currently being processed as input.",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/1393.html"
  },
  "#markup-parser": {
    detail: "The markup parser input stream",
    description: "Represents the input stream of the markup processor. Note: referents cannot be output to `#markup-parser`.",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/29.html"
  },
  "#program-error": {
    detail: "Built-in exception for runtime errors",
    description: "Thrown automatically by OmniMark when a runtime error occurs. Catch it to keep a server or batch process running despite errors. Provides `code`, `message`, and `location` parameters.",
    syntax: "catch #program-error code c message m location l\n  output to #error \"Error \" || \"d\" format c || \": \" || m || \"%n\"",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/1338.html"
  },
  "#external-exception": {
    detail: "Built-in exception for file/network/external errors",
    description: "Thrown when OmniMark cannot communicate with the external world — e.g., file not found, network failure. Provides `identity`, `message`, and `location` parameters. Uncaught, it becomes a `#program-error`.",
    syntax: "catch #external-exception identity i message m location l\n  output \"Could not open file: \" || m || \"%n\"",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/1339.html"
  },
  "#implied": {
    detail: "The default rule group — always active",
    description: "The default group that is always active. Rules before the first `group` statement belong to `#implied`. You cannot disable it. Always place at least one rule (e.g., `process-start`) in `#implied` when using groups.",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/818.html"
  },
  "#group": {
    detail: "Represents all currently active rule groups",
    description: "Used with `using group` to add a group to the current set of active groups without replacing them.",
    syntax: "using group extra and #group\ndo\n  submit file \"input.txt\"\ndone",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/377.html"
  },
  "#command-line-names": {
    detail: "Shelf containing command-line arguments",
    description: "A shelf holding the command-line argument values passed to the program. Access individual args with `#command-line-names item N`.",
    syntax: "output #command-line-names item 1",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/368.html"
  },

  // ── OPERATORS ─────────────────────────────────────────────────────────────

  "format": {
    detail: "Converts a value to a formatted string",
    description: "Converts a counter or BCD value to a string using a format template. For counters, `\"d\" format x` produces a decimal integer string. For BCD, use templates like `\"<$,NNZ.ZZ>\" format price`.",
    syntax: "\"d\" format [counter]\n\"<template>\" format [bcd]",
    example: 'output "d" format wordcount || "%n"\noutput "<$,NNZ.ZZ>" format total',
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/396.html"
  },
  "modulo": {
    detail: "Returns the remainder of integer division",
    description: "Returns the remainder when one integer is divided by another.",
    syntax: "[counter] modulo [counter]",
    example: "set remainder to 17 modulo 5  ; result: 2",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/205.html"
  },
  "matches": {
    detail: "Tests whether a value matches a pattern",
    description: "Returns true if the stream value matches the given pattern. Used as a condition in `when` guards.",
    syntax: "[stream] matches [pattern]",
    example: "find letter+ when found matches uc letter*\n  output \"Capitalized: \" || found",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/201.html"
  },
  "is": {
    detail: "Tests a property of a variable or stream",
    description: "Tests boolean properties: `x is specified`, `x is keyed`, `stream is open`, etc. Returns true or false.",
    syntax: "attr \"id\" is specified\nnames is keyed\nmy-stream is open",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/170.html"
  },
  "except": {
    detail: "Excludes characters from a character class",
    description: "Used in custom character classes to exclude specific characters.",
    syntax: "find [any except \"}\"]",
    example: 'find [any except "}"]  ; any char except right brace',
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/113.html"
  },
  "lookahead": {
    detail: "Zero-width pattern assertion — matches without consuming input",
    description: "Tests that the following pattern exists without consuming any characters from the input. Useful for context-sensitive matching.",
    syntax: "find letter+ lookahead \":\"",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/195.html"
  },
  "number-of": {
    detail: "Returns the number of items in a shelf",
    description: "Returns the count of items currently in a shelf.",
    syntax: "number of [shelf]\nnumber-of [shelf]",
    example: "exit when number of names = 0",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/221.html"
  },
  "key": {
    detail: "The key (name) associated with a shelf item",
    description: "Accesses or sets the string key of a shelf item. Shelves can be indexed by position (`item N`) or by key. Use `key of shelf` to read the key of the current item.",
    syntax: "key of [shelf]\nkey of [shelf] item [n]\nset key of [shelf] to \"name\"",
    example: 'set new quotes key "Hamlet" to "To be or not to be?"',
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/183.html"
  },
  "date": {
    detail: "Returns a formatted date/time string",
    description: "Returns the current date or time as a formatted string. The format uses `=Y` (year), `=M` (month), `=D` (day), `=h` (hour), `=m` (minute), `=s` (second), `=W` (weekday name).",
    syntax: "date \"=Y/=M/=D =h:=m:=s\"\ndate \"=W\"",
    example: 'set day to date "=W"\noutput date "=Y/=M/=D" || "%n"',
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/84.html"
  },
  "abs": {
    detail: "Returns the absolute value of a number",
    description: "Returns the absolute (non-negative) value of a counter or BCD expression.",
    syntax: "abs [counter]",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/36.html"
  },
  "ceiling": {
    detail: "Rounds a number up to the nearest integer",
    description: "Returns the smallest integer greater than or equal to the given value.",
    syntax: "ceiling [bcd]",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/63.html"
  },
  "floor": {
    detail: "Rounds a number down to the nearest integer",
    description: "Returns the largest integer less than or equal to the given value.",
    syntax: "floor [bcd]",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/131.html"
  },
  "round": {
    detail: "Rounds a number to the nearest integer",
    description: "Rounds a BCD value to the nearest integer.",
    syntax: "round [bcd]",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/293.html"
  },
  "sqrt": {
    detail: "Returns the square root of a number",
    description: "Returns the square root of a BCD value.",
    syntax: "sqrt [bcd]",
    url: "https://developers.stilo.com/docs11.0.3/html/keyword/326.html"
  },
};

module.exports = { DOCS };
