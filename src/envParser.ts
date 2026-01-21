/**
 * Represents a parsed environment variable key-value pair
 */
export interface EnvVariable {
  key: string;
  value: string;
  lineIndex: number;
  prefix: string;      // whitespace before the key
  separator: string;   // the '=' with any surrounding whitespace
  displayValue: string; // masked or unmasked value
  isComment: boolean;
  isBlank: boolean;
  originalLine: string;
}

/**
 * Parse a .env file content into structured rows
 * Preserves comments, blank lines, and whitespace
 */
export function parseEnv(content: string): EnvVariable[] {
  const lines = content.split('\n');
  const rows: EnvVariable[] = [];

  // Regex to match KEY=VALUE pattern, capturing whitespace
  const kvRegex = /^(\s*)([A-Za-z_][A-Za-z0-9_]*)(\s*=\s*)(.*)$/;

  lines.forEach((line, index) => {
    // Check if blank line
    if (line.trim() === '') {
      rows.push({
        key: '',
        value: '',
        lineIndex: index,
        prefix: '',
        separator: '',
        displayValue: '',
        isComment: false,
        isBlank: true,
        originalLine: line
      });
      return;
    }

    // Check if comment line
    if (line.trim().startsWith('#')) {
      rows.push({
        key: line,
        value: '',
        lineIndex: index,
        prefix: '',
        separator: '',
        displayValue: '',
        isComment: true,
        isBlank: false,
        originalLine: line
      });
      return;
    }

    // Try to parse as KEY=VALUE
    const match = kvRegex.exec(line);
    if (match) {
      const [, prefix, key, separator, value] = match;
      const displayValue = maskValue(value);

      rows.push({
        key,
        value,
        lineIndex: index,
        prefix,
        separator,
        displayValue,
        isComment: false,
        isBlank: false,
        originalLine: line
      });
    } else {
      // Unparseable line, treat as comment
      rows.push({
        key: line,
        value: '',
        lineIndex: index,
        prefix: '',
        separator: '',
        displayValue: '',
        isComment: true,
        isBlank: false,
        originalLine: line
      });
    }
  });

  return rows;
}

/**
 * Mask a value based on length threshold
 * If length < 6, return raw value
 * If length >= 6, return exactly "******"
 */
export function maskValue(value: string): string {
  return value.length < 6 ? value : '******';
}

/**
 * Reconstruct a line from parsed components
 */
export function reconstructLine(row: EnvVariable): string {
  if (row.isBlank || row.isComment) {
    return row.originalLine;
  }
  return `${row.prefix}${row.key}${row.separator}${row.value}`;
}

/**
 * Check for duplicate keys in parsed rows
 */
export function findDuplicateKeys(rows: EnvVariable[]): Set<string> {
  const keyCounts = new Map<string, number>();
  const duplicates = new Set<string>();

  rows.forEach(row => {
    if (!row.isBlank && !row.isComment && row.key) {
      const count = keyCounts.get(row.key) || 0;
      keyCounts.set(row.key, count + 1);
      if (count > 0) {
        duplicates.add(row.key);
      }
    }
  });

  return duplicates;
}
