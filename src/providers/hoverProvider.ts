import * as vscode from "vscode";
import { DOCS } from "../data/hoverData";
import { getWordAtPosition } from "../utils/tokenUtils";

function buildHover(word: string, entry: typeof DOCS[string]): vscode.Hover {
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

export function register(context: vscode.ExtensionContext): void {
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
}
