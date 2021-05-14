import {Component, OnInit, TemplateRef} from '@angular/core';
import {Subscription} from 'rxjs';
import {Order} from '../schema/Order';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ConstantsService} from '../service/constants-service';
import {AuthService} from '../service/auth-service';
import {HttpClient} from '@angular/common/http';
import {FormBuilder} from '@angular/forms';
import {ApiService} from '../service/api-service';
import {TranslateService} from '@ngx-translate/core';
import {UserService} from '../service/user-service';
import {Config} from '../config';
import {Status} from '../schema/Status';
import {User} from '../schema/User';
import {EntityService} from '../service/entity-service';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.css']
})
export class UserNotificationsComponent implements OnInit {

  globalAlertStatusSubscription: Subscription;
  globalAlertStatus = '';
  isLoginSubscription: Subscription;
  currentLangSubscription: Subscription;
  loading = false;
  isLogin: boolean;
  userType = null;
  notificationsSubscription: Subscription;
  notifications: Status[];
  userSubscription: Subscription;
  user: User;
  username = '';
  userId = '';


  constructor(private constantService: ConstantsService, private entityService: EntityService,
              private authService: AuthService, private httpClient: HttpClient,  private fb: FormBuilder,
              private modalService: BsModalService, private apiService: ApiService,
              private translateService: TranslateService, private userService: UserService) {
    this.userSubscription = this.authService.userSubject.subscribe((user: User) => {
      this.user = user;
      if (user !== null){
        this.username = user.name.replace(' ', '_');
        this.userId = user.id.toString();
      }

    }, (error) => {
      console.log(error);
    }, () => {

    });
    this.globalAlertStatusSubscription = this.constantService.globalAlertStatusSubject.subscribe((res) => {
      this.globalAlertStatus = res;

    }, (error) => {
      console.log(error);
    }, () => {

    });

    this.isLoginSubscription = this.authService.userIsLoginSubject.subscribe((status: boolean) => {
      this.isLogin = status;
      if (this.isLogin){
        this.userType = localStorage.getItem('userType');
      }

    }, (error) => {
      console.log(error);
    }, () => {

    });

    if (this.authService.getLoginStatus()){
      this.notificationsSubscription = this.authService.notificationsSubject.subscribe((status: Status[]) => {
        if (this.user !== null){
          this.notifications = status;
          status.forEach((el) => {
            if (el.status === false){
              el.status = true;
            }
          });
        }

      }, (error) => {
        console.log(error);
      }, () => {

      });

    }
  }

  ngOnInit(){
    if (this.authService.getLoginStatus()){
      this.authService.userMarkNotifications();
    }
  }

}
