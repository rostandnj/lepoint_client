import {User} from './User';

export interface LoginResponse {
  token: string;
  usertype: string;
  user: User;
}
