import { ArticleQueryDto } from './dto';
import { Article } from './types';

const articleHasPropValueFact =
  (key: string, alias?: string) =>
  (article: Article, query: ArticleQueryDto) => {
    const value = query[key];

    if (value === undefined) {
      return true;
    }

    if (Array.isArray(article[alias ?? key])) {
      return article[alias ?? key].indexOf(value) !== -1;
    }

    return article[alias ?? key] === value;
  };

export const hasStatus = articleHasPropValueFact('status');
export const hasCategoryId = articleHasPropValueFact('categoryId');
export const hasTag = articleHasPropValueFact('tag', 'tags');
