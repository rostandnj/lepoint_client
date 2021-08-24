import { Component, OnInit, OnDestroy } from '@angular/core';
import { Config } from '../config';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute, NavigationEnd, NavigationStart, Router} from '@angular/router';
import {ConstantsService} from '../service/constants-service';
import {ApiService} from '../service/api-service';
import {AuthService} from '../service/auth-service';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  frStatus: boolean;
  enStatus: boolean;
  currentLang = '';
  currentLangSubscription: Subscription;
  isLogin = false;
  isLoginSubscription: Subscription;
  userType = null;
  currentLogo  = '';
  currentLogoSubscription: Subscription;

  constructor(private constantService: ConstantsService, private authService: AuthService,
              private router: Router, private activatedRoute: ActivatedRoute) {
    this.currentLangSubscription = this.constantService.currentLangSubject.subscribe((lang) => {
      this.currentLang = lang;
      this.frStatus = this.constantService.frStatus;
      this.enStatus = this.constantService.enStatus;

    }, (error) => {
      console.log(error);
    }, () => {

    });
    this.isLoginSubscription = this.authService.userIsLoginSubject.subscribe((status: boolean) => {
      this.isLogin = status;
      this.userType = this.authService.getUserType();
    }, (error) => {
      console.log(error);
    }, () => {

    });

    this.currentLogoSubscription = this.constantService.currentLogoSubject.subscribe((lo) => {
      this.currentLogo = lo;

    }, (error) => {
      console.log(error);
    }, () => {

    });
  }

  ngOnInit(): void {
    const da = this.router.url.split('/');
    if (this.router.url === '/cocan'){

    }else{
      if ( da.length === 4 && da[1] === 'restaurant' && da[3].length > 0 && da[2].length > 0){
        this.constantService.resetLogo();
      }
    }

    this.activatedRoute.url
      .subscribe(url => {
        if (url.toString() !== 'cocan'){
          const d = url.toString().split(',');
          if ( d.length !== 3){
            this.constantService.resetLogo();
          }
          else{
            if ( da[0] !== 'restaurant' || da[2].length !== 1){
              this.constantService.resetLogo();
            }
          }
        }

      });
    this.currentLang = this.constantService.currentLang;
    this.frStatus = this.constantService.frStatus;
    this.enStatus = this.constantService.enStatus;
    this.currentLogo = this.constantService.currentLogo;
    // this.isLogin = this.authService.isLogin;
    this.authService.isLoggedIn();
    if (this.isLogin){
      // 0=admin 10=owner 11=manager 20=client 1=top manager
      this.userType = this.authService.getUserType();
    }
  }

  onChangeLang(lang: string): void {

    this.constantService.changeLang(lang);
    this.frStatus = this.constantService.frStatus;
    this.enStatus = this.constantService.enStatus;
  }

  ngOnDestroy(): void {
    if (this.currentLangSubscription) {this.currentLangSubscription.unsubscribe(); }
    if (this.isLoginSubscription) {this.isLoginSubscription.unsubscribe(); }
    if (this.currentLogoSubscription) {this.currentLogoSubscription.unsubscribe(); }
  }

  logout(){
    this.authService.logout();
  }


  getUserType(){
    return this.authService.getUserType();
  }

}
