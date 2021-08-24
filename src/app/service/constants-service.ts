import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CookieService} from 'ngx-cookie-service';
import { Config } from '../config';
import {Subject, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {User} from '../schema/User';
import {Coord} from '../schema/Coord';

@Injectable({
  providedIn: 'root',
})
export class ConstantsService implements OnDestroy{
  currentLang = '';
  currentLangSubject = new Subject<string>();
  cookieLang = '';
  langs = Config.langs;
  frStatus = true;
  enStatus = false;
  userStatus = false;
  logoutSubscription: Subscription;
  tokenChangeSubscription: Subscription;
  user: User;
  userSubject = new Subject<User>();
  tokenSubject = new Subject<string>();
  token = null;
  globalAlertStatusSubject = new Subject<string>();
  globalAlertStatus = '';
  currentLogo = 'assets/img/lepoint.png';
  currentLogoSubject = new Subject<string>();
  currentPosition: Coord;
  currentPositionSubject = new Subject<Coord>();
  currentPositionIsOk = false;

  emitCurrentLang() {
    this.currentLangSubject.next(this.currentLang);
  }

  emitCurrentPosition() {
    this.currentPositionSubject.next(this.currentPosition);
  }

  emitUser() {
    this.userSubject.next(this.user);
  }

  emitToken() {
    this.tokenSubject.next(this.token);
  }

  emitGlobalStatus(){
    this.globalAlertStatusSubject.next(this.globalAlertStatus);
  }

  emitCurrentLogo(){
    this.currentLogoSubject.next(this.currentLogo);
  }


  constructor(private translateService: TranslateService, private cookieService: CookieService, private router: Router) {
    this.currentPosition = {latitude: '', longitude: ''};
    this.initData();
  }



  public changeLang(lang: string): void {

    if (this.langs.indexOf(lang) > -1){

      if ( lang === 'fr'){
        this.frStatus = true;
        this.enStatus = false;
      }
      else{
        this.frStatus = false;
        this.enStatus = true;
      }
      this.translateService.use(lang);
      this.cookieService.set('lang', lang, 604800, '/');
      this.currentLang = lang;
    }

    this.emitCurrentLang();
  }

  public initData(){
    this.cookieLang = this.cookieService.get('lang');
    if (this.cookieLang === ''){
      this.cookieService.set('lang', 'fr');
      this.cookieLang = 'fr';
    }
    this.changeLang(this.cookieLang);
    this.getPosition();
    this.emitCurrentLang();
    this.emitCurrentLogo();

  }

  public deleteAllCookies(){
    this.cookieService.delete('lang', '/');
    this.cookieService.delete('token', '/');
    this.cookieService.deleteAll();
  }

  public logOut(): void{
    const logoutObservable = null;
    this.logoutSubscription = logoutObservable.subscribe(
      (value) => {
        console.log('logout complete!');
        this.deleteAllCookies();
        this.updateUserStatus(false);
        this.updateUser({name: '', picture: {name: 'anonym.png'}, avatar: '', surname: '', token: null
        });
        this.router.navigate(['/auth']);
      },
      (error) => {
        console.log('Uh-oh, an error occurred! : ' + error);
      },
      () => {
      }
    );

  }

  public updateUserStatus(status: boolean){
    this.userStatus = status;
  }

  public updateUser(user){
    this.user = user;
    this.user.picture = Config.apiUrl + 'uploads/' + this.user.picture;
    this.emitUser();
  }

  public updatePosition(position){
    this.currentPosition.latitude = position.lat;
    this.currentPosition.longitude = position.lng;

    this.emitCurrentPosition();
  }
  public getPosition(){
    navigator.geolocation.getCurrentPosition((pos) => {
      if (pos !== null){
        this.currentPositionIsOk = true;
        this.currentPosition.latitude = pos.coords.latitude.toString();
        this.currentPosition.longitude = pos.coords.longitude.toString();
        this.emitCurrentPosition();
        // setTimeout(() => {window.location.reload(); }, 1000);
      }
    });
  }

  public updateLogo(logo: string){
    this.currentLogo =  Config.apiUrl + '/uploads/profile/' + logo;
    this.emitCurrentLogo();
  }

  public updateLogoAsset(logo: string){
    this.currentLogo =  'assets/img/' + logo;
    this.emitCurrentLogo();
  }

  public resetLogo(){
    this.currentLogo =  'assets/img/lepoint.png';
    this.emitCurrentLogo();
  }

  public getUser(){
    return this.user;
  }

  updateToken(token){
    this.token = token;
    this.emitToken();
  }

  ngOnDestroy() {
    if (this.tokenChangeSubscription) {
      this.tokenChangeSubscription.unsubscribe();
    }
  }

  updateGlobalStatus(val: string){
    this.globalAlertStatus = val;
    this.emitGlobalStatus();
  }
}
