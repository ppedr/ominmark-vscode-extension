# OmniMark VS Code Extension Documentation

This project provides full-featured support for the OmniMark programming language in Visual Studio Code. Below is an overview of each part of the extension and its main features.

---

## Project Structure

- **package.json**: Extension manifest. Declares language, grammar, snippets, activation events, and metadata.
- **README.md**: Quickstart and feature summary. Lists supported file types, features, and snippet reference.
- **Documentation.md**: This file. Detailed technical documentation for the extension.
- **LICENSE.txt**: License information.
- **DEV.md**: Developer notes and contribution guidelines.

### Main Folders
- **src/**: Extension source code (JavaScript).
- **syntaxes/**: TextMate grammar for syntax highlighting.
- **snippets/**: OmniMark code snippets for common constructs.

---

## Features

- **Syntax Highlighting**: Provided by `syntaxes/omnimark.tmLanguage.json`. Covers keywords, operators, streams, character classes, comments, strings, and markup.
- **Snippets**: Defined in `snippets/omnimark.json`. Includes rules, loops, conditionals, XML/SGML parsing, variable declarations, and error handling.
- **Hover Documentation**: Implemented in `src/hoverData.js`. Offline docs for keywords, built-ins, and rules, with syntax, description, and examples.
- **Auto-indentation & Bracket Matching**: Configured in `language-configuration.json`. Custom indentation rules, bracket pairs, and on-enter actions.
- **Completion**: `src/completionData.js` provides keyword, stream, and snippet completions. User-defined functions are scanned and offered as completions.
- **Go to Definition / Peek Definition**: `src/extension.js` implements definition provider for functions and rules.
- **Language Configuration**: `language-configuration.json` sets word patterns, indentation, and comment syntax.
- **Automatic Activation**: Extension activates for `.xom`, `.xin`, `.xmd`, `.xar` files.

---

## Source Code Overview

### src/extension.js
- Main entry point. Registers hover, definition, and completion providers.
- Handles workspace file scanning for user-defined functions.
- Implements helpers for word detection, string/comment context, and rule parsing.

### src/completionData.js
- Defines completion items for OmniMark keywords, streams, snippets, types, operators, and character classes.
- Uses VS Code CompletionItem API for rich completions.

### src/hoverData.js
- Contains offline documentation for OmniMark keywords, built-ins, and rules.
- Provides syntax, description, examples, and links to official docs.

---

## Syntax Highlighting

### syntaxes/omnimark.tmLanguage.json
- TextMate grammar for OmniMark.
- Patterns for comments, strings, character classes, keywords, operators, streams, and markup.
- Enables rich syntax highlighting in VS Code.

---

## Language Configuration

### language-configuration.json
- Sets comment syntax (`;`), bracket pairs, auto-closing, and indentation rules.
- Custom word pattern for OmniMark tokens.

---

## Snippets

### snippets/omnimark.json
- Provides code snippets for rules, loops, XML/SGML parsing, variable declarations, error handling, and more.
- Each snippet includes a prefix, body, and description.

---

## How It Works

- The extension activates for OmniMark files.
- Syntax highlighting is provided by the grammar.
- Completion and hover providers offer context-aware suggestions and documentation.
- Snippets accelerate writing common OmniMark constructs.
- Go to Definition and Peek Definition help navigate large codebases.

---

## References

- [OmniMark Official Documentation](https://www.stilo.com/omnimark/)
- [OmniMark 11.0 Keyword Reference](https://developers.stilo.com/docs11.0.3/html/keyword/)

---

## Contributing

See `DEV.md` for developer notes and contribution guidelines.
