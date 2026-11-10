/**
 * Header Injection & XSS Sanitization Utilities (`src/lib/security/sanitize.ts`)
 *
 * Security Rules:
 * 1. Strip `\r` (CR), `\n` (LF), and null bytes from any string interpolated into
 *    email subjects or headers to prevent SMTP header injection.
 * 2. HTML-escape (`&`, `<`, `>`, `"`, `'`) all user-supplied values before
 *    interpolating into HTML email templates or structured views.
 */

const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};

/**
 * Strips carriage returns (`\r`), line feeds (`\n`), and null bytes (`\0`),
 * collapsing consecutive whitespace into a single space.
 */
export function stripHeaderInjection(input: string): string {
  return input
    .replace(/[\r\n\0]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * Escapes HTML special characters (`&`, `<`, `>`, `"`, `'`) to prevent XSS
 * in HTML emails or rendered notifications.
 */
export function escapeHtml(input: string): string {
  return input.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char] ?? char);
}

/**
 * Sanitizes single-line user text by stripping control characters and normalizing whitespace.
 */
export function sanitizePlainText(input: string): string {
  return input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}
