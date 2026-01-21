# Usage Guide - Env Secret Masking Extension

## Quick Start

1. **Open the extension in VS Code**
   ```bash
   code /Users/zzn/ws/@xinbenlv/env-secret-masking
   ```

2. **Launch Extension Development Host**
   - Press `F5` in VS Code, or
   - Go to Run > Start Debugging
   - This will open a new VS Code window with the extension loaded

3. **Test the extension**
   - In the Extension Development Host window, open the `test.env` file
   - Right-click in the editor and select: **"Reopen Editor With..."**
   - Choose: **"Env Secret Masking Editor"**

## How It Works

### Masking Rules
- **Short values** (length < 6): Displayed as-is (e.g., `true`, `3000`, `prod`)
- **Long values** (length >= 6): Masked as exactly `******`

### Features

1. **View Mode**: All long secrets are masked for reduced visual clutter
2. **Edit Mode**: Click "Edit" button to modify values
   - Password input field with toggle visibility (👁 button)
   - Save or Cancel your changes
   - Changes write directly back to the file

3. **Duplicate Detection**: Keys that appear multiple times show a warning

4. **Preserved Formatting**:
   - Comments (lines starting with `#`)
   - Blank lines
   - Whitespace around `=` signs

## Configuration

Add additional file patterns to match in your VS Code settings:

```json
{
  "envSecretMasking.filePatterns": ["*.env.local", "secrets.conf"]
}
```

## Example

Given this `.env` file:
```
DB_HOST=localhost
DB_PASSWORD=super_secret_password_12345
DEBUG=true
```

The custom editor displays:
- `DB_HOST` = `******` (masked, length >= 6)
- `DB_PASSWORD` = `******` (masked, length >= 6)
- `DEBUG` = `true` (shown, length < 6)

## File Matching

By default, the extension activates for:
- Files named exactly `.env`
- Files matching `.env.*` (e.g., `.env.local`, `.env.production`)

## Development Commands

```bash
# Compile TypeScript
npm run compile

# Watch mode (auto-compile on save)
npm run watch
```

## Debugging

- The extension logs are visible in the Debug Console of the main VS Code window
- Webview console logs appear in the Extension Development Host
- Use `Developer: Open Webview Developer Tools` command to inspect the webview
