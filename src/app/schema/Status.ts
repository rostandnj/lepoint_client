import {Notification} from './Notification';

export interface Status {
  name: string;
  id: string;
  notification: Notification;
  status: boolean;
  date: string;
}
