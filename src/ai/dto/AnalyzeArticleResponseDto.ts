import { Severity } from './types';

export class AnalyzeArticleResponseDto {
  articleId: string;
  analysis: string;
  suggestions: string[];
  severity: Severity;
}
