import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {Subscription} from 'rxjs';
import {ConstantsService} from '../service/constants-service';
import {EntityService} from '../service/entity-service';
import {AuthService} from '../service/auth-service';
import {City} from '../schema/City';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
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
import {Router} from '@angular/router';
import {NightPharmacy} from '../schema/NightPharmacy';
import {AcceptedPayMode} from '../schema/AcceptedPayMode';
import {Product} from '../schema/Product';

@Component({
  selector: 'app-admin-manager',
  templateUrl: './admin-manager.component.html',
  styleUrls: ['./admin-manager.component.css']
})
export class AdminManagerComponent implements OnInit, OnDestroy {

  globalAlertStatusSubscription: Subscription;
  globalAlertStatus = '';
  loading = true;
  isLogin: boolean;
  userType = null;
  alertStatus: boolean;
  alertMsg: string;
  formEntity: FormGroup;
  formManager: FormGroup;
  formNewManager: FormGroup;
  formActivation: FormGroup;
  formTopManager: FormGroup;
  formNightPharmacy: FormGroup;
  formEditNightPharmacy: FormGroup;
  cities: City[];
  loadingForm: boolean;
  loadingFormEdit: boolean;
  modalManager: BsModalRef;
  modalRefOrder: BsModalRef;
  modalActivation: BsModalRef;
  modalTopManager: BsModalRef;
  modalNewManager: BsModalRef;
  modalEditNightPharmacy: BsModalRef;
  modalNewNightPharmacy: BsModalRef;
  isLoginSubscription: Subscription;
  activeEntity: Entity;
  formError = '';
  formErrorEdit = '';
  entities: Entity[];
  users: User[];
  managers: User[];
  topManagers: User[];
  currentLangSubscription: Subscription;
  currentLang: string;
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
  canLoadMore = false;
  loadingMore = false;
  imageEntityURL = '';
  entityImageReal = null;
  modalRef: BsModalRef;
  formManagerError = '';
  formNewManagerError = '';
  loadingFormManager = false;
  formActivationError = '';
  imageEntityError = '';
  orders: Order[];
  loadingFormActivation = false;
  loadingFormTopManager = false;
  loadingFormNewManager = false;
  formTopManagerError = '';
  baseCategories: BaseCategory[];
  baseCategoriesToShow: BaseCategory[];
  baseCategoriesDrink: BaseCategory[];
  baseCategoriesLunch: BaseCategory[];
  showCategoryMenu = false;
  nightPharmacies: NightPharmacy[];
  formNightPharmacyError = '';
  loadingFormNightPharmacy = false;
  openPharmacy: NightPharmacy;
  formEditNightPharmacyError = '';
  loadingFormEditNightPharmacy = false;
  configLinkPharmacy = Config.apiUrl + Config.getQrCodePharmacy;


  constructor(private constantService: ConstantsService, private entityService: EntityService,
              private authService: AuthService, private httpClient: HttpClient,  private fb: FormBuilder,
              private modalService: BsModalService, private apiService: ApiService,
              private translateService: TranslateService, private userService: UserService,
              private router: Router) {

    this.baseCategories = [];
    this.baseCategoriesDrink = [];
    this.baseCategoriesLunch = [];
    this.entities = [];
    this.users = [];
    this.managers = [];
    this.topManagers = [];
    this.orders = [];
    this.openPharmacy = null;
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
        this.userType = parseInt(localStorage.getItem('userType'), 10);
      }
      else{
        this.router.navigate(['']);
      }

    }, (error) => {
      console.log(error);
    }, () => {

    });

    this.formEntity = this.fb.group({
      name: ['', Validators.minLength(3)],
      description: ['', Validators.minLength(100)],
      facebook_page: [''],
      whatsapp_phone: [''],
      phone2: [''],
      phone1: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{9,}$')]],
      country_id: ['cm'],
      city: [''],
      street: ['', Validators.minLength(3)],
      street_detail: [''],
      img: ['', Validators.required],
      website: ['']
      // base_categories: ['', Validators.required],
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
    this.formTopManager = this.fb.group({
      user_email: ['', Validators.email],
      user_name: ['', Validators.minLength(3)],
      user_surname: [''],
      user_phone: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{9,}$')]],
      user_gender: ['1', Validators.required]
    });
    this.formNewManager = this.fb.group({
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

    this.formNightPharmacy = this.fb.group({
      town: ['', Validators.required],
    });
    this.formEditNightPharmacy = this.fb.group({
      town: ['', Validators.required],
      content: [''],
      image: [''],
      write_date: ['', Validators.required],
    });
  }

  get f1() { return this.formEntity.controls; }
  get f3() { return this.formManager.controls; }
  get f4() { return this.formActivation.controls; }
  get f6() { return this.formTopManager.controls; }
  get f7() { return this.formNewManager.controls; }
  get f8() { return this.formNightPharmacy.controls; }
  get f88() { return this.formEditNightPharmacy.controls; }

  ngOnInit(): void {
    this.currentLang = this.constantService.currentLang;
    this.httpClient.get('assets/city.json').subscribe((data: City[]) => {
      this.cities = data;
    });

    this.entityService.getAllBaseCategories().subscribe((res: BaseCategory[]) => {
      res.forEach((el) => {
        el.image = Config.apiUrl + '/uploads/profile/' + el.image;
        this.baseCategories.push(el);
        if (el.is_drink){
          this.baseCategoriesDrink.push(el);
        }

        if (el.is_fast_food){
          this.baseCategoriesLunch.push(el);
        }
      });

    }, (error) => {
      console.log(error.error);

    });

    this.alertStatus = false;
    this.alertMsg = '';
    this.activeDashboard = '';
    this.choosenEntityName = '';
    this.choosenEntity = '';
    this.loading = false;
  }

  ngOnDestroy(): void{
    if (this.globalAlertStatusSubscription) {this.globalAlertStatusSubscription.unsubscribe(); }
    if (this.isLoginSubscription) {this.isLoginSubscription.unsubscribe(); }
  }

  public openModal(template: TemplateRef<any>) {

    if ( parseInt(this.choosenEntity, 10) === 1){
      this.formEntity.addControl('base_categories', new FormControl('', Validators.required));
      this.baseCategoriesToShow = this.baseCategories;
      this.showCategoryMenu = true;
    }
    else if (parseInt(this.choosenEntity, 10) === 2){
      this.formEntity.addControl('base_categories', new FormControl('', Validators.required));
      this.baseCategoriesToShow = this.baseCategoriesLunch;
      this.showCategoryMenu = true;
    }
    else if (parseInt(this.choosenEntity, 10) === 3){
      this.formEntity.addControl('base_categories', new FormControl('', Validators.required));
      this.baseCategoriesToShow = this.baseCategoriesDrink;
      this.showCategoryMenu = true;
    }
    else{
      this.showCategoryMenu = false;
      this.formEntity.removeControl('base_categories');
      this.formEntity.addControl('base_categories', new FormControl(''));
    }
    this.formEntity.reset();
    this.imageEntityURL = '';
    this.formEntity.patchValue({
      img: ''
    });
    this.entityImageReal = null;
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }
  public openModalManager(template: TemplateRef<any>) {
    this.formManager.reset();
    this.formManagerError = '';
    this.modalManager = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }
  public openModalNewManager(template: TemplateRef<any>) {
    this.formNewManager.reset();
    this.formNewManagerError = '';
    this.modalNewManager = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }
  public openModalActivation(template: TemplateRef<any>, resto: Entity) {
    this.formActivation.reset();
    this.formActivationError = '';
    this.formActivation.patchValue({id: resto.id});
    this.modalActivation = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }

  resgisterEntity() {
    this.loadingForm = true;
    this.formError = '';


    const formData = new FormData();
    formData.append('file', this.entityImageReal);
    this.userService.uploadPicture(formData).subscribe((res1: Image) => {
      const data = this.formEntity.value;
      data.image = res1.name;
      data.entity_type = this.choosenEntity;
      this.entityService.registerEntityOwner(data).subscribe((res: Entity) => {
        this.loadingForm = false;
        res.global_info.image = Config.apiUrl + '/uploads/profile/' + res.global_info.image;
        this.entities.push(res);
        this.modalRef.hide();
        this.translateService.get('operation done', {}).subscribe((value: string) => {
          this.constantService.updateGlobalStatus(value);
        });

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
        this.entityImageReal = null;
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
        this.entityImageReal = file;
      }
    }
    else{
      this.imageEntityURL = '';
      this.formEntity.patchValue({
        img: ''
      });
      this.entityImageReal = null;
    }

  }

  getEntities(){
    this.loading = true;
    this.entityService.getUserEntities(this.choosenEntity).subscribe((res: Entity[]) => {
      this.loading = false;
      this.entities = res;
      if (res.length === this.entityService.limit){
        this.canLoadMore = true;
        this.entityService.offset = this.entityService.offset + this.entityService.limit;
      }
      else{
        this.canLoadMore = false;
      }

    }, (error) => {
      this.loading = false;
      if (error.error.message === undefined){
        this.constantService.updateGlobalStatus(error.error);
      }
      else{
        this.constantService.updateGlobalStatus(error.error.message);
      }
      // console.log(error.error);

    }, () => {

    });

  }

  getEntitiesMore(){
    this.loadingMore = true;
    this.entityService.getMoreEntities(this.choosenEntity).subscribe((res: Entity[]) => {
      this.loadingMore = false;
      res.forEach((el) => {
        this.entities.push(el);
      });
      if (res.length === this.entityService.limit){
        this.canLoadMore = true;
        this.entityService.offset = this.entityService.offset + this.entityService.limit;
      }
      else{
        this.canLoadMore = false;
      }

    }, (error) => {
      this.loadingMore = false;
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

  getUsers(){
    this.entities = [];
    this.choosenEntity = '';
    this.choosenEntityName = '';
    this.activeDashboard = 'users';
    this.loading = true;
    this.entityService.getAdminUser(true).subscribe((res: User[]) => {
      this.loading = false;
      this.users = [];
      res.forEach((el) => {
        el.picture = Config.apiUrl + '/uploads/profile/' + el.picture;
        this.users.push(el);
      });
      if (res.length === this.entityService.userLimit){
        this.canLoadMore = true;
      }
      else{
        this.canLoadMore = false;
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

  getUsersMore(){
    this.loadingMore = true;
    this.entityService.getAdminUser(false).subscribe((res: User[]) => {
      this.loadingMore = false;
      res.forEach((el) => {
        el.picture = Config.apiUrl + '/uploads/profile/' + el.picture;
        this.users.push(el);
      });
      if (res.length === this.entityService.userLimit){
        this.canLoadMore = true;
      }
      else{
        this.canLoadMore = false;
      }

    }, (error) => {
      this.loadingMore = false;
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
      this.managers.push(res);

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
    this.entities = [];
    this.choosenEntity = '';
    this.choosenEntityName = '';
    this.activeDashboard = 'orders';
    this.loadingMore = true;
    this.entityService.allEntityOrders(true).subscribe((res: Order[]) => {
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

  getOrdersMore(){
    this.loadingMore = true;
    this.entityService.allEntityOrders(false).subscribe((res: Order[]) => {
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
        const length = this.entities.length;
        let index = null;
        for (let i = 0; i < length; i++){
          if (this.entities[i].id === res.id ){
            index = i;
          }
        }
        if (index !== null){
          this.entities.splice(index, 1, res);
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

      const length = this.entities.length;
      let index = null;
      for (let i = 0; i < length; i++){
        if (parseInt(this.entities[i].id, 10) === parseInt(idR, 10) ){
          index = i;
        }
      }
      if (index !== null){
        // this.adminEntities.slice(index, index);
        this.entities.splice(index, 1, res);
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
      this.topManagers.push(res);

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

  addNewManager() {
    const data = this.formNewManager.value;
    this.loadingFormNewManager = true;
    this.entityService.registerManager(data).subscribe((res: User) => {
      this.loadingFormTopManager = false;
      res.picture = Config.apiUrl + '/uploads/profile/' + res.picture;
      this.managers.push(res);

      this.translateService.get('operation done', {}).subscribe((value: string) => {
        this.constantService.updateGlobalStatus(value);
      });

      this.modalNewManager.hide();

    }, (error) => {
      this.loadingFormNewManager = false;
      if (error.error.message === undefined){
        this.formNewManagerError = error.error;
      }
      else{
        this.formNewManagerError = error.error.message;
      }
      console.log(error.error);

    }, () => {

    });

  }

  chooseEntity() {
    this.getChoosenEntityName();
    this.getEntities();
  }

  number(nb){
    return parseInt(nb, 10);
  }

  getChoosenEntityName(){
    this.entityListName.forEach((el) => {
      if (parseInt(el.value, 10) === parseInt(this.choosenEntity, 10)){
          this.choosenEntityName = el.title;
        }
    });
  }

  getManagers(){
    this.entities = [];
    this.choosenEntity = '';
    this.choosenEntityName = '';
    this.activeDashboard = 'managers';
    this.loading = true;
    this.entityService.getAdminManagers(true).subscribe((res: User[]) => {
      this.loading = false;
      this.managers = [];
      res.forEach((el) => {
        el.picture = Config.apiUrl + '/uploads/profile/' + el.picture;
        this.managers.push(el);
      });
      if (res.length === this.entityService.userLimit){
        this.canLoadMore = true;
      }
      else{
        this.canLoadMore = false;
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

  getManagersMore(){
    this.loadingMore = true;
    this.entityService.getAdminManagers(false).subscribe((res: User[]) => {
      this.loadingMore = false;
      res.forEach((el) => {
        el.picture = Config.apiUrl + '/uploads/profile/' + el.picture;
        this.managers.push(el);
      });
      if (res.length === this.entityService.userLimit){
        this.canLoadMore = true;
      }
      else{
        this.canLoadMore = false;
      }

    }, (error) => {
      this.loadingMore = false;
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

  getTopManagers(){
    this.entities = [];
    this.choosenEntity = '';
    this.choosenEntityName = '';
    this.activeDashboard = 'top_managers';
    this.loading = true;
    this.entityService.getAdminTopManagers(true).subscribe((res: User[]) => {
      this.loading = false;
      this.topManagers = [];
      res.forEach((el) => {
        el.picture = Config.apiUrl + '/uploads/profile/' + el.picture;
        this.topManagers.push(el);
      });
      if (res.length === this.entityService.userLimit){
        this.canLoadMore = true;
      }
      else{
        this.canLoadMore = false;
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

  getTopManagersMore(){
    this.loadingMore = true;
    this.entityService.getAdminTopManagers(false).subscribe((res: User[]) => {
      this.loadingMore = false;
      res.forEach((el) => {
        el.picture = Config.apiUrl + '/uploads/profile/' + el.picture;
        this.topManagers.push(el);
      });
      if (res.length === this.entityService.userLimit){
        this.canLoadMore = true;
      }
      else{
        this.canLoadMore = false;
      }

    }, (error) => {
      this.loadingMore = false;
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

  changeUserStatus(id){
    this.loading = true;
    this.entityService.changeUserStatus({id}).subscribe((res: User) => {
      this.loading = false;
      let length = 0;
      let tab = [];
      res.picture = Config.apiUrl + '/uploads/profile/' + res.picture;
      if (res.type === 1){
         length = this.topManagers.length;
         tab = this.topManagers;
      }
      else if (res.type === 11){
         length = this.managers.length;
         tab = this.managers;
      }else{
         length = this.users.length;
         tab = this.users;
      }


      let index = null;
      for (let i = 0; i < length; i++){
        if (parseInt(tab[i].id, 10) === parseInt(id, 10) ){
          index = i;
        }
      }
      if (index !== null){
        tab.splice(index, 1, res);
      }

      if (res.type === 1){
        this.topManagers = tab;
      }
      else if (res.type === 11){
        this.managers = tab;
      }else{
        this.users = tab;
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
    }, () => {

    });
  }

  changeEntityStatus(ent: Entity, stat) {
    this.loading = true;
    this.entityService.changeEntityStatus({id: ent.id, status: stat}).subscribe((res: Entity) => {
      this.loading = false;
      const length = this.entities.length;
      let index = null;
      for (let i = 0; i < length; i++){
        if (this.entities[i].id === res.id ){
          index = i;
        }
      }
      if (index !== null){
        this.entities.splice(index, 1, res);
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

  getNightPharmacy() {
    this.nightPharmacies = [];
    this.activeDashboard = 'night_pharmacy';
    this.loading = true;
    this.entityService.listPharmacyNight({}).subscribe((res: NightPharmacy[]) => {
      this.loading = false;
      this.nightPharmacies = res;

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

  openModalNightPharmacy(template: TemplateRef<any>) {
    this.formNightPharmacy.reset();
    this.formNightPharmacyError = '';
    this.modalNewNightPharmacy = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }

  addNightPharmacy() {
    const data = this.formNightPharmacy.value;
    this.loadingFormNightPharmacy = true;
    this.entityService.addPharmacyNight(data).subscribe((res: NightPharmacy) => {
      this.loadingFormNightPharmacy = false;
      this.nightPharmacies.push(res);

      this.translateService.get('operation done', {}).subscribe((value: string) => {
        this.constantService.updateGlobalStatus(value);
      });

      this.modalNewNightPharmacy.hide();

    }, (error) => {
      this.loadingFormNightPharmacy = false;
      if (error.error.message === undefined){
        this.formNightPharmacyError = error.error;
      }
      else{
        this.formNightPharmacyError = error.error.message;
      }
      console.log(error.error);

    }, () => {

    });
  }

  openModalEditNightPharmacy(template: TemplateRef<any>, pay: NightPharmacy) {
    this.openPharmacy = pay;
    this.formEditNightPharmacy.reset();
    this.formEditNightPharmacyError = '';
    this.formEditNightPharmacy.patchValue({
      town: pay.name,
      content: pay.content
    });
    this.modalEditNightPharmacy = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }

  editNightPharmacy() {
    const data = this.formEditNightPharmacy.value;
    data.id = this.openPharmacy.id;
    this.loadingFormEditNightPharmacy = true;
    this.entityService.updatePharmacyNight(data).subscribe((res: NightPharmacy) => {
      this.loadingFormEditNightPharmacy = false;

      let index = -1;
      let remove = 0;
      this.nightPharmacies.forEach((el) => {
        index = index + 1;
        if (parseInt(el.id, 10) === parseInt(this.openPharmacy.id, 10)){
          remove = index;
        }
      });
      this.nightPharmacies.splice(remove, 1, res);

      this.translateService.get('operation done', {}).subscribe((value: string) => {
        this.constantService.updateGlobalStatus(value);
      });

      this.modalEditNightPharmacy.hide();

    }, (error) => {
      this.loadingFormEditNightPharmacy = false;
      if (error.error.message === undefined){
        this.formEditNightPharmacyError = error.error;
      }
      else{
        this.formEditNightPharmacyError = error.error.message;
      }
      console.log(error.error);

    }, () => {

    });
  }

  deleteNightPharmacy(idR){
    this.loading = true;
    this.entityService.deletePharmacyNight({id: idR}).subscribe((res: string) => {
      this.loading = false;
      let index = -1;
      let remove = 0;
      this.nightPharmacies.forEach((el) => {
        index = index + 1;
        if (parseInt(el.id, 10) === parseInt(idR, 10)){
          remove = index;
        }
      });
      this.nightPharmacies.splice(remove, 1);
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
