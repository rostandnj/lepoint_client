import {Injectable} from '@angular/core';
import {ApiService} from './api-service';
import {Config} from '../config';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import {LoginResponse} from '../schema/LoginResponse';
import * as moment from 'moment';
import {User} from '../schema/User';
import {Subject} from 'rxjs';
import {EntityService} from './entity-service';
import {Status} from '../schema/Status';

@Injectable()
export class AuthService {

  isLogin: boolean;
  user: User;
  userSubject = new Subject<User>();
  tokenSubject = new Subject<string>();
  userIsLoginSubject = new Subject<boolean>();
  notifications: Status[];
  notificationsSubject = new Subject <Status[]>();

  emitUser() {
    this.userSubject.next(this.user);
  }

  emitNotifications() {
    this.notificationsSubject.next(this.notifications);
  }

  emitIsLogin() {
    this.userIsLoginSubject.next(this.isLogin);
  }

  constructor(private apiService: ApiService, private entityService: EntityService) {
    this.getUserStatus();
  }

  login(email: string, pass: string ) {
    return this.apiService.post(Config.login, {login: email, password: pass});
  }

  signUp(val ) {
    return this.apiService.post(Config.signup, val);
  }

  resetPassword(val) {
    return this.apiService.post(Config.reset, val);
  }

  setSession(authResult: LoginResponse) {
    const decoded = jwtDecode<JwtPayload>(authResult.token);
    // const expiresAt = moment().add(decoded.exp, 'second');

    localStorage.setItem('token', authResult.token);
    localStorage.setItem('userType', authResult.usertype);
    localStorage.setItem('expires_at', String(decoded.exp) );
    this.user = authResult.user;
    this.isLogin = decoded.exp > moment().unix();
    if (this.isLogin){
      this.getUserNotifications();
      this.emitUser();
    }
    this.emitIsLogin();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('has_restaurant');
    localStorage.removeItem('cart');
    this.entityService.clearCart();
    this.isLogin = false;
    this.user = null;
    this.emitIsLogin();
    this.emitUser();
  }

  isLoggedIn() {
   this.isLogin = this.getExpiration() > moment().unix();
   if (this.isLogin){
      this.apiService.post(Config.userDetail, {}).subscribe((resUser: User) => {
        this.user = resUser;
        this.emitIsLogin();
        this.emitUser();

      }, (error => {
        return error;
      }));

    }else{
      this.emitIsLogin();
      this.emitUser();
    }
  }

  getLoginStatus(){
    return this.getExpiration() > moment().unix();
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    if (expiration !== null){
      return parseInt(expiration, 10);
    }
    else{
      return  0;
    }

  }

  getUserStatus(){
    this.isLogin = false;
    this.user = null;
    if (this.isLogin){
      this.apiService.post(Config.userDetail, {}).subscribe((resUser: User) => {
        this.user = resUser;
        this.emitIsLogin();
        this.emitUser();

      }, (error => {
        return error;
      }));

    }else{
      this.emitIsLogin();
      this.emitUser();
    }
  }

  activateAccount(token: string){
    return this.apiService.get(Config.activateAccount + token);
  }

  getUserType(){
    if (this.getExpiration() > moment().unix()){
      return localStorage.getItem('userType');
    }
    else{
      return null;
    }

  }

  public updateUser(user){
    this.user = user;
    this.emitUser();
  }

  getUserNotifications(){
    this.notifications = [];
    this.apiService.post(Config.userNotifications, {}).subscribe((res: Status[]) => {
      this.notifications = res;
      this.emitNotifications();

    }, (error) => {
      console.log(error.message);

    }, () => {

    });
  }

  userMarkNotifications(){
    this.apiService.post(Config.userMarkNotifications, {}).subscribe((res) => {

    }, (error) => {
      console.log(error);

    });
  }

  getUserLastNotifications(data){
    this.apiService.post(Config.userNotificationsLast, data).subscribe((res: Status[]) => {
      if (this.notifications !== undefined){
        res.forEach((el) => {
          this.notifications.push(el);
        });

      }
      this.emitNotifications();

    }, (error) => {
      console.log(error);

    });
  }


}
