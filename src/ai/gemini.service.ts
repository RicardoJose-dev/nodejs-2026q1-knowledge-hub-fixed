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

  baseUrl = `${process.env.GEMINI_API_BASE_URL}/v1beta/models/${process.env.GEMINI_MODEL}:generateContent`;

  generateWithGemini(text: string) {
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

    const response = this.httpService.post(this.baseUrl, data, { headers });
    return firstValueFrom(response);
  }

  summarizeContent(content: string, maxLength: MaxLength) {
    const prompt = generateSummaryTemplate(content, maxLength);
    return this.generateWithGemini(prompt);
  }

  translateContent(
    content: string,
    targetLanguage: string,
    sourceLanguage?: string,
  ) {
    const prompt = generateTranslateTemplate(
      content,
      targetLanguage,
      sourceLanguage,
    );
    return this.generateWithGemini(prompt);
  }

  analyzeContent(content: string, task: Task) {
    const prompt = generateAnalyzeTemplate(
      content,
      task === Task.Bugs ? 'identify any bugs' : task,
    );

    return this.generateWithGemini(prompt);
  }
}
