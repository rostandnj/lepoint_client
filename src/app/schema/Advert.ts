import {Image} from './Image';

export interface Advert {
  title: string;
  slug: string;
  id: string;
  content: string;
  file: Image;
  date: string;
  status: boolean;
  is_active: boolean;
  entity: any;
}
