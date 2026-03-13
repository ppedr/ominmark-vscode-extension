const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const { DOCS } = require("./hoverData");
const { KEYWORD_COMPLETIONS, STREAM_COMPLETIONS, SNIPPET_COMPLETIONS } = require("./completionData");

// ── Shared helpers ────────────────────────────────────────────────────────────

/**
 * Returns the OmniMark token under the cursor, or null if the cursor
 * is inside a string literal or a comment.
 */
function getWordAtPosition(document, position) {
  const line = document.lineAt(position).text;
  const col = position.character;

  let inString = false;
  let quoteChar = null;

  for (let i = 0; i <= line.length; i++) {
    const ch = line[i];
    if (inString) {
      if (ch === quoteChar) {
        if (i === col) return null;
        inString = false;
        quoteChar = null;
      } else {
        if (i === col) return null;
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      if (i === col) return null;
      inString = true;
      quoteChar = ch;
      continue;
    }
    if (ch === ';') {
      if (col >= i) return null;
      break;
    }
  }

  let start = col;
  while (start > 0 && isWordChar(line[start - 1])) start--;
  let end = col;
  while (end < line.length && isWordChar(line[end])) end++;

  const word = line.slice(start, end);
  return word || null;
}

/**
 * Returns true if the cursor position is inside a string or comment.
 */
function isInStringOrComment(document, position) {
  const line = document.lineAt(position).text;
  const col = position.character;
  let inString = false;
  let quoteChar = null;

  for (let i = 0; i < col; i++) {
    const ch = line[i];
    if (inString) {
      if (ch === quoteChar) { inString = false; quoteChar = null; }
      continue;
    }
    if (ch === '"' || ch === "'") { inString = true; quoteChar = ch; continue; }
    if (ch === ';') return true; // in comment
  }
  return inString;
}

function isWordChar(ch) {
  return /[a-zA-Z0-9_#-]/.test(ch);
}

// ── Hover ─────────────────────────────────────────────────────────────────────

function buildHover(word, entry) {
  const md = new vscode.MarkdownString();
  md.isTrusted = true;
  md.appendMarkdown(`### \`${word}\`\n\n`);
  md.appendMarkdown(`${entry.detail}\n\n`);
  md.appendMarkdown("---\n\n");
  md.appendMarkdown(`${entry.description}\n\n`);
  if (entry.syntax) {
    md.appendMarkdown("**Syntax**\n\n");
    md.appendCodeblock(entry.syntax, "omnimark");
  }
  if (entry.example) {
    md.appendMarkdown("**Example**\n\n");
    md.appendCodeblock(entry.example, "omnimark");
  }
  if (entry.url) {
    md.appendMarkdown(`\n[📖 Official documentation](${entry.url})`);
  }
  return new vscode.Hover(md);
}

// ── Go to Definition ──────────────────────────────────────────────────────────

const DEFINE_RE = /^\s*define\b[^(]*\bfunction\s+([a-zA-Z][a-zA-Z0-9_-]*)\s*\(/i;

function findDefinitionInText(text, funcName) {
  const lines = text.split("\n");
  const target = funcName.toLowerCase();
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(DEFINE_RE);
    if (m && m[1].toLowerCase() === target) return i;
  }
  return -1;
}

function collectOmniMarkFiles(dir, result, depth = 0) {
  if (depth > 5) return;
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
  catch { return; }
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectOmniMarkFiles(full, result, depth + 1);
    else if (/\.(xom|xin|xmd)$/i.test(entry.name)) result.add(full);
  }
}

function collectSearchFiles(document) {
  const files = new Set();
  files.add(document.uri.fsPath);
  const wf = vscode.workspace.getWorkspaceFolder(document.uri);
  if (wf) collectOmniMarkFiles(wf.uri.fsPath, files);
  else collectOmniMarkFiles(path.dirname(document.uri.fsPath), files);
  return [...files];
}

function findDefinition(document, funcName) {
  for (const filePath of collectSearchFiles(document)) {
    let text;
    const openDoc = vscode.workspace.textDocuments.find(d => d.uri.fsPath === filePath);
    if (openDoc) text = openDoc.getText();
    else { try { text = fs.readFileSync(filePath, "utf8"); } catch { continue; } }
    const line = findDefinitionInText(text, funcName);
    if (line !== -1) return { filePath, line };
  }
  return null;
}

// ── Completion ────────────────────────────────────────────────────────────────

/**
 * Scans all OmniMark files in the workspace and returns completion items
 * for every user-defined function found.
 */
function getUserFunctionCompletions(document) {
  const files = collectSearchFiles(document);
  const results = [];
  const seen = new Set();

  for (const filePath of files) {
    let text;
    const openDoc = vscode.workspace.textDocuments.find(d => d.uri.fsPath === filePath);
    if (openDoc) text = openDoc.getText();
    else { try { text = fs.readFileSync(filePath, "utf8"); } catch { continue; } }

    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(DEFINE_RE);
      if (!m) continue;
      const name = m[1];
      if (seen.has(name.toLowerCase())) continue;
      seen.add(name.toLowerCase());

      const c = new vscode.CompletionItem(name, vscode.CompletionItemKind.Function);
      c.detail = `User function — ${path.basename(filePath)}`;
      c.documentation = new vscode.MarkdownString(
        `Defined in \`${path.basename(filePath)}\` at line ${i + 1}.\n\nPress **F12** to go to definition.`
      );
      // Insert as function call with cursor inside parens
      c.insertText = new vscode.SnippetString(`${name}($1)`);
      results.push(c);
    }
  }
  return results;
}

// ── Activation ────────────────────────────────────────────────────────────────

function activate(context) {

  // Hover provider
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      { language: "omnimark" },
      {
        provideHover(document, position) {
          const word = getWordAtPosition(document, position);
          if (!word) return null;
          const entry = DOCS[word.toLowerCase()];
          if (!entry) return null;
          return buildHover(word, entry);
        },
      }
    )
  );

  // Definition provider (F12 / Ctrl+Click)
  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      { language: "omnimark" },
      {
        provideDefinition(document, position) {
          const word = getWordAtPosition(document, position);
          if (!word) return null;
          if (DOCS[word.toLowerCase()]) return null; // skip built-ins
          const result = findDefinition(document, word);
          if (!result) return null;
          return new vscode.Location(
            vscode.Uri.file(result.filePath),
            new vscode.Position(result.line, 0)
          );
        },
      }
    )
  );

  // Completion provider
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { language: "omnimark" },
      {
        provideCompletionItems(document, position) {
          // No completions inside strings or comments
          if (isInStringOrComment(document, position)) return [];

          const line = document.lineAt(position).text;
          const prefix = line.slice(0, position.character);

          // If typing a #-prefixed stream, only show stream completions
          if (/#[a-zA-Z-]*$/.test(prefix)) {
            return STREAM_COMPLETIONS;
          }

          // Otherwise return keywords + snippets + user functions
          return [
            ...KEYWORD_COMPLETIONS,
            ...SNIPPET_COMPLETIONS,
            ...getUserFunctionCompletions(document),
          ];
        },
      },
      // Trigger characters: # triggers stream completions, letters trigger normally
      "#", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
      "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
      "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
      "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
    )
  );
}

function deactivate() {}

module.exports = { activate, deactivate };
