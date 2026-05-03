export function generateAnalyzeTemplate(
  content: string,
  task: string,
): [
  string,
  (response: string) => RegExpMatchArray | null,
  (response: string) => RegExpMatchArray | null,
  (response: string) => RegExpMatchArray | null,
] {
  const prompt = `
    Please ${task} the following article:
    \n\n
    "${content}"
    Respond in this format:\n\n
    Text Analysis: <your analysis>\n\n
    Suggestions: <your suggestions> (should be a comma separated list of suggetions) \n\n
    Severity: <your severity level> (Should be one of 'info', 'warning' or 'error')
  `;

  return [
    prompt,
    (response: string) => response.match(/Text Analysis:\s*(.+)/i),
    (response: string) => response.match(/Suggestions:\s*(.+)/i),
    (response: string) => response.match(/Severity:\s*(.+)/i),
  ];
}
