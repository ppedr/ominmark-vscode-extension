import * as vscode from "vscode";
import * as fs from "fs";
import { DOCS } from "../data/hoverData";
import { getWordAtPosition } from "../utils/tokenUtils";
import { collectSearchFiles } from "../utils/fileUtils";

export const DEFINE_RE = /^\s*define\b[^(]*\bfunction\s+([a-zA-Z][a-zA-Z0-9_-]*)\s*\(/i;

export function findDefinitionInText(text: string, funcName: string): number {
  const lines = text.split("\n");
  const target = funcName.toLowerCase();
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(DEFINE_RE);
    if (m && m[1].toLowerCase() === target) return i;
  }
  return -1;
}

function findDefinition(document: vscode.TextDocument, funcName: string): { filePath: string; line: number } | null {
  for (const filePath of collectSearchFiles(document)) {
    let text: string;
    const openDoc = vscode.workspace.textDocuments.find(d => d.uri.fsPath === filePath);
    if (openDoc) text = openDoc.getText();
    else { try { text = fs.readFileSync(filePath, "utf8"); } catch { continue; } }
    const line = findDefinitionInText(text, funcName);
    if (line !== -1) return { filePath, line };
  }
  return null;
}

export function register(context: vscode.ExtensionContext): void {
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
}
