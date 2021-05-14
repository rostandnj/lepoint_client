import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CookieService} from 'ngx-cookie-service';
import { Config } from '../config';
import {Subject, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {User} from '../schema/User';
import {ApiService} from './api-service';
import {Image} from '../schema/Image';
import {Menu} from '../schema/Menu';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy{

  constructor(private translateService: TranslateService, private cookieService: CookieService, private router: Router,
              private apiService: ApiService) {
  }


  ngOnDestroy() {
  }

  updatePassword(data){
    return this.apiService.post(Config.profileUpdate + 'password', data);
  }

  uploadPicture(formData){
    return this.apiService.postFile(Config.uploadImage, formData);
  }

  updatePicture(data){
    return this.apiService.post(Config.profileUpdate + 'picture', data);
  }

  updateInfo(data){
    return this.apiService.post(Config.profileUpdate + 'phone_birthday', data);
  }

}
