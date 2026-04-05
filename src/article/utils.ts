import { ArticleQueryDto } from './dto';
import { Article } from './types';

const articleHasPropValueFact =
  (key: string) => (article: Article, query: ArticleQueryDto) => {
    if (query[key] === undefined) {
      return true;
    }

    return query[key] === article[key];
  };

export const hasStatus = articleHasPropValueFact('status');
export const hasCategoryId = articleHasPropValueFact('categoryId');
export const hasTag = articleHasPropValueFact('tag');
