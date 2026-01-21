# Dotenv Mask Editor for VS Code and Cursor

**Securely view and edit your `.env` files with automatic secret masking.**

**Dotenv Mask Editor** is a lightweight, secure VS Code extension that transforms your plain text `.env` files into a clean, interactive table editor. It automatically masks long secret values to prevent shoulder surfing and reduce visual noise during screen sharing or demos.

![Dotenv Mask Editor Screenshot](images/screenshot.png) *(Add a screenshot here later)*

## 🚀 Key Features

- **🛡️ Smart Masking**: Automatically hides sensitive values (API keys, passwords, tokens) with `******`.
- **👁️ Click-to-Reveal**: Simply click any masked value to reveal and edit it instantly.
- **✏️ Full Editing**: Edit both Keys and Values directly in the grid.
- **🔒 Secure by Design**: Zero dependencies, no external requests. Your secrets never leave your local machine.
- **⚡ Zero-Config**: Automatically works with `.env`, `.env.local`, `.env.production`, and `*.env` files.
- **📋 Copy Friendly**: Quick copy-paste workflow for managing configuration.

## 🎯 Why Use Dotenv Mask Editor?

- **Privacy**: Stop accidentally exposing API keys during live streams, screen shares, or pair programming sessions.
- **Clarity**: Clean up clutter in large configuration files by hiding long, distracting strings.
- **Safety**: Prevent accidental modification of keys while browsing configurations.

## 🛠️ Usage

1.  Open any `.env` file (e.g., `.env`, `test.env`, `.env.local`).
2.  The file automatically opens in the **Dotenv Mask Editor** view.
3.  **Click** on a masked value (`******`) to reveal and edit it.
4.  **Blur** (click away) to save changes and re-mask immediately.

*(If a file opens as text, right-click the tab → "Reopen Editor With..." → "Dotenv Mask Editor")*

## ⚙️ Configuration

The extension works out of the box for standard env files. You can add custom file patterns in your settings:

```json
{
  "envSecretMasking.filePatterns": [
    "*.config",
    "secrets.properties"
  ]
}
```

## 📦 Installation

Search for **"Dotenv Mask Editor"** in the VS Code Marketplace and click Install.

## 🤝 Contributing

Found a bug or have a feature request? Issues and Pull Requests are welcome!

## 📄 License

MIT
