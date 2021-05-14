import {Menu} from './Menu';

export interface OrderItem {
  id: string;
  menu: Menu;
  quantity: number;
  amount: number;
  is_active: boolean;
  date: string;
}
