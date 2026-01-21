import * as vscode from 'vscode';
import { EnvCustomEditorProvider } from './envCustomEditor';

export function activate(context: vscode.ExtensionContext) {
  // Register the custom editor provider
  const provider = new EnvCustomEditorProvider(context);

  const registration = vscode.window.registerCustomEditorProvider(
    EnvCustomEditorProvider.viewType,
    provider,
    {
      webviewOptions: {
        retainContextWhenHidden: true
      }
    }
  );

  context.subscriptions.push(registration);
}

export function deactivate() {}
