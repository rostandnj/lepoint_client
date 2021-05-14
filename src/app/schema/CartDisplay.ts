
import {CartItem} from './CartItem';
import {EntityMini} from './EntityMini';

export interface CartDisplay {
  entity: EntityMini;
  cartItem: CartItem[];
  totalPrice: number;
}
