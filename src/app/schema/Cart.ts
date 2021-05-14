import {CartItem} from './CartItem';

export interface Cart {
  items: CartItem[];
  totalPrice: number;
  location: string;
  contact: string;
}
