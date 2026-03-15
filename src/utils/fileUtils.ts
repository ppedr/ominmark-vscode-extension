import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export function collectOmniMarkFiles(dir: string, result: Set<string>, depth = 0): void {
  if (depth > 5) return;
  let entries: fs.Dirent[];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
  catch { return; }
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectOmniMarkFiles(full, result, depth + 1);
    else if (/\.(xom|xin|xmd)$/i.test(entry.name)) result.add(full);
  }
}

export function collectSearchFiles(document: vscode.TextDocument): string[] {
  const files = new Set<string>();
  files.add(document.uri.fsPath);
  const wf = vscode.workspace.getWorkspaceFolder(document.uri);
  if (wf) collectOmniMarkFiles(wf.uri.fsPath, files);
  else collectOmniMarkFiles(path.dirname(document.uri.fsPath), files);
  return [...files];
}
