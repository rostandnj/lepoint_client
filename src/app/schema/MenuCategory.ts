import {BaseCategory} from './BaseCategory';

export interface MenuCategory {
  base_category: BaseCategory;
  id: string;
  is_active: boolean;
}
