import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {Subscription} from 'rxjs';
import {ConstantsService} from '../service/constants-service';
import {EntityService} from '../service/entity-service';
import {AuthService} from '../service/auth-service';
import {City} from '../schema/City';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Entity} from '../schema/Entity';
import {User} from '../schema/User';
import {Config} from '../config';
import {Menu} from '../schema/Menu';
import {MenuCategory} from '../schema/MenuCategory';
import {EntityDetail} from '../schema/EntityDetail';
import {BaseCategory} from '../schema/BaseCategory';
import {ApiService} from '../service/api-service';
import {Image} from '../schema/Image';
import {TranslateService} from '@ngx-translate/core';
import {UserService} from '../service/user-service';
import {Order} from '../schema/Order';

@Component({
  selector: 'app-admin-manager',
  templateUrl: './admin-manager.component.html',
  styleUrls: ['./admin-manager.component.css']
})
export class AdminManagerComponent implements OnInit, OnDestroy {

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
  formEntityEdit: FormGroup;
  formMenuEdit: FormGroup;
  formManager: FormGroup;
  formActivation: FormGroup;
  formAdvert: FormGroup;
  formTopManager: FormGroup;
  cities: City[];
  loadingForm: boolean;
  loadingFormEdit: boolean;
  loadingFormMenu: boolean;
  loadingFormMenuEdit: boolean;
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  modalRefEdit: BsModalRef;
  modalRef2Edit: BsModalRef;
  modalManager: BsModalRef;
  modalRefOrder: BsModalRef;
  modalActivation: BsModalRef;
  modalAdvert: BsModalRef;
  modalTopManager: BsModalRef;
  isLoginSubscription: Subscription;
  activeEntity: Entity;
  formError = '';
  formErrorEdit = '';
  formError2 = '';
  formError2Edit = '';
  activeAdmin = 0;
  adminEntities: Entity[];
  adminUsers: User[];
  canLoadMoreResAdmin = false;
  loadingMoreRes = false;
  loadingMoreUser = false;
  canLoadMoreUserAdmin = false;
  activeManager = 0;
  activeMenus: Menu[];
  activeMenuCategories: MenuCategory[];
  activeManagers: User[];
  baseCategories: BaseCategory[];
  formMenuImage: File;
  formMenuImageEdit: File;
  currentLangSubscription: Subscription;
  currentLang: string;
  imageEntityURL = '';
  imageEntityError = '';
  imageEntityURLEdit = '';
  imageEntityErrorEdit = '';
  restaurantImageReal = null;
  restaurantImageRealEdit = null;
  imageMenuURL = '';
  imageMenuError = '';
  imageMenuURLEdit = '';
  imageMenuErrorEdit = '';
  activeEntityBaseCategories: BaseCategory[];
  activeMenu: Menu;
  formManagerError = '';
  loadingFormManager = false;
  openOrder: Order;
  orders: Order[];
  formActivationError = '';
  formAdvertError = '';
  formTopManagerError = '';
  loadingFormActivation = false;
  loadingFormAdvert = false;
  loadingFormTopManager = false;
  configLink = Config.apiUrl + Config.getQrCode;
  choosenEntity = '';
  choosenEntityName = '';
  entityListName = [
    {title: 'service_restaurant', value: '1', index: 0},
    {title: 'lunch', value: '2', index: 1},
    {title: 'disco', value: '3', index: 2},
    {title: 'service_hotel', value: '4', index: 3},
    {title: 'art and culture', value: '5', index: 4},
    {title: 'service_administration', value: '6', index: 5},
    {title: 'service_pharmacy', value: '7', index: 6}
  ];
  activeDashboard = '';
  canLoadMoreOrder = false;
  loadingMoreOrder = false;


  constructor(private constantService: ConstantsService, private entityService: EntityService,
              private authService: AuthService, private httpClient: HttpClient,  private fb: FormBuilder,
              private modalService: BsModalService, private apiService: ApiService,
              private translateService: TranslateService, private userService: UserService) {
    this.baseCategories = [];
    this.openOrder = null;
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
      base_categories: ['', Validators.required],
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

    this.formMenu = this.fb.group({
      name: ['', Validators.minLength(3)],
      description: ['', Validators.minLength(3)],
      price: ['', Validators.minLength(1)],
      image: ['', Validators.required],
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
      type: ['0', Validators.required],
    });

    this.formActivation = this.fb.group({
      id: ['', Validators.required],
      days: ['', Validators.required],
      amount: ['', Validators.required],
    });

    this.formAdvert = this.fb.group({
      id: ['', Validators.required],
      message: ['', Validators.required],
    });

    this.formTopManager = this.fb.group({
      user_email: ['', Validators.email],
      user_name: ['', Validators.minLength(3)],
      user_surname: [''],
      user_phone: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{9,}$')]],
      user_gender: ['1', Validators.required]
    });

    this.currentLangSubscription = this.constantService.currentLangSubject.subscribe((lang) => {
      this.currentLang = lang;

    }, (error) => {
      console.log(error);
    }, () => {

    });
  }

  get f1() { return this.formEntity.controls; }
  get f11() { return this.formEntityEdit.controls; }
  get f2() { return this.formMenu.controls; }
  get f22() { return this.formMenuEdit.controls; }
  get f3() { return this.formManager.controls; }
  get f4() { return this.formActivation.controls; }
  get f5() { return this.formAdvert.controls; }
  get f6() { return this.formTopManager.controls; }

  ngOnInit(): void {
    this.currentLang = this.constantService.currentLang;
    this.httpClient.get('assets/city.json').subscribe((data: City[]) => {
      this.cities = data;
    });
    this.entityService.getAllBaseCategories().subscribe((res: BaseCategory[]) => {
      res.forEach((el) => {
        el.image = Config.apiUrl + '/uploads/profile/' + el.image;
        this.baseCategories.push(el);
      });

    }, (error) => {
      console.log(error.error);

    });

    this.loadingForm = false;
    this.loadingFormMenu = false;
    this.alertStatus = false;
    this.alertMsg = '';
    this.formMenuImage = null;
    this.activeDashboard = '';
    this.choosenEntityName = '';
    this.choosenEntity = '';
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

  public openModalEdit(template: TemplateRef<any>, resto: Entity) {
    this.formEntityEdit.reset();
    this.imageEntityURLEdit = '';
    this.restaurantImageRealEdit = null;
    this.activeEntity = resto;

    this.entityService.getAllEntityBaseCategories({id: resto.id}).subscribe((res: BaseCategory[]) => {
      this.activeEntityBaseCategories = res;
      const ids = [];
      res.forEach((el) => {
        ids.push(el.id.toString());
      });
      this.formEntityEdit.patchValue({
        name: resto.global_info.name,
        description: resto.global_info.description,
        facebook_page: resto.global_info.facebook_page,
        whatsapp_phone: resto.global_info.whatsapp_phone,
        phone2: resto.global_info.phone2,
        phone1: resto.global_info.phone1,
        country_id: resto.location.country.code,
        city: resto.location.city,
        street: resto.location.street,
        street_detail: resto.location.street_detail,
        img: null,
        base_categories: ids

      });
      this.imageEntityURLEdit = Config.apiUrl + '/uploads/profile/' + resto.global_info.image;
      this.modalRefEdit = this.modalService.show(template, Object.assign({}, { class: 'login' }));

    }, (error) => {
      console.log(error.error);

    });
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

  public openModalActivation(template: TemplateRef<any>, resto: Entity) {
    this.formActivation.reset();
    this.formActivationError = '';
    this.formActivation.patchValue({id: resto.id});
    this.modalActivation = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }

  public openModalAdvert(template: TemplateRef<any>, resto: Entity) {
    this.formAdvert.reset();
    this.formAdvertError = '';
    this.formAdvert.patchValue({id: resto.id, message: resto.flash_message !== null ? resto.flash_message : ''});
    this.modalAdvert = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }

  showOrder(template: TemplateRef<any>, order: Order){
    this.openOrder = order;
    this.modalRefOrder = this.modalService.show(template, Object.assign({}, { class: 'login' }));
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
          this.activeEntity = res;
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
        this.formEntity.patchValue({
          img: null
        });

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

  showPreview2(event) {
    this.imageMenuError = '';
    this.imageMenuURL = '';
    const file = (event.target as HTMLInputElement).files[0];
    if (file !== undefined){
      const size = parseFloat((file.size / 1000 / 1000).toFixed(2));
      if (size > 2){
        this.imageMenuError = 'error';
        this.formMenuImage = null;
        this.formMenu.patchValue({
          image: null
        });
      }
      else{
        this.formMenu.patchValue({
          image: file.name
        });

        // File Preview
        const reader = new FileReader();
        reader.onload = () => {
          this.imageMenuURL = reader.result as string;
        };
        reader.readAsDataURL(file);
        this.formMenuImage = file;
      }
    }
    else{
      this.imageMenuURL = '';
      this.formMenu.patchValue({
        image: ''
      });
      this.formMenuImage = null;
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

  getAdminEntitiesInit(){
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
    this.choosenEntity = '';
    this.choosenEntityName = '';
    this.activeDashboard = 'users';
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

  getactiveEntity(){
    this.activeManager = 0;
  }

  getActiveEntityMenus(restaurant){
    this.activeAdmin = 2;
    this.activeEntity = restaurant;
    this.loading = true;
    this.entityService.getOneEntity({id: this.activeEntity.id}).subscribe((res: EntityDetail) => {
      this.activeMenus = [];
      this.activeMenuCategories = [];
      this.baseCategories = [];
      this.loading = false;
      res.menus.forEach((el) => {
        el.image = Config.apiUrl + '/uploads/profile/' + el.image;
        this.activeMenus.push(el);
      });
      res.categories.forEach((el) => {
        el.base_category.image = Config.apiUrl + '/uploads/profile/' + el.base_category.image;
        this.activeMenuCategories.push(el);
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

  getActiveEntityManager(restaurant: Entity){
    this.activeAdmin = 3;
    this.activeEntity = restaurant;
    this.loading = true;
    this.entityService.getManagerEntity({id: restaurant.id}).subscribe((res: User[]) => {
      this.loading = false;
      this.activeManagers = [];
      res.forEach((el) => {
        el.picture = Config.apiUrl + '/uploads/profile/' + el.picture;
        this.activeManagers.push(el);
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
    if (this.activeEntity != null){
      const formData = new FormData();
      formData.append('file', this.formMenuImage);

      this.loadingFormMenu = true;
      this.apiService.postFile(Config.uploadImage, formData).subscribe((res1: Image) => {
        const data = this.formMenu.value;
        data.id = this.activeEntity.id;
        data.image = res1.name;
        this.entityService.createMenu(data).subscribe((res: Menu) => {
          this.loadingFormMenu = false;
          res.image = Config.apiUrl + '/uploads/profile/' + res.image;
          this.activeMenus.unshift(res);
          this.translateService.get('item created', {}).subscribe((value: string) => {
            this.constantService.updateGlobalStatus(value);
          });
          this.modalRef2.hide();

        }, (error) => {
          this.loadingFormMenu = false;
          if (error.error.message === undefined){
            this.formError2 = error.error;
          }
          else{
            this.formError2 = error.error.message;
          }
          console.log(error.error);

        }, () => {

        });


      }, (error) => {
        if (error.error.message === undefined){
          this.formError2 = error.error;
        }
        else{
          this.formError2 = error.error.message;
        }
        console.log(error.error);
        this.loadingFormMenu = false;
      }, () => {
      });
    }

  }

  editEntity() {
    this.loadingFormEdit = true;
    if (this.restaurantImageRealEdit === null){
      const data = this.formEntityEdit.value;
      data.id = this.activeEntity.id;
      this.entityService.updateEntity(data).subscribe((res: Entity) => {
        this.loadingFormEdit = false;

        const length = this.adminEntities.length;
        let index = null;
        for (let i = 0; i < length; i++){
          if (parseInt(this.adminEntities[i].id, 10) === parseInt(this.activeEntity.id, 10) ){
            index = i;
          }
        }
        if (index !== null){
          this.adminEntities.slice(index, index);
          this.adminEntities.splice(index, 0, res);
        }
        this.translateService.get('item updated', {}).subscribe((value: string) => {
          this.constantService.updateGlobalStatus(value);
        });

        this.modalRefEdit.hide();
        this.activeEntity = null;

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
        data.id = this.activeEntity.id;
        this.entityService.updateEntity(data).subscribe((res: Entity) => {
          this.loadingFormEdit = false;

          const length = this.adminEntities.length;
          let index = null;
          for (let i = 0; i < length; i++){
            if (parseInt(this.adminEntities[i].id, 10) === parseInt(this.activeEntity.id, 10) ){
              index = i;
            }
          }
          if (index !== null){
            this.adminEntities.slice(index, index);
            this.adminEntities.splice(index, 0, res);
          }
          this.translateService.get('item updated', {}).subscribe((value: string) => {
            this.constantService.updateGlobalStatus(value);
          });
          this.modalRefEdit.hide();
          this.activeEntity = null;

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

  editMenu() {

    if (this.activeMenu != null){
      this.loadingFormMenuEdit = true;
      if (this.formMenuImageEdit === null){
        const data = this.formMenuEdit.value;
        data.id = this.activeMenu.id;
        this.entityService.updateMenu(data).subscribe((res: Menu) => {
          this.loadingFormMenuEdit = false;
          res.image = Config.apiUrl + '/uploads/profile/' + res.image;

          const length = this.activeMenus.length;
          let index = null;
          for (let i = 0; i < length; i++){
            if (parseInt(this.activeMenus[i].id, 10) === parseInt(this.activeMenu.id, 10) ){
              index = i;
            }
          }
          if (index !== null){
            this.activeMenus.splice(index, 1, res);
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

            const length = this.activeMenus.length;
            let index = null;
            for (let i = 0; i < length; i++){
              if (parseInt(this.activeMenus[i].id, 10) === parseInt(this.activeMenu.id, 10) ){
                index = i;
              }
            }
            if (index !== null){
              this.activeMenus.splice(index, 1, res);
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
      this.activeManagers.forEach((e, index ) => {
        if (e.id === user.id){
          ind = index;
        }

      });
      if (ind !== null){
        this.activeManagers.splice(ind, 1);
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
    data.id = this.activeEntity.id;
    this.loadingFormManager = true;
    this.entityService.addManager(data).subscribe((res: User) => {
      this.loadingFormManager = false;
      res.picture = Config.apiUrl + '/uploads/profile/' + res.picture;
      this.activeManagers.push(res);

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

  getOrdersInit(){
    this.loadingMoreOrder = true;
    this.entityService.allEntityOrders({}).subscribe((res: Order[]) => {
      this.loading = false;
      this.orders = [];
      res.forEach((el) => {
        if (el.client !== null){
          el.image = Config.apiUrl + '/uploads/profile/' + el.client.picture;
        }
        else{
          el.image = Config.apiUrl + '/uploads/profile/' + 'man.png';
        }
        el.entity.global_info.image =  Config.apiUrl + '/uploads/profile/' + el.entity.global_info;
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
  getOrders(){
    this.loading = true;
    this.activeAdmin = 4;
    this.entityService.allEntityOrders({}).subscribe((res: Order[]) => {
      this.loading = false;
      this.orders = [];
      res.forEach((el) => {
        if (el.client !== null){
          el.image = Config.apiUrl + '/uploads/profile/' + el.client.picture;
        }
        else{
          el.image = Config.apiUrl + '/uploads/profile/' + 'man.png';
        }
        el.entity.global_info.image =  Config.apiUrl + '/uploads/profile/' + el.entity.global_info;
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

  addActivation() {
    const data = this.formActivation.value;
    this.loadingFormActivation = true;
    this.entityService.extendActivation(data).subscribe((res: Entity) => {
      this.loadingFormActivation = false;

      const length = this.adminEntities.length;
      let index = null;
      for (let i = 0; i < length; i++){
        if (this.adminEntities[i].id === res.id ){
          index = i;
        }
      }
      if (index !== null){
        this.adminEntities.slice(index, index);
        this.adminEntities.splice(index, 0, res);
      }
      this.translateService.get('item updated', {}).subscribe((value: string) => {
        this.constantService.updateGlobalStatus(value);
      });

      this.modalActivation.hide();

    }, (error) => {
      this.loadingFormActivation = false;
      if (error.error.message === undefined){
        this.formActivationError = error.error;
      }
      else{
        this.formActivationError = error.error.message;
      }
      console.log(error.error);

    }, () => {

    });
  }

  changeCanOrder(idR) {
    this.loading = true;
    this.entityService.changeEntityCanOrder({id: idR}).subscribe((res: Entity) => {
      this.loading = false;

      const length = this.adminEntities.length;
      let index = null;
      for (let i = 0; i < length; i++){
        if (parseInt(this.adminEntities[i].id, 10) === parseInt(idR, 10) ){
          index = i;
        }
      }
      if (index !== null){
        // this.adminEntities.slice(index, index);
        this.adminEntities.splice(index, 1, res);
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

  addAdvert() {
    const data = this.formAdvert.value;
    data.operation = 1;
    this.loadingFormAdvert = true;
    this.entityService.addFlashMessage(data).subscribe((res: Entity) => {
      this.loadingFormAdvert = false;

      const length = this.adminEntities.length;
      let index = null;
      for (let i = 0; i < length; i++){
        if (this.adminEntities[i].id === res.id ){
          index = i;
        }
      }
      if (index !== null){
        // this.adminEntities.slice(index, index);
        this.adminEntities.splice(index, 1, res);
      }
      this.translateService.get('item updated', {}).subscribe((value: string) => {
        this.constantService.updateGlobalStatus(value);
      });

      this.modalAdvert.hide();

    }, (error) => {
      this.loadingFormAdvert = false;
      if (error.error.message === undefined){
        this.formAdvertError = error.error;
      }
      else{
        this.formAdvertError = error.error.message;
      }
      console.log(error.error);

    }, () => {

    });

  }

  removeAdvert(idr) {
    const data = {id: idr, operation: 0, message: ''};
    this.loading = true;
    this.entityService.addFlashMessage(data).subscribe((res: Entity) => {
      this.loading = false;
      const length = this.adminEntities.length;
      let index = null;
      for (let i = 0; i < length; i++){
        if (this.adminEntities[i].id === res.id ){
          index = i;
        }
      }
      if (index !== null){
        // this.adminEntities.slice(index, index);
        this.adminEntities.splice(index, 1, res);
      }
      this.translateService.get('item updated', {}).subscribe((value: string) => {
        this.constantService.updateGlobalStatus(value);
      });


    }, (error) => {
      this.loadingFormAdvert = false;
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

  openModalTopManager(template: TemplateRef<any>) {
    this.formTopManager.reset();
    this.modalTopManager = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }

  addTopManager() {
    const data = this.formTopManager.value;
    this.loadingFormTopManager = true;
    this.entityService.addTopManager(data).subscribe((res: User) => {
      this.loadingFormTopManager = false;
      res.picture = Config.apiUrl + '/uploads/profile/' + res.picture;
      this.adminUsers.push(res);

      this.translateService.get('operation done', {}).subscribe((value: string) => {
        this.constantService.updateGlobalStatus(value);
      });

      this.modalTopManager.hide();

    }, (error) => {
      this.loadingFormTopManager = false;
      if (error.error.message === undefined){
        this.formTopManagerError = error.error;
      }
      else{
        this.formTopManagerError = error.error.message;
      }
      console.log(error.error);

    }, () => {

    });

  }

  chooseEntity() {
    this.getChoosenEntityName();
  }

  getChoosenEntityName(){
    this.entityListName.forEach((el) => {
      if (parseInt(el.value, 10) === parseInt(this.choosenEntity, 10)){
        this.choosenEntityName = el.title;
      }
    });
  }
}
