import {Location} from './Location';

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  type: number;
  gender: number;
  picture: string;
  birthday: string;
  location: Location;
  image: string;
  is_active: boolean;
  is_close: boolean;
}
