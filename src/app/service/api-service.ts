import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Config} from '../config';
import {Observable, Subscription, throwError} from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {CookieService} from 'ngx-cookie-service';
import {ConstantsService} from './constants-service';

@Injectable({
  providedIn: 'root'
})
export class ApiService implements OnDestroy{

  private REST_API_SERVER = '';
  private REST_API_MTECH = '';
  private token = null;
  tokenChangeSubscription: Subscription;

  private httpOptions = {
    'Content-Type': 'application/json',
    Authorization: '',
    lang: ''
  };
  private currentLangSubscription: Subscription;
  private currentLang = '';

  constructor(private httpClient: HttpClient, private constantService: ConstantsService,
              private cookieService: CookieService) {
    this.REST_API_SERVER = Config.apiUrl;

    this.currentLangSubscription = this.constantService.currentLangSubject.subscribe((lang) => {
      this.currentLang = lang;
      this.httpOptions.lang = lang;
    });

    this.constantService.tokenSubject.subscribe((token) => {
      this.token = token;
      this.httpOptions.Authorization = 'Bearer ' + this.token;
    }, (error) => {
      console.log(error);
    });


  }

  public get(endPoint: string){
    // console.log(this.httpOptions);
    // this.httpOptions.lang = this.currentLang;
    // this.httpOptions.Authorization = 'Bearer ' + this.token;
    const url = this.REST_API_SERVER + endPoint;
    return this.httpClient.get(url, {headers: new HttpHeaders(this.httpOptions)});

  }

  public post(endPoint: string, data: any){
    // this.httpOptions.lang = this.currentLang;
    // this.httpOptions.Authorization = 'Bearer ' + this.token;
    const url = this.REST_API_SERVER + endPoint;
    return this.httpClient.post(url, data, {headers: new HttpHeaders(this.httpOptions)});

  }

  public postFile(endPoint: string, data: any){
    const url = this.REST_API_SERVER + endPoint;
    const httpO = {
      Authorization: this.httpOptions.Authorization,
      // enctype: 'multipart/form-data',
      // processData: false,
      // convert: false,
      // contentType: 'multipart/form-data'
    };
    return this.httpClient.post(url, data, {headers: new HttpHeaders(httpO)});

  }
  ngOnDestroy() {
    if (this.tokenChangeSubscription) {
      this.tokenChangeSubscription.unsubscribe();
    }
  }
}
