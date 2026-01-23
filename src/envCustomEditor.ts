import * as vscode from 'vscode';
import * as path from 'path';
import { parseEnv, EnvVariable, reconstructLine, findDuplicateKeys } from './envParser';

/**
 * Custom Text Editor Provider for .env files
 */
export class EnvCustomEditorProvider implements vscode.CustomTextEditorProvider {
  public static readonly viewType = 'envSecretMasking.envEditor';

  constructor(private readonly context: vscode.ExtensionContext) {}

  /**
   * Called when our custom editor is opened
   */
  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    // Setup initial webview
    webviewPanel.webview.options = {
      enableScripts: true
    };
    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

    // Function to update webview content
    function updateWebview() {
      const rows = parseEnv(document.getText());
      const duplicateKeys = findDuplicateKeys(rows);

      webviewPanel.webview.postMessage({
        type: 'renderRows',
        rows: rows.map(row => ({
          ...row,
          isDuplicate: duplicateKeys.has(row.key)
        }))
      });
    }

    // Initial render
    updateWebview();

    // Listen for changes to the document
    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
      if (e.document.uri.toString() === document.uri.toString()) {
        updateWebview();
      }
    });

    // Listen for messages from the webview
    webviewPanel.webview.onDidReceiveMessage(
      async message => {
        switch (message.type) {
          case 'updateEntry':
            await this.updateEntry(document, message.lineIndex, message.newKey, message.newValue);
            return;
          case 'updateComment':
            await this.updateCommentLine(document, message.lineIndex, message.newLineText);
            return;
        }
      }
    );

    // Clean up subscriptions when panel is closed
    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
    });
  }

  /**
   * Update a specific environment variable line in the document
   */
  private async updateEntry(
    document: vscode.TextDocument,
    lineIndex: number,
    newKey: string,
    newValue: string
  ): Promise<void> {
    const edit = new vscode.WorkspaceEdit();

    // Parse current document to get the exact line info
    const rows = parseEnv(document.getText());
    const targetRow = rows.find(row => row.lineIndex === lineIndex);

    if (!targetRow) {
      // If row not found by index, maybe file changed significantly?
      // We can try to recover or just fail.
      return;
    }

    // Reconstruct the line with the new key/value
    // We preserve the prefix/separator if possible, or default if it was a blank/comment line turning into a var
    const updatedRow = { ...targetRow, key: newKey, value: newValue };

    // If it was a comment or blank, we might need to establish defaults if they are empty
    if (!updatedRow.separator) updatedRow.separator = '=';

    const newLine = reconstructLine(updatedRow);

    // Get the line range
    const line = document.lineAt(lineIndex);
    const range = new vscode.Range(
      lineIndex,
      0,
      lineIndex,
      line.text.length
    );

    // Apply the edit
    edit.replace(document.uri, range, newLine);
    await vscode.workspace.applyEdit(edit);
  }

  /**
   * Update a comment line in the document
   */
  private async updateCommentLine(
    document: vscode.TextDocument,
    lineIndex: number,
    newLineText: string
  ): Promise<void> {
    // Bounds check
    if (lineIndex < 0 || lineIndex >= document.lineCount) {
      return;
    }

    const edit = new vscode.WorkspaceEdit();

    // Get the line range
    const line = document.lineAt(lineIndex);
    const range = new vscode.Range(
      lineIndex,
      0,
      lineIndex,
      line.text.length
    );

    // Apply the edit
    edit.replace(document.uri, range, newLineText);
    await vscode.workspace.applyEdit(edit);
  }

  /**
   * Generate the HTML for the webview
   */
  private getHtmlForWebview(webview: vscode.Webview): string {
    // Get URIs for resources
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'media', 'webview.js')
    );

    // Use a nonce to whitelist which scripts can be run
    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Env Editor</title>
  <style>
    body {
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      color: var(--vscode-foreground);
      background-color: var(--vscode-editor-background);
      padding: 0;
      margin: 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed; /* Fixed layout for consistent columns */
    }

    th {
      text-align: left;
      padding: 4px 8px;
      border-bottom: 1px solid var(--vscode-panel-border);
      font-weight: normal;
      color: var(--vscode-descriptionForeground);
      font-size: 0.9em;
    }

    td {
      padding: 0;
      border-bottom: 1px solid var(--vscode-panel-border);
      vertical-align: middle;
      height: 24px;
    }

    .key-column {
      font-family: var(--vscode-editor-font-family);
      width: 30%;
      border-right: 1px solid var(--vscode-panel-border);
    }

    .value-column {
      font-family: var(--vscode-editor-font-family);
      width: 70%;
    }

    .comment-row td {
      padding: 4px 8px;
      color: var(--vscode-descriptionForeground);
      font-style: italic;
    }

    .blank-row {
      height: 10px;
    }

    /* Input styling */
    input {
      font-family: var(--vscode-editor-font-family);
      background-color: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border: 1px solid var(--vscode-input-border);
      padding: 4px 8px;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      outline: none;
    }

    input:focus {
      border-color: var(--vscode-focusBorder);
    }

    /* Cell display styling */
    .cell-content {
      padding: 4px 8px;
      cursor: text;
      min-height: 24px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .cell-content:hover {
      background-color: var(--vscode-list-hoverBackground);
    }

    .masked {
      color: var(--vscode-descriptionForeground);
    }

    .duplicate-warning {
      color: var(--vscode-errorForeground);
      font-size: 11px;
      float: right;
    }
  </style>
</head>
<body>
  <table id="envTable">
    <thead>
      <tr>
        <th class="key-column">KEY</th>
        <th class="value-column">VALUE</th>
      </tr>
    </thead>
    <tbody id="envTableBody">
      <!-- Rows will be inserted here by JavaScript -->
    </tbody>
  </table>

  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
