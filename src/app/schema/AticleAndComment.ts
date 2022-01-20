import {Article} from './Article';
import {CommentArticle} from './CommentArticle';

export interface ArticleAndComment {
  article: Article;
  comments: CommentArticle[];
}
