import * as vscode from "vscode";

export function isWordChar(ch: string): boolean {
  return /[a-zA-Z0-9_#-]/.test(ch);
}

export function isInStringOrComment(document: vscode.TextDocument, position: vscode.Position): boolean {
  const line = document.lineAt(position).text;
  const col = position.character;
  let inString = false;
  let quoteChar: string | null = null;

  for (let i = 0; i < col; i++) {
    const ch = line[i];
    if (inString) {
      if (ch === quoteChar) { inString = false; quoteChar = null; }
      continue;
    }
    if (ch === '"' || ch === "'") { inString = true; quoteChar = ch; continue; }
    if (ch === ';') return true;
  }
  return inString;
}

export function getWordAtPosition(document: vscode.TextDocument, position: vscode.Position): string | null {
  const line = document.lineAt(position).text;
  const col = position.character;

  let inString = false;
  let quoteChar: string | null = null;

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
