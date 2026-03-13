# OmniMark Language Support for VS Code

Syntax highlighting, snippets, and language support for the [OmniMark](https://www.stilo.com/omnimark/) programming language.

Supports `.xom`, `.xin`, `.xmd`, and `.xar` files.

## Features

The extension provides advanced OmniMark language support, including:

- **Syntax highlighting** for all OmniMark keywords, operators, character classes, built-in streams, strings, comments, and format escape sequences
- **Autocomplete (Completion)**: Context-aware suggestions for OmniMark keywords, streams, snippets, operators, character classes, and user-defined functions. As you type, the extension offers completions for both built-in and custom code.
- **User Function Completion**: Scans all OmniMark files in your workspace and suggests user-defined functions in autocomplete, including their location and quick insertion as function calls.
- **Rich Snippet Completions**: Snippets are available directly in autocomplete, not just via prefix, making it faster to insert common constructs.
- **Code snippets** for all common constructs (rules, loops, conditionals, functions, shelves, catch/throw, XML/SGML parsing)
- **Hover documentation** for keywords, built-ins, and rules, with syntax, description, and examples (offline, based on OmniMark 11.0 docs)
- **Auto-indentation** for `do...done`, `repeat...again`, `element`, `find`, etc.
- **Bracket matching** and auto-close for `{}`, `[]`, `()`, `"`, `'`
- **Line comments** with `;`
- **Go to Definition / Peek Definition**: Use Ctrl+Click or F12 to jump to function, rule, or keyword definitions in OmniMark files, including user-defined functions.
- **Language configuration**: Custom word pattern, indentation rules, and on-enter actions for OmniMark
- **Language ID**: `omnimark` (for use in `.github/copilot-instructions.md` fenced code blocks)
- **Automatic activation**: Extension activates for OmniMark files (`.xom`, `.xin`, `.xmd`, `.xar`)
## Snippets Reference

| Prefix | Description |
|--------|-------------|
| `process` | Main process rule |
| `process-start` | Initialization rule |
| `process-end` | Termination rule |
| `find` | Pattern find rule |
| `element` | XML/SGML element rule |
| `elementattr` | Element rule passing through attributes |
| `xmlparse` | `do xml-parse` block |
| `sgmlparse` | `do sgml-parse` block |
| `xmlskeleton` | Full XML transformation skeleton |
| `dowhen` | `do when...else...done` block |
| `dowhenmulti` | Multi-branch conditional |
| `doselect` | `do select...case` block |
| `doscan` | `do scan...match` block |
| `repeat` | Basic `repeat...again` loop |
| `repeatover` | `repeat over` shelf iteration |
| `gstream` | Global stream declaration |
| `gcounter` | Global counter declaration |
| `gswitch` | Global switch declaration |
| `gshelf` | Global variable shelf |
| `lstream` | Local stream declaration |
| `lcounter` | Local counter declaration |
| `openbuffer` | Open/write/close a buffer stream |
| `usingoutput` | `using output as` block |
| `deffunc` | Define a function with return value |
| `defvoid` | Define a void function |
| `declarecatch` | Declare a named exception |
| `catcherror` | Catch `#program-error` |
| `catchexternal` | Catch `#external-exception` |
| `group` | Rule group declaration |
| `usinggroup` | Activate a rule group |
| `macro` | Macro definition |
| `include` | Include file |
| `outputd` | Output counter as formatted string |

## Installation

### From VSIX (manual)

1. Download `omnimark-language-1.0.0.vsix`
2. In VS Code: `Extensions` → `...` (top right) → `Install from VSIX...`
3. Select the file and reload VS Code

### From source

```bash
npm install -g @vscode/vsce
cd vscode-omnimark
vsce package
# generates omnimark-language-1.0.0.vsix
code --install-extension omnimark-language-1.0.0.vsix
```

### Publish to Marketplace

```bash
# Create a publisher at https://marketplace.visualstudio.com/manage
# Then:
vsce publish
```

## Development

```bash
# Install dependencies
npm install

# Open in VS Code with extension host
code .
# Press F5 to launch Extension Development Host
```

## Based on

- jEdit OmniMark syntax mode by Lionel Fiol
- OmniMark 11.0 official documentation at https://developers.stilo.com/docs11.0.3/html/