export function generatePromtTemplate(
  content: string,
  targetLanguage: string,
  sourceLanguage?: string,
) {
  const sourceLanguagePrompt = sourceLanguage ? ` from ${sourceLanguage}` : '';
  return `Translate the following article${sourceLanguagePrompt} into ${targetLanguage}:\n\n"${content}"`;
}
