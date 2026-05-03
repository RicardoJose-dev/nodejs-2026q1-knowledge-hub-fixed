export function generateSummaryTemplate(content: string, maxLength: string) {
  return `Summarize the following article in a ${maxLength} way\n\n:"${content}"\n\nSummary:`;
}
