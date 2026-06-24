export function stripHtml(html: string) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/&nbsp;/g, ' ')   // Decode non-breaking spaces
    .replace(/&amp;/g, '&')    // Decode ampersands
    .replace(/&lt;/g, '<')     // Decode less than
    .replace(/&gt;/g, '>')     // Decode greater than
    .replace(/&quot;/g, '"')   // Decode double quotes
    .replace(/&#39;/g, "'");   // Decode single quotes
}
