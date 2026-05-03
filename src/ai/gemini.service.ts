import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { MaxLength, Task } from './dto/types';
import {
  generateSummaryTemplate,
  generateTranslateTemplate,
  generateAnalyzeTemplate,
} from './promptTemplates';

@Injectable()
export class GeminiService {
  constructor(private readonly httpService: HttpService) {}

  baseUrl = `${process.env.GEMINI_API_BASE_URL}/${process.env.GEMINI_MODEL}:generateContent`;

  async generateWithGemini(text: string) {
    const headers = {
      'Content-Type': 'application/json',
      'X-goog-api-key': process.env.GEMINI_API_KEY,
    };

    const data = {
      contents: [
        {
          parts: [
            {
              text,
            },
          ],
        },
      ],
    };

    const responseStream = this.httpService.post(this.baseUrl, data, {
      headers,
    });

    const response = await firstValueFrom(responseStream);
    return response.data.candidates?.[0]?.content?.parts?.[0]?.text;
  }

  getMatchedText(match: RegExpMatchArray) {
    return match ? match[1].trim() : '';
  }

  summarizeContent(content: string, maxLength: MaxLength) {
    const prompt = generateSummaryTemplate(content, maxLength);
    return this.generateWithGemini(prompt);
  }

  async translateContent(
    content: string,
    targetLanguage: string,
    sourceLanguage?: string,
  ) {
    const [prompt, translationMatchFn, languageMatchFn] =
      generateTranslateTemplate(content, targetLanguage, sourceLanguage);
    const response = await this.generateWithGemini(prompt);

    const translationMatch = translationMatchFn(response);
    const languageMatch = languageMatchFn(response);

    return {
      translatedText: this.getMatchedText(translationMatch),
      detectedLanguage: this.getMatchedText(languageMatch),
    };
  }

  async analyzeContent(content: string, task: Task) {
    const [prompt, analysisMatchFn, suggestionMatchFn, severityMatchFn] =
      generateAnalyzeTemplate(
        content,
        task === Task.Bugs ? 'identify any bugs' : task,
      );

    const response = await this.generateWithGemini(prompt);

    const analysisMatch = analysisMatchFn(response);
    const suggestionMatch = suggestionMatchFn(response);
    const severityMatch = severityMatchFn(response);

    return {
      analysis: this.getMatchedText(analysisMatch),
      suggestions: this.getMatchedText(suggestionMatch)
        .split(',')
        .map((suggestion) => suggestion.trim())
        .filter((suggestion) => suggestion.length > 0),
      severity: this.getMatchedText(severityMatch),
    };
  }
}
