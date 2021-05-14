import {Injectable, Injector} from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders, HttpResponse, HttpErrorResponse
} from '@angular/common/http';

import {Observable, Subscription, throwError} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import {Config} from '../config';
import {catchError, tap} from 'rxjs/operators';
import {Router} from '@angular/router';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class Interceptor implements HttpInterceptor {
  private httpOptions = {
    'Content-Type': 'application/json',
    Authorization: '',
    lang: ''
  };
  private currentLangSubscription: Subscription;
  private currentLang = '';
  private token;

  constructor(private cookieService: CookieService, private router: Router) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    if (token){
      this.httpOptions.Authorization = 'Bearer ' + token;
    }
    /*else{
      this.httpOptions.Authorization = 'Bearer xxx';
    }*/
    const reqNext = req.clone({headers: new HttpHeaders(this.httpOptions)});
    if (reqNext.url.includes(Config.apiSecure)){
      return next.handle(reqNext).pipe(tap(evt => {
        if (evt instanceof HttpResponse) {
          // console.log(evt.body);
        }
      }), catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        let err = '';
        if (error.error){
          errorMessage = error.error;
          err = error.error;

          if (error.error.message){
            errorMessage = error.error.message;
            err = error.error.message;
          }
        }
        const tab = ['compte bloqué', 'Compte bloqué', 'Account Locked', 'account locked', 'Invalid JWT Token'];
        if (tab.includes(err)){
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          localStorage.removeItem('expires_at');
          localStorage.removeItem('has_restaurant');
          localStorage.removeItem('cart');
          this.router.navigateByUrl('/');
        }
        if (err === 'please add the authorization header'){
          window.alert('Oups :' + errorMessage);

        }
        return throwError(error);
      }) );
    }else{
      return next.handle(req);
    }
  }
}
