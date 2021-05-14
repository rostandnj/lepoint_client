import {PayMode} from './PayMode';

export interface AcceptedPayMode {
  pay_mode: PayMode;
  id: string;
  detail_one: string;
  detail_two: string;
}
