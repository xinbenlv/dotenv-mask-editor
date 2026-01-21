# Env Secret Masking VS Code Extension

A minimalistic VS Code extension that provides a custom editor for `.env` files to reduce visual noise from long secret values.

## Features

- **Custom Editor** for `.env` and `.env.*` files
- **Smart Masking**: Values with length < 6 are shown in plain text, values with length >= 6 are masked as `******`
- **Editable**: Edit values directly in the table view, changes are written back to the file
- **Configurable**: Add additional file patterns to match via settings

## Usage

1. Open any `.env` or `.env.*` file
2. Right-click and select "Reopen Editor With..." → "Env Secret Masking Editor"
3. View and edit your environment variables in a clean table format
4. Long secrets are automatically masked as `******` for reduced visual clutter

## Configuration

Add additional file patterns in your VS Code settings:

```json
{
  "envSecretMasking.filePatterns": ["*.env.local", "env.config"]
}
```

## Development

```bash
npm install
npm run compile
```

Press `F5` in VS Code to launch the Extension Development Host.

## License

MIT
