import * as vscode from "vscode";

export function item(
  label: string,
  kind: vscode.CompletionItemKind,
  detail: string,
  documentation: string,
  insertText: string,
  isSnippet = false
): vscode.CompletionItem {
  const c = new vscode.CompletionItem(label, kind);
  c.detail = detail;
  c.documentation = new vscode.MarkdownString(documentation);
  c.insertText = isSnippet
    ? new vscode.SnippetString(insertText)
    : (insertText || label);
  return c;
}
