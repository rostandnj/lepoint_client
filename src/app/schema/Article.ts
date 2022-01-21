import {Image} from './Image';
import {User} from './User';

export interface Article {
  title: string;
  slug: string;
  id: string;
  content: string;
  image_cover: string;
  date: string;
  status: boolean;
  is_active: boolean;
  nb_view: bigint;
  rate: bigint;
  nb_comment: bigint;
  type: number;
  links: any;
  user: User;
}
