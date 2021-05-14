import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {City} from '../schema/City';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Entity} from '../schema/Entity';
import {User} from '../schema/User';
import {Config} from '../config';
import {Order} from '../schema/Order';
import {BaseCategory} from '../schema/BaseCategory';
import {ConstantsService} from '../service/constants-service';
import {EntityService} from '../service/entity-service';
import {AuthService} from '../service/auth-service';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../service/api-service';
import {TranslateService} from '@ngx-translate/core';
import {UserService} from '../service/user-service';
import {Router} from '@angular/router';
import {Image} from '../schema/Image';

@Component({
  selector: 'app-top-manager-entity',
  templateUrl: './top-manager-entity.component.html',
  styleUrls: ['./top-manager-entity.component.css']
})
export class TopManagerEntityComponent implements OnInit, OnDestroy {
  globalAlertStatusSubscription: Subscription;
  globalAlertStatus = '';
  loading = true;
  isLogin: boolean;
  userType = null;
  alertStatus: boolean;
  alertMsg: string;
  formEntity: FormGroup;
  formActivation: FormGroup;
  cities: City[];
  loadingForm: boolean;
  loadingFormEdit: boolean;
  modalRefOrder: BsModalRef;
  modalActivation: BsModalRef;
  isLoginSubscription: Subscription;
  activeEntity: Entity;
  formError = '';
  formErrorEdit = '';
  entities: Entity[];
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
  formActivationError = '';
  imageEntityError = '';
  orders: Order[];
  loadingFormActivation = false;
  baseCategories: BaseCategory[];
  baseCategoriesToShow: BaseCategory[];
  baseCategoriesDrink: BaseCategory[];
  baseCategoriesLunch: BaseCategory[];
  showCategoryMenu = false;

  constructor(private constantService: ConstantsService, private entityService: EntityService,
              private authService: AuthService, private httpClient: HttpClient,  private fb: FormBuilder,
              private modalService: BsModalService, private apiService: ApiService,
              private translateService: TranslateService, private userService: UserService,
              private router: Router) {

    this.baseCategories = [];
    this.baseCategoriesDrink = [];
    this.baseCategoriesLunch = [];
    this.entities = [];
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
    this.formActivation = this.fb.group({
      id: ['', Validators.required],
      days: ['', Validators.required],
      amount: ['', Validators.required],
    });
    this.currentLangSubscription = this.constantService.currentLangSubject.subscribe((lang) => {
      this.currentLang = lang;

    }, (error) => {
      console.log(error);
    }, () => {

    });
  }

  get f1() { return this.formEntity.controls; }
  get f4() { return this.formActivation.controls; }

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
      console.log(error.error);

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

}
