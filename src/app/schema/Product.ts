import {EntityMini} from './EntityMini';

export interface Product {
  name: string;
  id: string;
  description: string;
  image: string;
  is_active: boolean;
  is_available: boolean;
  slug: string;
  entity: EntityMini;
  price: number;
}
