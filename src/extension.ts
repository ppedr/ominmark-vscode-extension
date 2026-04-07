import * as vscode from "vscode";
import { register as registerHover }      from "./providers/hoverProvider";
import { register as registerDefinition } from "./providers/definitionProvider";
import { register as registerCompletion } from "./providers/completionProvider";

const LANG_KEY = "[omnimark]";
const ENCODING  = "windows1252";

async function ensureEncoding(): Promise<void> {
  const config  = vscode.workspace.getConfiguration();
  const inspect = config.inspect<Record<string, unknown>>(LANG_KEY);
  const current = (inspect?.globalValue ?? {}) as Record<string, unknown>;

  if (current["files.encoding"] === ENCODING) {
    return;
  }

  await config.update(
    LANG_KEY,
    { ...current, "files.encoding": ENCODING },
    vscode.ConfigurationTarget.Global
  );

  const openDocs = vscode.workspace.textDocuments.filter(
    (d) => d.languageId === "omnimark"
  );

  if (openDocs.length > 0) {
    const action = await vscode.window.showInformationMessage(
      "OmniMark: encoding set to Windows-1252. Reload the window to re-read open files with the correct encoding.",
      "Reload Window"
    );
    if (action === "Reload Window") {
      await vscode.commands.executeCommand("workbench.action.reloadWindow");
    }
  }
}

export function activate(context: vscode.ExtensionContext): void {
  registerHover(context);
  registerDefinition(context);
  registerCompletion(context);
  ensureEncoding();
}

export function deactivate(): void {}
