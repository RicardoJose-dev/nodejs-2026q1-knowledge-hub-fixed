export function generateTranslateTemplate(
  content: string,
  targetLanguage: string,
  sourceLanguage?: string,
): [
  string,
  (response: string) => RegExpMatchArray | null,
  (response: string) => RegExpMatchArray | null,
] {
  const sourceLanguagePrompt = sourceLanguage ? ` from ${sourceLanguage}` : '';

  const prompt = `
    Translate the following article${sourceLanguagePrompt} into ${targetLanguage}:
    \n\n
    "${content}"
    \n\n
    Respond in this format:\n
    Translated Text: <your translation>\n
    Detected Language: <detected language>
  `;

  return [
    prompt,
    (response: string) => response.match(/Translated Text:\s*(.+)/i),
    (response: string) => response.match(/Detected Language:\s*(.+)/i),
  ];
}
