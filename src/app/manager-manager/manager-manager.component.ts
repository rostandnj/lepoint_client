import {Component, OnInit, TemplateRef} from '@angular/core';
import {Subscription} from 'rxjs';
import {ConstantsService} from '../service/constants-service';
import {AuthService} from '../service/auth-service';
import {HttpClient} from '@angular/common/http';
import {FormBuilder} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ApiService} from '../service/api-service';
import {TranslateService} from '@ngx-translate/core';
import {UserService} from '../service/user-service';
import {Order} from '../schema/Order';
import {User} from '../schema/User';
import {Config} from '../config';
import {EntityService} from '../service/entity-service';
import {Entity} from '../schema/Entity';

@Component({
  selector: 'app-manager-manager',
  templateUrl: './manager-manager.component.html',
  styleUrls: ['./manager-manager.component.css']
})
export class ManagerManagerComponent implements OnInit {
  globalAlertStatusSubscription: Subscription;
  globalAlertStatus = '';
  isLoginSubscription: Subscription;
  currentLangSubscription: Subscription;
  loading = true;
  isLogin: boolean;
  userType = null;
  ownerEntity: Entity;
  orders: Order[];
  modalRef: BsModalRef;
  openOrder: Order;
  configLink = Config.apiUrl + Config.getQrCode;

  constructor(private constantService: ConstantsService, private entityService: EntityService,
              private authService: AuthService, private httpClient: HttpClient,  private fb: FormBuilder,
              private modalService: BsModalService, private apiService: ApiService,
              private translateService: TranslateService, private userService: UserService) {
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

        this.entityService.getUserEntities('1').subscribe((res: Entity) => {
          this.loading = false;
          this.ownerEntity = res;

        }, (error) => {
          this.loading = false;
          if (error.error.message === undefined){
            this.constantService.updateGlobalStatus(error.error);
          }
          else{
            this.constantService.updateGlobalStatus(error.error.message);
          }
          console.log(error.error);

        }, () => {

        });

    }

    this.orders = [];
    this.openOrder = null;
  }

  ngOnInit(){
    this.getOrders();
  }

  showOrder(template: TemplateRef<any>, order: Order){
    this.openOrder = order;
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }

  getOrders(){
    this.loading = true;
    this.entityService.entityOrders({}).subscribe((res: Order[]) => {
      this.loading = false;
      this.orders = [];
      res.forEach((el) => {
        if (el.client !== null){
          el.image = Config.apiUrl + '/uploads/profile/' + el.client.picture;
        }
        else{
          el.image = Config.apiUrl + '/uploads/profile/' + 'man.png';
        }
        el.entity.global_info.image =  Config.apiUrl + '/uploads/profile/' + el.entity.global_info.image;
        this.orders.push(el);
      });

    }, (error) => {
      this.loading = false;
      if (error.error.message === undefined){
        this.constantService.updateGlobalStatus(error.error);
      }
      else{
        this.constantService.updateGlobalStatus(error.error.message);
      }
      console.log(error.error);

    }, () => {

    });
  }

  updateUserStatus(order: Order, s){
    this.loading = true;
    if (parseInt(s, 10) !== order.status){
      this.entityService.updateOrderStatus({id: order.id, status: s}).subscribe((res: Order) => {
        this.loading = false;
        let test = null;
        this.orders.forEach((el, index) => {
          if (el.id === res.id){
            test = index;
          }
        });
        if (test !== null){
          if (res.client !== null){
            res.image = Config.apiUrl + '/uploads/profile/' + res.client.picture;
          }
          else{
            res.image = Config.apiUrl + '/uploads/profile/' + 'man.png';
          }
          res.entity.global_info.image =  Config.apiUrl + '/uploads/profile/' + res.entity.global_info.image;
          this.orders.splice(test, 1, res);
        }

        this.translateService.get('item updated', {}).subscribe((value: string) => {
          this.constantService.updateGlobalStatus(value);
        });
      }, (error) => {
        this.loading = false;
        if (error.error.message === undefined){
          this.constantService.updateGlobalStatus(error.error);
        }
        else{
          this.constantService.updateGlobalStatus(error.error.message);
        }
        console.log(error.error);

      }, () => {

      });
    }

  }

}
