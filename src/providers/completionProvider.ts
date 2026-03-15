import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { KEYWORD_COMPLETIONS, STREAM_COMPLETIONS, SNIPPET_COMPLETIONS } from "../data/completionData";
import { isInStringOrComment } from "../utils/tokenUtils";
import { collectSearchFiles } from "../utils/fileUtils";
import { DEFINE_RE } from "./definitionProvider";

function getUserFunctionCompletions(document: vscode.TextDocument): vscode.CompletionItem[] {
  const files = collectSearchFiles(document);
  const results: vscode.CompletionItem[] = [];
  const seen = new Set<string>();

  for (const filePath of files) {
    let text: string;
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
      c.insertText = new vscode.SnippetString(`${name}($1)`);
      results.push(c);
    }
  }
  return results;
}

export function register(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { language: "omnimark" },
      {
        provideCompletionItems(document, position) {
          if (isInStringOrComment(document, position)) return [];

          const line = document.lineAt(position).text;
          const prefix = line.slice(0, position.character);

          if (/#[a-zA-Z-]*$/.test(prefix)) {
            return STREAM_COMPLETIONS;
          }

          return [
            ...KEYWORD_COMPLETIONS,
            ...SNIPPET_COMPLETIONS,
            ...getUserFunctionCompletions(document),
          ];
        },
      },
      "#", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
      "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
      "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
      "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
    )
  );
}
