import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {City} from '../schema/City';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Entity} from '../schema/Entity';
import {User} from '../schema/User';
import {Menu} from '../schema/Menu';
import {MenuCategory} from '../schema/MenuCategory';
import {BaseCategory} from '../schema/BaseCategory';
import {ConstantsService} from '../service/constants-service';
import {EntityService} from '../service/entity-service';
import {AuthService} from '../service/auth-service';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../service/api-service';
import {TranslateService} from '@ngx-translate/core';
import {UserService} from '../service/user-service';
import {Image} from '../schema/Image';
import {Config} from '../config';
import {EntityDetail} from '../schema/EntityDetail';
import {Order} from '../schema/Order';

@Component({
  selector: 'app-owner-manager',
  templateUrl: './owner-manager.component.html',
  styleUrls: ['./owner-manager.component.css']
})
export class OwnerManagerComponent implements OnInit, OnDestroy  {


  globalAlertStatusSubscription: Subscription;
  globalAlertStatus = '';
  title = '';
  loading = true;
  isLogin: boolean;
  userType = null;
  canCreate = false;
  alertStatus: boolean;
  alertMsg: string;
  formEntity: FormGroup;
  formMenu: FormGroup;
  cities: City[];
  loadingForm: boolean;
  loadingFormMenu: boolean;
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  modalRefOrder: BsModalRef;
  isLoginSubscription: Subscription;
  ownerEntity: Entity;
  formError = '';
  formError2 = '';
  activeAdmin = 0;
  adminEntities: Entity[];
  adminUsers: User[];
  canLoadMoreResAdmin = false;
  loadingMoreRes = false;
  loadingMoreUser = false;
  canLoadMoreUserAdmin = false;
  activeManager = 0;
  ownerMenus: Menu[];
  ownerMenuCategories: MenuCategory[];
  ownerManagers: User[];
  baseCategories: BaseCategory[];
  formMenuImage: File;
  currentLangSubscription: Subscription;
  currentLang: string;
  imageEntityURL = '';
  imageEntityError = '';
  restaurantImageReal = null;
  modalRef2Edit: BsModalRef;
  formMenuEdit: FormGroup;
  loadingFormMenuEdit: boolean;
  imageMenuURLEdit = '';
  formMenuImageEdit: File;
  activeMenu: Menu;
  imageMenuErrorEdit = '';
  formError2Edit = '';
  modalManager: BsModalRef;
  formManagerError = '';
  loadingFormManager = false;
  formManager: FormGroup;
  openOrder: Order;
  orders: Order[];
  modalRefEdit: BsModalRef;
  formEntityEdit: FormGroup;
  loadingFormEdit: boolean;
  restaurantImageRealEdit = null;
  formErrorEdit = '';
  imageEntityErrorEdit = '';
  imageEntityURLEdit = '';
  activeEntityBaseCategories: BaseCategory[];
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
        // 0=admin 10=owner 11=manager 20=client
        this.userType = localStorage.getItem('userType');
        if (parseInt(this.userType, 10) === 10 && localStorage.getItem('has_restaurant') !== 'ok'){
          this.canCreate = true;
        }
      }

    }, (error) => {
      console.log(error);
    }, () => {

    });
    if (this.authService.getLoginStatus()){
      if (parseInt(localStorage.getItem('userType'), 10) === 0){
        this.entityService.getUserEntities('1').subscribe((res: Entity[]) => {
          this.loading = false;
          this.adminEntities = res;
          if (res.length === this.entityService.aLimit){
            this.canLoadMoreResAdmin = true;
          }

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
      if ([10, 11].includes(parseInt(localStorage.getItem('userType'), 10))){
        this.entityService.getUserEntities('1').subscribe((res: Entity) => {
          this.loading = false;
          this.ownerEntity = res;

        }, (error) => {
          this.loading = false;
          if (parseInt(this.userType, 10) === 10){
            this.canCreate = true;
          }
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


    this.formEntity = this.fb.group({
      name: ['', Validators.minLength(3)],
      description: ['', Validators.minLength(100)],
      facebook_link: [''],
      instagram_link: [''],
      phone2: [''],
      phone1: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{9,}$')]],
      country_id: ['cm'],
      city: [''],
      street: ['', Validators.minLength(3)],
      street_detail: [''],
      img: ['', Validators.required],
    });

    this.formMenu = this.fb.group({
      name: ['', Validators.minLength(3)],
      description: ['', Validators.minLength(3)],
      price: ['', Validators.minLength(1)],
      image: [null, Validators.required],
      estimate_min_time: ['', Validators.minLength(1)],
      estimate_max_time: ['', Validators.minLength(1)],
      categories: ['', Validators.required],
      is_day_menu: [false],
    });

    this.formMenuEdit = this.fb.group({
      name: ['', Validators.minLength(3)],
      description: ['', Validators.minLength(3)],
      price: ['', Validators.minLength(1)],
      image: [''],
      estimate_min_time: ['', Validators.minLength(1)],
      estimate_max_time: ['', Validators.minLength(1)],
      categories: ['', Validators.required],
      is_day_menu: [],
    });

    this.formManager = this.fb.group({
      email: ['', Validators.email],
    });

    this.formEntityEdit = this.fb.group({
      name: ['', Validators.minLength(3)],
      description: ['', Validators.minLength(100)],
      facebook_link: [''],
      instagram_link: [''],
      phone2: [''],
      phone1: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{9,}$')]],
      country_id: ['cm'],
      city: [''],
      street: ['', Validators.minLength(3)],
      street_detail: [''],
      img: [''],
      base_categories: ['', Validators.required],
    });


    this.currentLangSubscription = this.constantService.currentLangSubject.subscribe((lang) => {
      this.currentLang = lang;

    }, (error) => {
      console.log(error);
    }, () => {

    });
  }

  get f1() { return this.formEntity.controls; }
  get f2() { return this.formMenu.controls; }
  get f22() { return this.formMenuEdit.controls; }
  get f3() { return this.formManager.controls; }
  get f11() { return this.formEntityEdit.controls; }

  ngOnInit(): void {
    this.currentLang = this.constantService.currentLang;
    this.httpClient.get('assets/city.json').subscribe((data: City[]) => {
      this.cities = data;
    });

    this.loadingForm = false;
    this.loadingFormMenu = false;
    this.alertStatus = false;
    this.alertMsg = '';
    this.formMenuImage = null;
  }

  ngOnDestroy(): void{
    if (this.globalAlertStatusSubscription) {this.globalAlertStatusSubscription.unsubscribe(); }
    if (this.isLoginSubscription) {this.isLoginSubscription.unsubscribe(); }
  }

  public openModal(template: TemplateRef<any>) {
    this.formEntity.reset();
    this.imageEntityURL = '';
    this.formEntity.patchValue({
      img: ''
    });
    this.restaurantImageReal = null;
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }

  public openModalFormMenu(template: TemplateRef<any>) {
    this.formMenu.reset();
    this.formMenuImage = null;
    this.modalRef2 = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }

  public openModalFormMenuEdit(template: TemplateRef<any>, menu: Menu) {
    this.formMenuEdit.reset();
    this.formMenuImageEdit = null;
    this.imageMenuURLEdit = '';
    this.activeMenu = menu;

    const ids = [];
    menu.menu_categories.forEach((el) => {
      ids.push(el.id.toString());
    });
    this.formMenuEdit.patchValue({
      name: menu.name,
      description: menu.description,
      price: menu.price,
      image: null,
      estimate_min_time: menu.estimate_min_time,
      estimate_max_time: menu.estimate_max_time,
      categories: ids,
      is_day_menu: menu.is_day_menu,
    });
    this.imageMenuURLEdit = menu.image;
    this.modalRef2Edit = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }

  public openModalManager(template: TemplateRef<any>) {
    this.formManager.reset();
    this.formManagerError = '';
    this.modalManager = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }

  public openModalEdit(template: TemplateRef<any>) {
    this.formEntityEdit.reset();
    this.imageEntityURLEdit = '';
    this.restaurantImageRealEdit = null;

    this.entityService.getAllEntityBaseCategories({id: this.ownerEntity.id}).subscribe((res: BaseCategory[]) => {
      this.activeEntityBaseCategories = res;
      const ids = [];
      res.forEach((el) => {
        ids.push(el.id.toString());
      });
      this.formEntityEdit.patchValue({
        name: this.ownerEntity.global_info.name,
        description: this.ownerEntity.global_info.description,
        facebook_page: this.ownerEntity.global_info.facebook_page,
        whatsapp_phone: this.ownerEntity.global_info.whatsapp_phone,
        phone2: this.ownerEntity.global_info.phone2,
        phone1: this.ownerEntity.global_info.phone1,
        country_id: this.ownerEntity.location.country.code,
        city: this.ownerEntity.location.city,
        street: this.ownerEntity.location.street,
        street_detail: this.ownerEntity.location.street_detail,
        img: null,
        base_categories: ids

      });
      this.imageEntityURLEdit = Config.apiUrl + '/uploads/profile/' + this.ownerEntity.global_info.image;
      this.modalRefEdit = this.modalService.show(template, Object.assign({}, { class: 'login' }));

    }, (error) => {
      console.log(error.error);

    });
  }

  resgisterEntity() {
    this.loadingForm = true;
    this.formError = '';

    const formData = new FormData();
    formData.append('file', this.restaurantImageReal);
    this.userService.uploadPicture(formData).subscribe((res1: Image) => {
      const data = this.formEntity.value;
      data.image = res1.name;
      if (parseInt(this.userType, 10) === 0){
        this.entityService.registerEntityAdmin(data).subscribe((res: Entity) => {
          this.loadingForm = false;
          this.adminEntities.unshift(res);
          this.modalRef.hide();

        }, (error) => {
          this.loadingForm = false;
          if (error.error.message === undefined){
            this.formError  =  error.error;
          }
          else{
            this.formError  =  error.error.message;
          }
          console.log(error.error);

        }, () => {

        });
      }
      else{
        this.entityService.registerEntityOwner(data).subscribe((res: Entity) => {
          this.loadingForm = false;
          this.ownerEntity = res;
          this.canCreate = false;
          this.modalRef.hide();

        }, (error) => {
          this.loadingForm = false;
          if (error.error.message === undefined){
            this.formError  =  error.error;
          }
          else{
            this.formError  =  error.error.message;
          }
          console.log(error.error);

        }, () => {

        });
      }

    }, (error1) => {
      if (error1.error.message === undefined){
        this.formError  =  error1.error;
      }
      else{
        this.formError  =  error1.error.message;
      }
      console.log(error1.error);
      this.loadingForm = false;
    }, () => {
    });

  }

  showPreview(event) {
    this.imageEntityError = '';
    this.imageEntityURL = '';
    const file = (event.target as HTMLInputElement).files[0];
    if (file !== undefined){
      const size = parseFloat((file.size / 1000 / 1000).toFixed(2));
      if (size > 2){
        this.imageEntityError = 'error';
        this.restaurantImageReal = null;
      }
      else{
        this.formEntity.patchValue({
          img: file.name
        });

        // File Preview
        const reader = new FileReader();
        reader.onload = () => {
          this.imageEntityURL = reader.result as string;
        };
        reader.readAsDataURL(file);
        this.restaurantImageReal = file;
      }
    }
    else{
      this.imageEntityURL = '';
      this.formEntity.patchValue({
        img: ''
      });
      this.restaurantImageReal = null;
    }

  }

  showPreview2Edit(event) {
    this.imageMenuErrorEdit = '';
    this.imageMenuURLEdit = '';
    const file = (event.target as HTMLInputElement).files[0];
    if (file !== undefined){
      const size = parseFloat((file.size / 1000 / 1000).toFixed(2));
      if (size > 2){
        this.imageMenuErrorEdit = 'error';
        this.formMenuImageEdit = null;
        this.formMenuEdit.patchValue({
          image: null
        });
      }
      else{
        this.formMenuEdit.patchValue({
          image: file.name
        });

        // File Preview
        const reader = new FileReader();
        reader.onload = () => {
          this.imageMenuURLEdit = reader.result as string;
        };
        reader.readAsDataURL(file);
        this.formMenuImageEdit = file;
      }
    }
    else{
      this.imageMenuURLEdit = '';
      this.formMenuEdit.patchValue({
        image: ''
      });
      this.formMenuImageEdit = null;
    }

  }

  getAdminEntities(){
    this.loadingMoreRes = true;
    this.entityService.getUserEntities('1').subscribe((res: Entity[]) => {
      this.loadingMoreRes = false;
      res.forEach((el) => {
        this.adminEntities.push(el);
      });
      if (res.length === this.entityService.aLimit){
        this.canLoadMoreResAdmin = true;
      }
      else{
        this.canLoadMoreResAdmin = false;
      }

    }, (error) => {
      this.loadingMoreRes = false;
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

  getAdminEntitysInit(){
    this.activeAdmin = 0;
    this.loading = true;
    this.entityService.getUserEntities('1').subscribe((res: Entity[]) => {
      this.loading = false;
      this.adminEntities = res;
      if (res.length === this.entityService.aLimit){
        this.canLoadMoreResAdmin = true;
      }
      else{
        this.canLoadMoreResAdmin = false;
      }

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

  getAdminUsersInit(){
    this.activeAdmin = 1;
    this.loading = true;
    this.entityService.getAdminUser(true).subscribe((res: User[]) => {
      this.loading = false;
      this.adminUsers = [];
      res.forEach((el) => {
        el.picture = Config.apiUrl + '/uploads/profile/' + el.picture;
        this.adminUsers.push(el);
      });
      if (res.length === this.entityService.userLimit){
        this.canLoadMoreUserAdmin = true;
      }
      else{
        this.canLoadMoreUserAdmin = false;
      }

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

  getAdminUsers(){
    this.activeAdmin = 1;
    this.loadingMoreUser = true;
    this.entityService.getAdminUser(false).subscribe((res: User[]) => {
      this.loadingMoreUser = false;
      res.forEach((el) => {
        el.picture = Config.apiUrl + '/uploads/profile/' + el.picture;
        this.adminUsers.push(el);
      });
      if (res.length === this.entityService.userLimit){
        this.canLoadMoreUserAdmin = true;
      }
      else{
        this.canLoadMoreUserAdmin = false;
      }

    }, (error) => {
      this.loadingMoreUser = false;
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

  getOwnerEntity(){
    this.activeManager = 0;
  }

  getOwnerEntityMenus(){
    this.activeManager = 1;
    this.loading = true;
    this.entityService.getOneEntity({id: this.ownerEntity.id}).subscribe((res: EntityDetail) => {
      this.ownerMenus = [];
      this.ownerMenuCategories = [];
      this.baseCategories = [];
      this.loading = false;
      res.menus.forEach((el) => {
        el.image = Config.apiUrl + '/uploads/profile/' + el.image;
        this.ownerMenus.push(el);
      });
      res.categories.forEach((el) => {
        el.base_category.image = Config.apiUrl + '/uploads/profile/' + el.base_category.image;
        this.ownerMenuCategories.push(el);
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

  getOwnerEntityManager(){
    this.activeManager = 2;
    this.loading = true;
    this.entityService.getManagerEntity({id: this.ownerEntity.id}).subscribe((res: User[]) => {
      this.loading = false;
      this.ownerManagers = [];
      res.forEach((el) => {
        el.picture = Config.apiUrl + '/uploads/profile/' + el.picture;
        this.ownerManagers.push(el);
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

  addMenu(){
    const formData = new FormData();
    formData.append('file', this.formMenuImage);

    this.loadingFormMenu = true;
    this.apiService.postFile(Config.uploadImage, formData).subscribe((res1: Image) => {
      const data = this.formMenu.value;
      data.id = this.ownerEntity.id;
      data.image = res1.name;
      this.entityService.createMenu(data).subscribe((res: Menu) => {
        this.loadingFormMenu = false;
        res.image = Config.apiUrl + '/uploads/profile/' + res.image;
        this.ownerMenus.push(res);
        this.translateService.get('item created', {}).subscribe((value: string) => {
          this.constantService.updateGlobalStatus(value);
        });
        this.modalRef2.hide();

      }, (error) => {
        this.loadingFormMenu = false;
        if (error.error.message === undefined){
          this.constantService.updateGlobalStatus(error.error);
        }
        else{
          this.constantService.updateGlobalStatus(error.error.message);
        }
        console.log(error.error);

      }, () => {

      });


    }, (error) => {
      if (error.error.message === undefined){
        this.constantService.updateGlobalStatus(error.error);
      }
      else{
        this.constantService.updateGlobalStatus(error.error.message);
      }
      console.log(error.error);
      this.loadingFormMenu = false;
    }, () => {
    });
  }

  editMenu() {

    if (this.activeMenu != null){
      this.loadingFormMenuEdit = true;
      if (this.formMenuImageEdit === null){
        const data = this.formMenuEdit.value;
        data.id = this.activeMenu.id;
        this.entityService.updateMenu(data).subscribe((res: Menu) => {
          this.loadingFormMenuEdit = false;
          res.image = Config.apiUrl + '/uploads/profile/' + res.image;

          const length = this.ownerMenus.length;
          let index = null;
          for (let i = 0; i < length; i++){
            if (this.ownerMenus[i].id === this.activeMenu.id ){
              index = i;
            }
          }
          if (index !== null){
            this.ownerMenus.splice(index, 1, res);
          }

          this.translateService.get('item updated', {}).subscribe((value: string) => {
            this.constantService.updateGlobalStatus(value);
          });
          this.activeMenu = null;
          this.modalRef2Edit.hide();

        }, (error) => {
          this.loadingFormMenuEdit = false;
          if (error.error.message === undefined){
            this.formError2Edit = error.error;
          }
          else{
            this.formError2Edit = error.error.message;
          }
          console.log(error.error);

        }, () => {

        });
      }
      else{
        const formData = new FormData();
        formData.append('file', this.formMenuImageEdit);
        this.apiService.postFile(Config.uploadImage, formData).subscribe((res1: Image) => {
          const data = this.formMenuEdit.value;
          data.id = this.activeMenu.id;
          data.image = res1.name;
          this.entityService.updateMenu(data).subscribe((res: Menu) => {
            this.loadingFormMenuEdit = false;
            res.image = Config.apiUrl + '/uploads/profile/' + res.image;

            const length = this.ownerMenus.length;
            let index = null;
            for (let i = 0; i < length; i++){
              if (parseInt(this.ownerMenus[i].id, 10) === parseInt(this.activeMenu.id, 10) ){
                index = i;
              }
            }
            if (index !== null){
              this.ownerMenus.splice(index, 1, res);
            }

            this.translateService.get('item updated', {}).subscribe((value: string) => {
              this.constantService.updateGlobalStatus(value);
            });
            this.activeMenu = null;
            this.modalRef2Edit.hide();

          }, (error) => {
            this.loadingFormMenuEdit = false;
            if (error.error.message === undefined){
              this.formError2Edit = error.error;
            }
            else{
              this.formError2Edit = error.error.message;
            }
            console.log(error.error);

          }, () => {

          });


        }, (error) => {
          if (error.error.message === undefined){
            this.formError2 = error.error;
          }
          else{
            this.formError2Edit = error.error.message;
          }
          console.log(error.error);
          this.loadingFormMenuEdit = false;
        }, () => {
        });

      }
    }

  }

  removeManager(user: User) {

    this.loading = true;
    this.entityService.removeManager({id: user.id}).subscribe((res: User) => {
      this.loading = false;
      let ind = null;
      this.ownerManagers.forEach((e, index ) => {
        if (e.id === user.id){
          ind = index;
        }

      });
      if (ind !== null){
        this.ownerManagers.splice(ind, 1);
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

  addManager() {
    const data = this.formManager.value;
    data.id = this.ownerEntity.id;
    data.type = 11;
    this.loadingFormManager = true;
    this.entityService.addManager(data).subscribe((res: User) => {
      this.loadingFormManager = false;
      res.picture = Config.apiUrl + '/uploads/profile/' + res.picture;
      this.ownerManagers.push(res);

      this.translateService.get('item updated', {}).subscribe((value: string) => {
        this.constantService.updateGlobalStatus(value);
      });

      this.modalManager.hide();

    }, (error) => {
      this.loadingFormManager = false;
      if (error.error.message === undefined){
        this.formManagerError = error.error;
      }
      else{
        this.formManagerError = error.error.message;
      }
      console.log(error.error);

    }, () => {

    });


  }

  getOrders(){
    this.loading = true;
    this.activeManager = 3;
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

  showOrder(template: TemplateRef<any>, order: Order){
    this.openOrder = order;
    this.modalRefOrder = this.modalService.show(template, Object.assign({}, { class: 'login' }));
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

  editEntity() {
    this.loadingFormEdit = true;
    if (this.restaurantImageRealEdit === null){
      const data = this.formEntityEdit.value;
      data.id = this.ownerEntity.id;
      this.entityService.updateEntity(data).subscribe((res: Entity) => {
        this.loadingFormEdit = false;

        this.ownerEntity = res;
        this.translateService.get('item updated', {}).subscribe((value: string) => {
          this.constantService.updateGlobalStatus(value);
        });

        this.modalRefEdit.hide();

      }, (error) => {
        this.loadingFormEdit = false;
        if (error.error.message === undefined){
          this.formErrorEdit  =  error.error;
        }
        else{
          this.formErrorEdit  =  error.error.message;
        }
        console.log(error.error);

      }, () => {

      });
    }
    else{
      const formData = new FormData();
      formData.append('file', this.restaurantImageRealEdit);
      this.userService.uploadPicture(formData).subscribe((res1: Image) => {
        const data = this.formEntityEdit.value;
        data.image = res1.name;
        data.id = this.ownerEntity.id;
        this.entityService.updateEntity(data).subscribe((res: Entity) => {
          this.loadingFormEdit = false;
          this.ownerEntity = res;

          this.translateService.get('item updated', {}).subscribe((value: string) => {
            this.constantService.updateGlobalStatus(value);
          });
          this.modalRefEdit.hide();

        }, (error) => {
          this.loadingFormEdit = false;
          if (error.error.message === undefined){
            this.formErrorEdit  =  error.error;
          }
          else{
            this.formErrorEdit  =  error.error.message;
          }
          console.log(error.error);

        }, () => {

        });


      }, (error1) => {
        if (error1.error.message === undefined){
          this.formErrorEdit  =  error1.error;
        }
        else{
          this.formErrorEdit  =  error1.error.message;
        }
        console.log(error1.error);
        this.loadingFormEdit = false;
      }, () => {
      });
    }

  }

  showPreviewEdit(event) {
    this.imageEntityErrorEdit = '';
    this.imageEntityURLEdit = '';
    const file = (event.target as HTMLInputElement).files[0];
    if (file !== undefined){
      const size = parseFloat((file.size / 1000 / 1000).toFixed(2));
      if (size > 2){
        this.imageEntityErrorEdit = 'error';
        this.restaurantImageRealEdit = null;
        this.formEntityEdit.patchValue({
          img: null
        });

      }
      else{
        this.formEntityEdit.patchValue({
          img: file.name
        });

        // File Preview
        const reader = new FileReader();
        reader.onload = () => {
          this.imageEntityURLEdit = reader.result as string;
        };
        reader.readAsDataURL(file);
        this.restaurantImageRealEdit = file;
      }
    }
    else{
      this.imageEntityURLEdit = '';
      this.formEntityEdit.patchValue({
        img: ''
      });
      this.restaurantImageRealEdit = null;
    }

  }

  changeCanOrder(idR) {
    this.loading = true;
    this.entityService.changeEntityCanOrder({id: idR}).subscribe((res: Entity) => {
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

}
