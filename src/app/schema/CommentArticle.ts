import {User} from './User';

export interface CommentArticle {
  id: string;
  message: string;
  nb_like: number;
  nb_dislike: number;
  user: User;
  date: string;
}
