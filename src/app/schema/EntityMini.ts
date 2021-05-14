import {Location} from './Location';
import {GlobalInfo} from './GlobalInfo';
import {AcceptedPayMode} from './AcceptedPayMode';

export interface EntityMini {
  id: string;
  global_info: GlobalInfo;
  location: Location;
  type: string;
  accepted_pay_modes: AcceptedPayMode[];
}
