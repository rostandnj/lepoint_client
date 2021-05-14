import {Location} from './Location';
import {User} from './User';
import {PayMode} from './PayMode';
import {OrderItem} from './OrderItem';
import {EntityMini} from './EntityMini';

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  location: Location;
  place: string;
  status: number;
  amount: number;
  pay_mode: PayMode;
  client: User;
  order_items: OrderItem[];
  entity: EntityMini;
  image: string;
  date: string;
  reference: string;
}
