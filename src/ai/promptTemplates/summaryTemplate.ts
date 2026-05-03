export function generateSummaryTemplate(maxLength: string, content: string) {
  return `Summarize the following article in a ${maxLength} way\n\n:"${content}"\n\nSummary:`;
}
