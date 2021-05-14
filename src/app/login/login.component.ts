import {Component, OnInit, OnDestroy, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../service/auth-service';
import {Router} from '@angular/router';
import {User} from '../schema/User';
import {Subscription} from 'rxjs';
import {LoginResponse} from '../schema/LoginResponse';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  formError = '';
  form2Error = '';
  form3Error = '';
  user: User;
  isLogin: boolean;
  isLoginSubscription: Subscription;
  activeForm = 1;
  loadingForm: boolean;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) {
    this.isLoginSubscription = this.authService.userIsLoginSubject.subscribe((status: boolean) => {
      this.isLogin = status;
    }, (error) => {
      console.log(error);
    }, () => {

    });
    this.form = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadingForm = false;
  }
  get f1() { return this.form.controls; }
  get f2() { return this.form2.controls; }
  get f3() { return this.form3.controls; }


  login() {
    this.loadingForm = true;
    this.formError = '';
    const val = this.form.value;

    if (val.email && val.password) {
      this.authService.login(val.email, val.password).subscribe((res: LoginResponse) => {
        this.authService.setSession(res);
        this.loadingForm = false;
      }, (error => {
        this.formError = error.error;
        this.loadingForm = false;
      }));
    }
  }

  ngOnDestroy(): void{
    if (this.isLoginSubscription) {this.isLoginSubscription.unsubscribe(); }
  }

  activateLoginForm(){
    this.activeForm = 1;
  }
  activateSigninForm(){
    this.activeForm = 2;
  }
  activateResetForm(){
    this.activeForm = 3;
  }

}
