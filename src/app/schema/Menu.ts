import {MenuCategory} from './MenuCategory';
import {EntityMini} from './EntityMini';

export interface Menu {
  name: string;
  id: string;
  image: string;
  description: string;
  price: number;
  is_day_menu: boolean;
  nb_order: bigint;
  estimate_min_time: string;
  estimate_max_time: string;
  menu_categories: MenuCategory[];
  is_active: boolean;
  is_promoted: boolean;
  is_available: boolean;
  entity: EntityMini;
}
