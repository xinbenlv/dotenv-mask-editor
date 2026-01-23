# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-01-22

### Added

- Support for editing comment lines in `.env` files
  - Click on any comment row (lines starting with `#`) to edit in-place
  - Press Enter or click away to save, Escape to cancel
  - Also works for unparseable lines treated as comments

## [1.0.3] - 2026-01-21

### Fixed

- Minor bug fixes and stability improvements

## [1.0.2] - 2026-01-21

### Changed

- Updated release script for local installation

## [1.0.1] - 2026-01-21

### Changed

- Initial stable release with secret masking functionality

## [1.0.0] - 2026-01-21

### Added

- Custom visual editor for `.env` files
- Automatic masking of sensitive values (6+ characters shown as `******`)
- Click-to-edit functionality for keys and values
- Duplicate key detection with warning indicator
- Support for `.env`, `.env.*`, and `*.env` file patterns
- Preserves comments, blank lines, and whitespace formatting
