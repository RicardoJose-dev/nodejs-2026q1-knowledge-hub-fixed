export function analyzeTemplate(content: string, task: string) {
  return `Please ${task} the following article:\n\n"${content}"`;
}
