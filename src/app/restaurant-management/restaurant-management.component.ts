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

@Component({
  selector: 'app-restaurant-management',
  templateUrl: './restaurant-management.component.html',
  styleUrls: ['./restaurant-management.component.css']
})
export class RestaurantManagementComponent implements OnInit, OnDestroy {

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

    this.currentLangSubscription = this.constantService.currentLangSubject.subscribe((lang) => {
      this.currentLang = lang;

    }, (error) => {
      console.log(error);
    }, () => {

    });
  }

  get f1() { return this.formEntity.controls; }
  get f2() { return this.formMenu.controls; }

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

  getAdminEntitys(){
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
      res.base_categories.forEach((el) => {
        el.image = Config.apiUrl + '/uploads/profile/' + el.image;
        this.baseCategories.push(el);
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
    this.entityService.getManagerEntity({}).subscribe((res: User[]) => {
      this.loading = false;
      this.ownerManagers = [];
      res.forEach((el) => {
        el.image = Config.apiUrl + '/uploads/profile/' + el.image;
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
}
