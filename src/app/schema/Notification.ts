import {Order} from './Order';
import {User} from './User';

export interface Notification {
  code: number;
  id: string;
  order_main: Order;
  user: User;
  date: string;
  customer_name: string;
  customer_phone: string;
}
