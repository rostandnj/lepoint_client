import {Article} from './Article';
import {CommentArticle} from './CommentArticle';

export interface ArticleAndOneComment {
  article: Article;
  comment: CommentArticle;
}
