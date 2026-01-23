# Dotenv Mask Editor

A visual editor for environment files with automatic secret masking.

Dotenv Mask Editor provides a table-based interface for `.env` files. It is designed to reduce the accidental exposure of sensitive values by masking strings that meet a length threshold. All processing is done locally within your editor.

![2026-01-22_20-01-13 (1)](https://github.com/user-attachments/assets/12a9d23e-a4f3-495a-be9f-a89d3e91f56f)

## Features

- Custom Editor: Provides a grid view for `.env`, `.env.*`, and `*.env` files.
- Masking: Values with 6 or more characters are replaced with `******` in the display.
- Editing: Supports direct modification of both keys and values.
- Privacy: Masked values are only revealed during active editing.
- Local execution: The extension has no external dependencies and does not make network requests.

## Usage

1. Open a `.env` file. The extension should associate automatically.
2. Click a cell to edit its content. Masked values will reveal their raw text while the cell is focused.
3. Move focus away from the cell to save changes and re-apply masking.

If the file opens in the standard text editor, right-click the file tab and select "Reopen Editor With..." followed by "Dotenv Mask Editor".

## Configuration

Custom file patterns can be added via VS Code settings:

```json
{
  "envSecretMasking.filePatterns": [
    "*.config"
  ]
}
```

## Installation

Available through the VS Code Marketplace. Search for "Dotenv Mask Editor".

## License

MIT
