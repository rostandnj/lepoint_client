import {Component, OnInit, OnDestroy, TemplateRef} from '@angular/core';
import {Subscription} from 'rxjs';
import {User} from '../schema/User';
import {AuthService} from '../service/auth-service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginResponse} from '../schema/LoginResponse';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {Cart} from '../schema/Cart';
import {CartDisplay} from '../schema/CartDisplay';
import {Config} from '../config';
import {City} from '../schema/City';
import {HttpClient} from '@angular/common/http';
import {Order} from '../schema/Order';
import {TranslateService} from '@ngx-translate/core';
import {ConstantsService} from '../service/constants-service';
import {Status} from '../schema/Status';
import {EntityService} from '../service/entity-service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {

  userSubscription: Subscription;
  user: User;
  isLogin: boolean;
  isLoginSubscription: Subscription;
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  form: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  form4: FormGroup;
  formError = '';
  form2Error = '';
  form3Error = '';
  form4Error = '';
  activeForm = 1;
  loadingForm: boolean;
  alertStatus: boolean;
  alertMsg = '';
  username = '';
  userId = '';
  cartSubscription: Subscription;
  notificationsSubscription: Subscription;
  cart: Cart;
  cartToShow: CartDisplay;
  cities: City[];
  loadingForm4 = false;
  clientInside = false;
  autoUpdate = null;
  notifications: Status[];
  notRead = 0;
  lastId = 0;

  constructor(private authService: AuthService, private modalService: BsModalService, private httpClient: HttpClient,
              private fb: FormBuilder, private entityService: EntityService,
              private translateService: TranslateService, private constantService: ConstantsService) {
    this.cities = [];
    this.notifications = [];
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
    this.form2 = this.fb.group({
      name: ['', Validators.minLength(3)],
      surname: [''],
      email: ['', Validators.email],
      phone: ['', Validators.minLength(9)],
      gender: ['1', Validators.required],
      type: ['20', Validators.required],
      password: ['', Validators.minLength(6)]
    });
    this.form3 = this.fb.group({
      email: ['', Validators.email]
    });

    this.form4 = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{9,}$')]],
      name: ['', Validators.minLength(3)],
      place: [' ', Validators.required],
      city: ['', Validators.required],
      street: ['', Validators.required],
      street_detail: ['', Validators.required],
      is_inside: [false],
      pay_mode: ['', Validators.required],

    });

    this.cartSubscription = this.entityService.cartSubject.subscribe((res) => {
      this.cart = res;
      if (this.cartToShow !== null){
        this.updateCartToDisplayOnly();
      }

    }, (error) => {
      console.log(error);
    }, () => {

    });

    this.notificationsSubscription = this.authService.notificationsSubject.subscribe((status: Status[]) => {
      if (this.user !== null){
        this.notifications = status;
        status.forEach((el) => {
          if (el.status === false){
            this.notRead = this.notRead + 1;
            el.status = true;
          }
          if (parseInt(el.id, 10) > this.lastId){
            this.lastId = parseInt(el.id, 10);
          }
        });
      }

    }, (error) => {
      console.log(error);
    }, () => {

    });
  }

  ngOnInit(): void {
    this.loadingForm = false;
    this.alertStatus = false;
    this.alertMsg = '';
    this.cart = this.entityService.getCart();
    this.cartToShow = null;
    // this.authService.getUserStatus();
    this.httpClient.get('assets/city.json').subscribe((data: City[]) => {
      this.cities = data;
    });
    this.autoUpdate = setInterval(() => {
      if (this.user !== null) { this.authService.getUserLastNotifications({id: this.lastId}); }
    }, 45000);
    if (this.user !== null) { this.authService.getUserNotifications(); }
  }

  get f1() { return this.form.controls; }
  get f2() { return this.form2.controls; }
  get f3() { return this.form3.controls; }
  get f4() { return this.form4.controls; }


  public openModal(template: TemplateRef<any>) {
    this.form.reset();
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }

  public openModal2(template: TemplateRef<any>) {
       this.updateCartToDisplay(template);
  }

  ngOnDestroy(): void{
    if (this.isLoginSubscription) {this.isLoginSubscription.unsubscribe(); }
    if (this.userSubscription) {this.userSubscription.unsubscribe(); }
    if (this.autoUpdate) {
      clearInterval(this.autoUpdate);
    }
  }

  login() {
    this.loadingForm = true;
    this.formError = '';
    const val = this.form.value;

    if (val.email && val.password) {
      this.authService.login(val.email, val.password).subscribe((res: LoginResponse) => {
        this.authService.setSession(res);
        this.loadingForm = false;
        this.modalRef.hide();
      }, (error => {
        this.formError = error.error;
        this.loadingForm = false;
      }));
    }
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

  signUp() {
    this.form2Error = '';
    const val = this.form2.value;
    if (val.email && val.name && val.phone && val.gender && val.password && val.type){
      this.loadingForm = true;
      this.authService.signUp(val).subscribe((res: string) => {
        this.loadingForm = false;
        this.alertMsg = res;
        this.alertStatus = true;
        this.activateLoginForm();
        this.form.reset();
        this.formError = '';
        this.form2Error = '';
        this.form3Error = '';
      }, (error => {
        this.form2Error = error.error;
        this.loadingForm = false;
      }));
    }
  }

  reset() {
    this.form3Error = '';
    const val = this.form3.value;
    this.loadingForm = true;
    this.authService.resetPassword(val).subscribe((res: string) => {
      this.loadingForm = false;
      this.alertMsg = res;
      this.alertStatus = true;
      this.activateLoginForm();
      this.form.reset();
      this.form3.reset();
      this.formError = '';
      this.form2Error = '';
      this.form3Error = '';
    }, (error => {
      this.form3Error = error.error;
      this.loadingForm = false;
    }));
  }

  updateCartToDisplay(template){
    this.cartToShow = null;
    const inRes = [];
    const res = [];
    if (this.cart.items.length > 0){
      this.cartToShow =  {entity: this.cart.items[0].menu.entity, cartItem: [], totalPrice: 0};
      if (this.user !== null){
        this.form4.patchValue({
          phone: this.user.phone,
          name: this.user.name + ' ' + this.user.surname,
          city: this.cart.items[0].menu.entity.location.city,
          is_inside: false,
        });
      }else{
        this.form4.patchValue({
          city: this.cart.items[0].menu.entity.location.city,
          is_inside: false,
        });
      }
    }
    this.cart.items.forEach((cart) => {
      if (!cart.menu.entity.global_info.image.includes('http')){
        cart.menu.entity.global_info.image = Config.apiUrl + 'uploads/mini/' + cart.menu.entity.global_info.image;
      }
      this.cartToShow.cartItem.push(cart);
      this.cartToShow.totalPrice = this.cartToShow.totalPrice + cart.menu.price * cart.quantity ;
    });

    this.modalRef2 = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }

  updateCartToDisplayOnly(){
    this.cartToShow = null;
    const inRes = [];
    const res = [];
    if (this.cart.items.length > 0){
      this.cartToShow =  {entity: this.cart.items[0].menu.entity, cartItem: [], totalPrice: 0};
      if (this.user !== null){
        this.form4.patchValue({
          phone: this.user.phone,
          name: this.user.name + ' ' + this.user.surname,
          city: this.cart.items[0].menu.entity.location.city,
          is_inside: false,
        });
      }else{
        this.form4.patchValue({
          city: this.cart.items[0].menu.entity.location.city,
          is_inside: false,
        });
      }
    }
    this.cart.items.forEach((cart) => {
        if (!cart.menu.entity.global_info.image.includes('http')){
          cart.menu.entity.global_info.image = Config.apiUrl + 'uploads/mini/' + cart.menu.entity.global_info.image;
        }
        this.cartToShow.cartItem.push(cart);
        this.cartToShow.totalPrice = this.cartToShow.totalPrice + cart.menu.price * cart.quantity ;
    });
  }

  addItemQuantity(id){
    this.entityService.addItemQuantity(id);

  }

  removeItemQuantity(id){
    this.entityService.removeItemQuantity(id);
  }

  cancelOrder(){
    this.entityService.clearCart();
    this.modalRef2.hide();
  }

  clientLocation(event) {
    if (event.target.checked === false){
      this.form4.patchValue({
        place: ' ',
        street: '',
        street_detail: ''
      });
    }else{
      this.form4.patchValue({
        place: '',
        street: '  ',
        street_detail: '  '
      });
    }
    this.clientInside = event.target.checked === true;

  }

  sendOrder() {
    this.loadingForm4 = true;
    this.form4Error = '';
    const val = this.form4.value;

    let data = {};
    if (this.user === null){
      data = {entity_id: this.cartToShow.entity.id, menus: this.cartToShow.cartItem,
        pay_mode: val.pay_mode,
        customer_name: val.name, customer_phone: val.phone,
        location: {country_id: 'cm', city: val.city, street: val.street, street_detail: val.street_detail},
        place: this.clientInside === true ? val.place : ''};
      this.entityService.makeOrder(data).subscribe((res: Order) => {
        this.loadingForm4 = false;

        this.entityService.clearCart();
        this.modalRef2.hide();

        this.translateService.get('order sended', {}).subscribe((value: string) => {
          this.constantService.updateGlobalStatus(value);
        });

      }, (error => {
        if (error.error.message === undefined){
          this.form4Error = error.error;
        }
        else{
          this.form4Error = error.error.message;
        }
        this.loadingForm4 = false;
      }));
    }
    else{
      data = {entity_id: this.cartToShow.entity.id, menus: this.cartToShow.cartItem,
        pay_mode: val.pay_mode,
        location: {country_id: 'cm', city: val.city, street: val.street, street_detail: val.street_detail},
        place: this.clientInside === true ? val.place : '',
      };
      this.entityService.makeOrderConnected(data).subscribe((res: Order) => {
        this.loadingForm4 = false;

        this.entityService.clearCart();
        this.modalRef2.hide();

        this.translateService.get('order sended', {}).subscribe((value: string) => {
          this.constantService.updateGlobalStatus(value);
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);

      }, (error => {
        if (error.error.message === undefined){
          this.form4Error = error.error;
        }
        else{
          this.form4Error = error.error.message;
        }
        this.loadingForm4 = false;
      }));
    }


  }
}
