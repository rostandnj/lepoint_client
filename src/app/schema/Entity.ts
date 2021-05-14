import {GlobalInfo} from './GlobalInfo';
import {Location} from './Location';
import {User} from './User';
import {EntityActivation} from './EntityActivation';
import {AcceptedPayMode} from './AcceptedPayMode';

export interface Entity {
  id: string;
  global_info: GlobalInfo;
  location: Location;
  owner: User;
  top_manager: User;
  entity_activation: EntityActivation;
  type: string;
  order_system: string;
  order_entity: string;
  can_order: boolean;
  flash_message: string;
  note: string;
  is_active: boolean;
  status: boolean;
  is_lock: boolean;
  is_promoted: boolean;
  link: string;
  accepted_pay_modes: AcceptedPayMode[];
}
