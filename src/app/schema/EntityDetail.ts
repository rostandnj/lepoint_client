import {MenuCategory} from './MenuCategory';
import {Menu} from './Menu';
import {BaseCategory} from './BaseCategory';
import {Entity} from './Entity';
import {Advert} from './Advert';
import {Image} from './Image';
import {Product} from './Product';

export interface EntityDetail {
  entity: Entity;
  categories: MenuCategory[];
  menus: Menu[];
  base_categories: BaseCategory[];
  adverts: Advert[];
  images: Image[];
  products: Product[];
}
