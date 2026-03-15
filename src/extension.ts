import * as vscode from "vscode";
import { register as registerHover }      from "./providers/hoverProvider";
import { register as registerDefinition } from "./providers/definitionProvider";
import { register as registerCompletion } from "./providers/completionProvider";

export function activate(context: vscode.ExtensionContext): void {
  registerHover(context);
  registerDefinition(context);
  registerCompletion(context);
}

export function deactivate(): void {}
