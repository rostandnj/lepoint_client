import {Component, OnInit, TemplateRef} from '@angular/core';
import {ConstantsService} from '../service/constants-service';
import {EntityService} from '../service/entity-service';
import {AuthService} from '../service/auth-service';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BsModalService} from 'ngx-bootstrap/modal';
import {ApiService} from '../service/api-service';
import {TranslateService} from '@ngx-translate/core';
import {UserService} from '../service/user-service';
import {Router} from '@angular/router';
import {Menu} from '../schema/Menu';
import {Product} from '../schema/Product';
import {User} from '../schema/User';
import {Order} from '../schema/Order';
import {Advert} from '../schema/Advert';
import {Subscription} from 'rxjs';
import {City} from '../schema/City';
import {BaseCategory} from '../schema/BaseCategory';
import {Config} from '../config';
import {EntityDetail} from '../schema/EntityDetail';
import {Entity} from '../schema/Entity';
import {MenuCategory} from '../schema/MenuCategory';
import {Image} from '../schema/Image';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {PayMode} from '../schema/PayMode';
import {AcceptedPayMode} from '../schema/AcceptedPayMode';

@Component({
  selector: 'app-manage-entity',
  templateUrl: './manage-entity.component.html',
  styleUrls: ['./manage-entity.component.css']
})
export class ManageEntityComponent implements OnInit {
  configLink = Config.apiUrl + Config.getQrCode;
  configLinkAdvert = Config.apiUrl + Config.getQrCodeAdvert;
  globalAlertStatusSubscription: Subscription;
  isLoginSubscription: Subscription;
  currentLangSubscription: Subscription;
  currentLang: string;
  globalAlertStatus = '';
  loading = true;
  isLogin: boolean;
  userType = null;
  alertStatus: boolean;
  alertMsg: string;
  menus: Menu[];
  products: Product[];
  managers: User[];
  orders: Order[];
  ads: Advert[];
  cities: City[];
  baseCategories: BaseCategory[];
  baseCategoriesToShow: BaseCategory[];
  baseCategoriesDrink: BaseCategory[];
  baseCategoriesLunch: BaseCategory[];
  menuCategories: MenuCategory[];
  showCategoryMenu = false;
  entity: Entity;
  images: Image[];
  activeTab: string;
  formEntityEdit: FormGroup;
  imageEntityURLEdit = '';
  entityImageRealEdit = null;
  modalRefEdit: BsModalRef;
  modalMenuEdit: BsModalRef;
  modalAddMenu: BsModalRef;
  modalRefOrder: BsModalRef;
  modalAddAdvert: BsModalRef;
  modalEditAdvert: BsModalRef;
  modalAddProduct: BsModalRef;
  modalProductEdit: BsModalRef;
  modalManager: BsModalRef;
  modalTopManager: BsModalRef;
  modalShowTopManager: BsModalRef;
  modalAddPay: BsModalRef;
  modalEditPay: BsModalRef;
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
  entityWithMenu = [1, 2, 3];
  entityWithProduct = [7];
  imageEntityError = '';
  formError = '';
  loadingForm = false;
  modalFlashMessage: BsModalRef;
  formFlashMessage: FormGroup;
  formFlashMessageError = '';
  loadingFormFlashMessage = false;
  formMenu: FormGroup;
  formMenuEdit: FormGroup;
  formAdvert: FormGroup;
  formAdvertEdit: FormGroup;
  formProduct: FormGroup;
  formProductEdit: FormGroup;
  formManager: FormGroup;
  formTopManager: FormGroup;
  formAddPay: FormGroup;
  formEditPay: FormGroup;
  loadingFormMenu = false;
  loadingFormMenuEdit = false;
  formMenuImage: File;
  formProductImage: File;
  formMenuImageEdit: File;
  imageMenuURL = '';
  imageMenuError = '';
  imageMenuURLEdit = '';
  imageMenuErrorEdit = '';
  activeMenu: Menu;
  formError2Edit = '';
  formError2 = '';
  openOrder: Order;
  canLoadMoreOrder = false;
  itemLimit = 20;
  orderLastOffset = 0;
  adsLastOffset = 0;
  showExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.jpg'];
  showExtensions2 = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/pjpg'];
  uploadDir = Config.apiUrl + '/uploads/profile/';
  canLoadMoreAdvert = false;
  loadingFormAdvert = false;
  loadingFormAdvertEdit = false;
  formAdvertError = '';
  formAdvertEditError = '';
  imageAdvertError = '';
  imageAdvertEditError = '';
  imageAdvertURL = '';
  imageAdvertEditURL = '';
  formAdvertFile = null;
  formAdvertEditFile = null;
  openAdvert: Advert;
  advertFileIsclear = false;
  advertFileEditIsclear = false;
  imageProductURL = '';
  imageProductError = '';
  formProductError = '';
  loadingFormProduct = false;
  openProduct: Product;
  loadingFormProductEdit = false;
  formProductImageEdit = null;
  imageProductURLEdit = '';
  formProductEditError = '';
  imageProductEditURL = '';
  imageProductEditError = '';
  formProductEditImage = null;
  formManagerError = '';
  loadingFormManager = false;
  formTopManagerError = '';
  loadingFormTopManager = false;
  formAddPayError = '';
  formEditPayError = '';
  payModes: PayMode[];
  payModesToShow: PayMode[];
  loadingFormAddPay = false;
  loadingFormEditPay = false;
  openPay: AcceptedPayMode;

  constructor(private constantService: ConstantsService, private entityService: EntityService,
              private authService: AuthService, private httpClient: HttpClient,  private fb: FormBuilder,
              private modalService: BsModalService, private apiService: ApiService,
              private translateService: TranslateService, private userService: UserService,
              private router: Router) {
    this.activeMenu = null;
    this.openPay = null;
    this.openProduct = null;
    this.openOrder = null;
    this.openAdvert = null;
    this.activeTab = '';
    this.entity = null;
    this.menuCategories = [];
    this.menus = [];
    this.products = [];
    this.managers = [];
    this.orders = [];
    this.ads = [];
    this.cities = [];
    this.baseCategories = [];
    this.baseCategoriesDrink = [];
    this.baseCategoriesLunch = [];
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

    this.currentLangSubscription = this.constantService.currentLangSubject.subscribe((lang) => {
      this.currentLang = lang;

    }, (error) => {
      console.log(error);
    }, () => {

    });

    this.formEntityEdit = this.fb.group({
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
      img: [''],
      website: ['']
      // base_categories: ['', Validators.required],
    });
    this.formFlashMessage = this.fb.group({
      id: ['', Validators.required],
      message: [''],
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

    this.formAdvert = this.fb.group({
      title: ['', Validators.minLength(3)],
      content: ['', Validators.minLength(3)],
      file: ['']
    });

    this.formAdvertEdit = this.fb.group({
      title: ['', Validators.minLength(3)],
      content: ['', Validators.minLength(3)],
      file: ['']
    });
    this.formProduct = this.fb.group({
      name: ['', Validators.minLength(3)],
      description: ['', Validators.minLength(3)],
      price: ['', Validators.minLength(1)],
      image: ['', Validators.required],
      availability: [true],
    });
    this.formProductEdit = this.fb.group({
      name: ['', Validators.minLength(3)],
      description: ['', Validators.minLength(3)],
      price: ['', Validators.minLength(1)],
      image: [''],
      availability: [true],
    });
    this.formManager = this.fb.group({
      email: ['', Validators.email],
      type: ['12', Validators.required],
    });
    this.formTopManager = this.fb.group({
      email: ['', Validators.email],
      type: ['1', Validators.required],
    });
    this.formAddPay = this.fb.group({
      pay_mode: ['', Validators.required],
      detail_one: ['', Validators.required],
      detail_two: [''],
    });
    this.formEditPay = this.fb.group({
      pay_mode: ['', Validators.required],
      detail_one: ['', Validators.required],
      detail_two: [''],
    });
  }

  get f1() { return this.formEntityEdit.controls; }
  get f2() { return this.formFlashMessage.controls; }
  get f22() { return this.formMenuEdit.controls; }
  get f3() { return this.formMenu.controls; }
  get f4() { return this.formAdvert.controls; }
  get f44() { return this.formAdvertEdit.controls; }
  get f5() { return this.formProduct.controls; }
  get f55() { return this.formProductEdit.controls; }
  get f6() { return this.formManager.controls; }
  get f66() { return this.formTopManager.controls; }
  get f7() { return this.formAddPay.controls; }
  get f77() { return this.formEditPay.controls; }

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
    const tab = this.router.url.split('-');
    const l = tab.length;
    let idEntity = 0;
    if (l > 0){
      idEntity = parseInt(tab[l - 1], 10);
    }

    this.entityService.getOneEntity({id: idEntity}).subscribe((res: EntityDetail) => {
      this.entity = res.entity;
      if (this.entity.owner != null){
        this.entity.owner.picture = Config.apiUrl + '/uploads/profile/' + this.entity.owner.picture;
      }

      if (this.entity.top_manager != null){
        this.entity.top_manager.picture = Config.apiUrl + '/uploads/profile/' + this.entity.top_manager.picture;
      }
      this.entityListName.forEach((el) => {
        if (parseInt(el.value, 10) === parseInt(this.entity.type, 10)){
          this.choosenEntityName = el.title;
        }
      });
      this.entity.global_info.image =  Config.apiUrl + '/uploads/profile/' + this.entity.global_info.image;

      res.categories.forEach((el) => {
        el.base_category.image = Config.apiUrl + '/uploads/profile/' +  el.base_category.image;
        this.menuCategories.push(el);
      });

      res.images.forEach((el) => {
        el.path = Config.apiUrl + '/uploads/profile/' +  el.path;
        this.images.push(el);
      });

      res.adverts.forEach((el) => {
        if (el.file !==  null){
          if (this.showExtensions2.includes(el.file.extension)){
            el.file.path = Config.apiUrl + '/uploads/profile/' +  el.file.path;
          }
          else{
            el.file.path = Config.apiUrl + '/uploads/' +  el.file.path;
          }

        }
        this.ads.push(el);
      });

      if (this.ads.length === this.itemLimit){
        this.canLoadMoreAdvert = true;
        this.adsLastOffset = this.adsLastOffset + this.itemLimit;
      }
      else{
        this.canLoadMoreAdvert = false;
      }

      res.menus.forEach((el) => {
        el.image = Config.apiUrl + '/uploads/profile/' +  el.image;
        this.menus.push(el);
      });

      res.products.forEach((el) => {
        el.image = Config.apiUrl + '/uploads/profile/' +  el.image;
        this.products.push(el);
      });

      this.loading = false;

    }, (error) => {
      this.loading = false;
      console.log(error.error);
      this.constantService.updateGlobalStatus(error.error?.message);

    });

    this.entityService.listPayMode({}).subscribe((res: PayMode[]) => {
      this.payModes = res;

    }, (error) => {
      console.log(error.error);

    });


  }

  showMainPage(){
    this.activeTab = '';
  }

  openModalEdit(template: TemplateRef<any>) {
    this.formEntityEdit.reset();
    this.imageEntityURLEdit = '';
    this.entityImageRealEdit = null;
    this.formError = '';

    if ( parseInt(this.entity.type, 10) === 1){
      this.formEntityEdit.addControl('base_categories', new FormControl('', Validators.required));
      this.baseCategoriesToShow = this.baseCategories;
      this.showCategoryMenu = true;
    }
    else if (parseInt(this.entity.type, 10) === 2){
      this.formEntityEdit.addControl('base_categories', new FormControl('', Validators.required));
      this.baseCategoriesToShow = this.baseCategoriesLunch;
      this.showCategoryMenu = true;
    }
    else if (parseInt(this.entity.type, 10) === 3){
      this.formEntityEdit.addControl('base_categories', new FormControl('', Validators.required));
      this.baseCategoriesToShow = this.baseCategoriesDrink;
      this.showCategoryMenu = true;
    }
    else{
      this.showCategoryMenu = false;
      this.formEntityEdit.removeControl('base_categories');
      this.formEntityEdit.addControl('base_categories', new FormControl(''));
    }

    if (this.showCategoryMenu){
      const ids = [];
      this.menuCategories.forEach((el) => {
        ids.push(el.base_category.id.toString());
      });
      this.formEntityEdit.patchValue({
        name: this.entity.global_info.name,
        description: this.entity.global_info.description,
        facebook_page: this.entity.global_info.facebook_page,
        whatsapp_phone: this.entity.global_info.whatsapp_phone,
        phone2: this.entity.global_info.phone2,
        phone1: this.entity.global_info.phone1,
        website: this.entity.global_info.website,
        country_id: this.entity.location.country.code,
        city: this.entity.location.city,
        street: this.entity.location.street,
        street_detail: this.entity.location.street_detail,
        img: null,
        base_categories: ids
      });
    }else{
      this.formEntityEdit.patchValue({
        name: this.entity.global_info.name,
        description: this.entity.global_info.description,
        facebook_page: this.entity.global_info.facebook_page,
        whatsapp_phone: this.entity.global_info.whatsapp_phone,
        phone2: this.entity.global_info.phone2,
        phone1: this.entity.global_info.phone1,
        website: this.entity.global_info.website,
        country_id: this.entity.location.country.code,
        city: this.entity.location.city,
        street: this.entity.location.street,
        street_detail: this.entity.location.street_detail,
        img: null
      });
    }

    this.imageEntityURLEdit =  this.entity.global_info.image;
    this.modalRefEdit = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }

  showPreview(event) {
    this.imageEntityError = '';
    this.imageEntityURLEdit = '';
    const file = (event.target as HTMLInputElement).files[0];
    if (file !== undefined){
      const size = parseFloat((file.size / 1000 / 1000).toFixed(2));
      if (size > 2){
        this.imageEntityError = 'error';
        this.entityImageRealEdit = null;
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
        this.entityImageRealEdit = file;
      }
    }
    else{
      this.imageEntityURLEdit = '';
      this.formEntityEdit.patchValue({
        img: ''
      });
      this.entityImageRealEdit = null;
    }

  }

  updateEntity() {
    this.loadingForm = true;
    this.formError = '';

    if (this.entityImageRealEdit === null){
      const data = this.formEntityEdit.value;
      data.id = this.entity.id;
      this.entityService.updateEntity(data).subscribe((res: EntityDetail) => {
        this.loadingForm = false;
        res.entity.global_info.image = Config.apiUrl + '/uploads/profile/' + res.entity.global_info.image;
        this.entity = res.entity;
        this.menuCategories = [];

        res.categories.forEach((el) => {
          el.base_category.image = Config.apiUrl + '/uploads/profile/' +  el.base_category.image;
          this.menuCategories.push(el);
        });

        this.modalRefEdit.hide();
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
    }else{

      const formData = new FormData();
      formData.append('file', this.entityImageRealEdit);
      this.userService.uploadPicture(formData).subscribe((res1: Image) => {
        const data = this.formEntityEdit.value;
        data.id = this.entity.id;
        data.image = res1.name;
        this.entityService.updateEntity(data).subscribe((res: EntityDetail) => {
          this.loadingForm = false;
          res.entity.global_info.image = Config.apiUrl + '/uploads/profile/' + res.entity.global_info.image;
          this.entity = res.entity;
          this.menuCategories = [];

          res.categories.forEach((el) => {
            el.base_category.image = Config.apiUrl + '/uploads/profile/' +  el.base_category.image;
            this.menuCategories.push(el);
          });

          this.modalRefEdit.hide();
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
  }

  number(nb){
    return parseInt(nb, 10);
  }

  changeCanOrder(idR) {
    this.loading = true;
    this.entityService.changeEntityCanOrder({id: idR}).subscribe((res: Entity) => {
      this.loading = false;
      res.global_info.image = Config.apiUrl + '/uploads/profile/' + res.global_info.image;

      this.entity = res;

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

  openModalFlashMessage(template: TemplateRef<any>){
    this.formFlashMessage.reset();
    this.formFlashMessageError = '';
    this.formFlashMessage.patchValue({id: this.entity.id, message: this.entity.flash_message});
    this.modalFlashMessage = this.modalService.show(template, Object.assign({}, { class: 'login' }));

  }

  updateFlashMessage() {
    this.formFlashMessageError = '';
    this.loadingFormFlashMessage = true;
    this.entityService.addFlashMessage(this.formFlashMessage.value).subscribe((res: Entity) => {
      this.loadingFormFlashMessage = false;
      res.global_info.image = Config.apiUrl + '/uploads/profile/' + res.global_info.image;

      this.entity = res;

      this.translateService.get('item updated', {}).subscribe((value: string) => {
        this.constantService.updateGlobalStatus(value);
      });
      this.modalFlashMessage.hide();

    }, (error) => {
      this.loadingFormFlashMessage = false;
      if (error.error.message === undefined){
        this.formFlashMessageError = error.error;
      }
      else{
        this.formFlashMessageError = error.error.message;
      }
      console.log(error.error);

    }, () => {

    });

  }

  openModalFormMenuEdit(template: TemplateRef<any>, menu: Menu) {
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
    this.modalMenuEdit = this.modalService.show(template, Object.assign({}, { class: 'login' }));
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

  editMenu() {

    if (this.activeMenu != null){
      this.loadingFormMenuEdit = true;
      if (this.formMenuImageEdit === null){
        const data = this.formMenuEdit.value;
        data.id = this.activeMenu.id;
        this.entityService.updateMenu(data).subscribe((res: Menu) => {
          this.loadingFormMenuEdit = false;
          res.image = Config.apiUrl + '/uploads/profile/' + res.image;

          const length = this.menus.length;
          let index = null;
          for (let i = 0; i < length; i++){
            if (parseInt(this.menus[i].id, 10) === parseInt(this.activeMenu.id, 10) ){
              index = i;
            }
          }
          if (index !== null){
            this.menus.splice(index, 1, res);
          }

          this.translateService.get('item updated', {}).subscribe((value: string) => {
            this.constantService.updateGlobalStatus(value);
          });
          this.activeMenu = null;
          this.modalMenuEdit.hide();

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

            const length = this.menus.length;
            let index = null;
            for (let i = 0; i < length; i++){
              if (parseInt(this.menus[i].id, 10) === parseInt(this.activeMenu.id, 10) ){
                index = i;
              }
            }
            if (index !== null){
              this.menus.splice(index, 1, res);
            }

            this.translateService.get('item updated', {}).subscribe((value: string) => {
              this.constantService.updateGlobalStatus(value);
            });
            this.activeMenu = null;
            this.modalMenuEdit.hide();

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
            this.formError2Edit = error.error;
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

  addMenu(){
    const formData = new FormData();
    formData.append('file', this.formMenuImage);

    this.loadingFormMenu = true;
    this.apiService.postFile(Config.uploadImage, formData).subscribe((res1: Image) => {
        const data = this.formMenu.value;
        data.id = this.entity.id;
        data.image = res1.name;
        this.entityService.createMenu(data).subscribe((res: Menu) => {
          this.loadingFormMenu = false;
          res.image = Config.apiUrl + '/uploads/profile/' + res.image;
          this.menus.unshift(res);
          this.translateService.get('item created', {}).subscribe((value: string) => {
            this.constantService.updateGlobalStatus(value);
          });
          this.modalAddMenu.hide();

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

  openModalAddMenu(template: TemplateRef<any>){
    this.formMenu.reset();
    this.formError2 = '';
    this.modalAddMenu = this.modalService.show(template, Object.assign({}, { class: 'login' }));

  }

  showTab(name: string){
    this.activeTab = name;
    if (name === 'order'){
      this.entityService.entityOrders({id: this.entity.id}).subscribe((res: Order[]) => {
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

        if (this.orders.length === this.itemLimit){
          this.canLoadMoreOrder = true;
          this.orderLastOffset = this.orderLastOffset + this.itemLimit;
        }
        else{
          this.canLoadMoreOrder = false;
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
    if (name === 'manager'){
      this.getEntityManagers();
    }
  }

  deleteMenu(idR){
    this.loading = true;
    this.entityService.deleteMenuEntity({id: idR}).subscribe((res: Menu) => {
      this.loading = false;
      let index = -1;
      let remove = 0;
      this.menus.forEach((el) => {
        index = index + 1;
        if (parseInt(el.id, 10) === parseInt(idR, 10)){
         remove = index;
        }
      });
      this.menus.splice(remove, 1);
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

  showOrder(template: TemplateRef<any>, order: Order){
    this.openOrder = order;
    this.modalRefOrder = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }

  getOrdersMore(){
    this.loading = true;
    this.entityService.entityOrders({id: this.entity.id, limit: this.itemLimit, offset: this.orderLastOffset}).subscribe((res: Order[]) => {
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

      if (this.orders.length === this.itemLimit){
        this.canLoadMoreOrder = true;
        this.orderLastOffset = this.orderLastOffset + this.itemLimit;
      }
      else{
        this.canLoadMoreOrder = false;
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

  getMoreAdvert() {
    this.loading = true;
    this.entityService.listAdvert({id: this.entity.id, limit: this.itemLimit, offset: this.adsLastOffset}).subscribe((res: Advert[]) => {
      this.loading = false;
      res.forEach((el) => {
        if (el.file !==  null){
          el.file.path = Config.apiUrl + '/uploads/profile/' +  el.file.path;
        }
        this.ads.push(el);
      });

      if (this.ads.length === this.itemLimit){
        this.canLoadMoreAdvert = true;
        this.adsLastOffset = this.adsLastOffset + this.itemLimit;
      }
      else{
        this.canLoadMoreAdvert = false;
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

  openModalAdvert(template: TemplateRef<any>){
    this.formAdvert.reset();
    this.formAdvertError = '';
    this.formAdvertFile = null;
    this.imageAdvertURL = '';
    this.advertFileIsclear = false;
    this.modalAddAdvert = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }

  addAdvert() {
    this.loadingFormAdvert = true;
    if (this.formAdvertFile === null){
      const data = this.formAdvert.value;
      data.entity_id = this.entity.id;
      data.file = null;
      this.entityService.addAdvert(data).subscribe((res: Advert) => {
        this.loadingFormAdvert = false;
        if (res.file !==  null){
          if (this.showExtensions2.includes(res.file.extension)){
            res.file.path = Config.apiUrl + '/uploads/profile/' +  res.file.path;
          }
          else{
            res.file.path = Config.apiUrl + '/uploads/' +  res.file.path;
          }
        }

        this.ads.unshift(res);

        this.translateService.get('item updated', {}).subscribe((value: string) => {
          this.constantService.updateGlobalStatus(value);
        });
        this.modalAddAdvert.hide();

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
    else{
      const formData = new FormData();
      formData.append('file', this.formAdvertFile);
      this.apiService.postFile(Config.uploadImage, formData).subscribe((res1: Image) => {
        const data = this.formAdvert.value;
        data.file = res1;
        data.entity_id = this.entity.id;
        this.entityService.addAdvert(data).subscribe((res: Advert) => {
          this.loadingFormAdvert = false;
          if (res.file !==  null){
            res.file.path = Config.apiUrl + '/uploads/profile/' +  res.file.path;
          }

          this.ads.unshift(res);

          this.translateService.get('item updated', {}).subscribe((value: string) => {
            this.constantService.updateGlobalStatus(value);
          });
          this.modalAddAdvert.hide();

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


      }, (error) => {
        if (error.error.message === undefined){
          this.formAdvertError = error.error;
        }
        else{
          this.formAdvertError = error.error.message;
        }
        console.log(error.error);
        this.loadingFormAdvert = false;
      }, () => {
      });

    }
  }

  showPreviewAdvertFile($event: Event) {
    this.imageAdvertError = '';
    this.imageAdvertURL = '';
    const file = (event.target as HTMLInputElement).files[0];
    if (file !== undefined){
      const size = parseFloat((file.size / 1000 / 1000).toFixed(2));
      if (size > 2){
        this.imageAdvertError = 'error';
        this.formAdvertFile = null;
        this.formAdvert.patchValue({
          file: null
        });
      }
      else{
        this.formAdvert.patchValue({
          file: file.name
        });
        this.advertFileIsclear = false;

        // File Preview
        const reader = new FileReader();
        reader.onload = () => {
          this.imageAdvertURL = reader.result as string;
        };
        reader.readAsDataURL(file);
        this.formAdvertFile = file;
      }
    }
    else{
      this.imageAdvertURL = '';
      this.formAdvert.patchValue({
        file: ''
      });
      this.formAdvertFile = null;
    }

  }

  openModalFormAdvertEdit(template: TemplateRef<any>, adv: Advert) {
    this.openAdvert = adv;
    this.formAdvertEdit.reset();
    this.formAdvertEditFile = null;
    this.imageAdvertEditURL = '';
    this.formAdvertEditError = '';
    this.advertFileEditIsclear = false;

    this.formAdvertEdit.patchValue({
      title: adv.title,
      content: adv.content,
      file: null,
    });
    if (adv.file !== null){
      if (this.showExtensions2.includes(adv.file.extension)){
        this.imageAdvertEditURL = adv.file.path;
      }
    }

    this.modalEditAdvert = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }

  showPreviewAdvertFileEdit($event: Event) {
    this.imageAdvertEditError = '';
    this.imageAdvertEditURL = '';
    const file = (event.target as HTMLInputElement).files[0];
    if (file !== undefined){
      const size = parseFloat((file.size / 1000 / 1000).toFixed(2));
      if (size > 2){
        this.imageAdvertEditError = 'error';
        this.formAdvertEditFile = null;
        this.formAdvertEdit.patchValue({
          file: null
        });
      }
      else{
        this.formAdvertEdit.patchValue({
          file: file.name
        });

        this.advertFileEditIsclear = false;

        // File Preview
        const reader = new FileReader();
        reader.onload = () => {
          this.imageAdvertEditURL = reader.result as string;
        };
        reader.readAsDataURL(file);
        this.formAdvertEditFile = file;
      }
    }
    else{
      this.imageAdvertEditURL = '';
      this.formAdvertEdit.patchValue({
        file: ''
      });
      this.formAdvertEditFile = null;
    }

  }

  updateAdvert(){
    this.loadingFormAdvertEdit = true;
    if (this.formAdvertEditFile === null){
      const data = this.formAdvertEdit.value;
      data.id = this.openAdvert.id;
      data.file = null;
      this.entityService.updateAdvert(data).subscribe((res: Advert) => {
        this.loadingFormAdvertEdit = false;
        if (res.file !==  null){
          if (this.showExtensions2.includes(res.file.extension)){
            res.file.path = Config.apiUrl + '/uploads/profile/' +  res.file.path;
          }
          else{
            res.file.path = Config.apiUrl + '/uploads/' +  res.file.path;
          }
        }

        const length = this.ads.length;
        let index = null;
        for (let i = 0; i < length; i++){
          if (parseInt(this.ads[i].id, 10) === parseInt(this.openAdvert.id, 10) ){
            index = i;
          }
        }
        if (index !== null){
          this.ads.splice(index, 1, res);
        }

        this.translateService.get('item updated', {}).subscribe((value: string) => {
          this.constantService.updateGlobalStatus(value);
        });
        this.modalEditAdvert.hide();

      }, (error) => {
        this.loadingFormAdvertEdit = false;
        if (error.error.message === undefined){
          this.formAdvertEditError = error.error;
        }
        else{
          this.formAdvertEditError = error.error.message;
        }
        console.log(error.error);

      }, () => {

      });
    }
    else{
      const formData = new FormData();
      formData.append('file', this.formAdvertEditFile);
      this.apiService.postFile(Config.uploadImage, formData).subscribe((res1: Image) => {
        const data = this.formAdvertEdit.value;
        data.file = res1;
        data.id = this.openAdvert.id;
        this.entityService.updateAdvert(data).subscribe((res: Advert) => {
          this.loadingFormAdvertEdit = false;
          if (res.file !==  null){
            if (this.showExtensions2.includes(res.file.extension)){
              res.file.path = Config.apiUrl + '/uploads/profile/' +  res.file.path;
            }
            else{
              res.file.path = Config.apiUrl + '/uploads/' +  res.file.path;
            }
          }

          const length = this.ads.length;
          let index = null;
          for (let i = 0; i < length; i++){
            if (parseInt(this.ads[i].id, 10) === parseInt(this.openAdvert.id, 10) ){
              index = i;
            }
          }
          if (index !== null){
            this.ads.splice(index, 1, res);
          }

          this.translateService.get('item updated', {}).subscribe((value: string) => {
            this.constantService.updateGlobalStatus(value);
          });
          this.modalEditAdvert.hide();

        }, (error) => {
          this.loadingFormAdvertEdit = false;
          if (error.error.message === undefined){
            this.formAdvertEditError = error.error;
          }
          else{
            this.formAdvertEditError = error.error.message;
          }
          console.log(error.error);

        }, () => {

        });


      }, (error) => {
        if (error.error.message === undefined){
          this.formAdvertEditError = error.error;
        }
        else{
          this.formAdvertEditError = error.error.message;
        }
        console.log(error.error);
        this.loadingFormAdvertEdit = false;
      }, () => {
      });

    }

  }

  clearAdvertFile(){
    this.formAdvertFile = null;
    this.imageAdvertURL = '';
    this.formAdvertError = '';
    this.advertFileIsclear = true;
  }

  clearAdvertEditFile(){
    this.formAdvertEditFile = null;
    this.imageAdvertEditURL = '';
    this.formAdvertEditError = '';
    this.advertFileEditIsclear = true;
  }

  deleteAdvert(idR){
    this.loading = true;
    this.entityService.deleteAdvert({id: idR}).subscribe((res: Advert) => {
      this.loading = false;
      let index = -1;
      let remove = 0;
      this.ads.forEach((el) => {
        index = index + 1;
        if (parseInt(el.id, 10) === parseInt(idR, 10)){
          remove = index;
        }
      });
      this.ads.splice(remove, 1);
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

  addProduct() {
    const formData = new FormData();
    formData.append('file', this.formProductImage);

    this.loadingFormProduct = true;
    this.apiService.postFile(Config.uploadImage, formData).subscribe((res1: Image) => {
      const data = this.formProduct.value;
      data.entity_id = this.entity.id;
      data.image = res1.name;
      this.entityService.addProduct(data).subscribe((res: Product) => {
        this.loadingFormProduct = false;
        res.image = Config.apiUrl + '/uploads/profile/' + res.image;
        this.products.unshift(res);
        this.translateService.get('item created', {}).subscribe((value: string) => {
          this.constantService.updateGlobalStatus(value);
        });
        this.modalAddProduct.hide();

      }, (error) => {
        this.loadingFormProduct = false;
        if (error.error.message === undefined){
          this.formProductError = error.error;
        }
        else{
          this.formProductError = error.error.message;
        }
        console.log(error.error);

      }, () => {

      });


    }, (error) => {
      if (error.error.message === undefined){
        this.formProductError = error.error;
      }
      else{
        this.formProductError = error.error.message;
      }
      console.log(error.error);
      this.loadingFormProduct = false;
    }, () => {
    });

  }

  openModalFormProductEdit(template: TemplateRef<any>, product: Product) {
    this.formProductEdit.reset();
    this.formProductImageEdit = null;
    this.imageProductEditURL = '';
    this.openProduct = product;
    this.formProductEditError = '';
    console.log(product);
    this.formProductEdit.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      image: null,
      availability: product.is_available,
    });
    this.imageProductEditURL = product.image;
    this.modalProductEdit = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }

  editProduct() {

    if (this.openProduct != null){
      this.loadingFormProductEdit = true;
      if (this.formProductEditImage === null){
        const data = this.formProductEdit.value;
        data.id = this.openProduct.id;
        this.entityService.updateProduct(data).subscribe((res: Product) => {
          this.loadingFormProductEdit = false;
          res.image = Config.apiUrl + '/uploads/profile/' + res.image;

          const length = this.products.length;
          let index = null;
          for (let i = 0; i < length; i++){
            if (parseInt(this.products[i].id, 10) === parseInt(this.openProduct.id, 10) ){
              index = i;
            }
          }
          if (index !== null){
            this.products.splice(index, 1, res);
          }

          this.translateService.get('item updated', {}).subscribe((value: string) => {
            this.constantService.updateGlobalStatus(value);
          });
          this.openProduct = null;
          this.modalProductEdit.hide();

        }, (error) => {
          this.loadingFormProductEdit = false;
          if (error.error.message === undefined){
            this.formProductEditError = error.error;
          }
          else{
            this.formProductEditError = error.error.message;
          }
          console.log(error.error);

        }, () => {

        });
      }
      else{
        const formData = new FormData();
        formData.append('file', this.formProductEditImage);
        this.apiService.postFile(Config.uploadImage, formData).subscribe((res1: Image) => {
          const data = this.formProductEdit.value;
          data.id = this.openProduct.id;
          data.image = res1.name;
          this.entityService.updateProduct(data).subscribe((res: Product) => {
            this.loadingFormProductEdit = false;
            res.image = Config.apiUrl + '/uploads/profile/' + res.image;

            const length = this.products.length;
            let index = null;
            for (let i = 0; i < length; i++){
              if (parseInt(this.products[i].id, 10) === parseInt(this.openProduct.id, 10) ){
                index = i;
              }
            }
            if (index !== null){
              this.products.splice(index, 1, res);
            }

            this.translateService.get('item updated', {}).subscribe((value: string) => {
              this.constantService.updateGlobalStatus(value);
            });
            this.openProduct = null;
            this.modalProductEdit.hide();

          }, (error) => {
            this.loadingFormProductEdit = false;
            if (error.error.message === undefined){
              this.formProductEditError = error.error;
            }
            else{
              this.formProductEditError = error.error.message;
            }
            console.log(error.error);

          }, () => {

          });


        }, (error) => {
          if (error.error.message === undefined){
            this.formProductEditError = error.error;
          }
          else{
            this.formProductEditError = error.error.message;
          }
          console.log(error.error);
          this.loadingFormProductEdit = false;
        }, () => {
        });

      }
    }

  }

  showPreviewProduct($event: Event) {
    this.imageProductError = '';
    this.imageProductURL = '';
    const file = (event.target as HTMLInputElement).files[0];
    if (file !== undefined){
      const size = parseFloat((file.size / 1000 / 1000).toFixed(2));
      if (size > 2){
        this.imageProductError = 'error';
        this.formProductImage = null;
        this.formProduct.patchValue({
          image: null
        });
      }
      else{
        this.formProduct.patchValue({
          image: file.name
        });

        // File Preview
        const reader = new FileReader();
        reader.onload = () => {
          this.imageProductURL = reader.result as string;
        };
        reader.readAsDataURL(file);
        this.formProductImage = file;
      }
    }
    else{
      this.imageProductURL = '';
      this.formProduct.patchValue({
        image: ''
      });
      this.formProductImage = null;
    }

  }

  showPreviewProductEdit($event: Event) {
    this.imageProductEditError = '';
    this.imageProductEditURL = '';
    const file = (event.target as HTMLInputElement).files[0];
    if (file !== undefined){
      const size = parseFloat((file.size / 1000 / 1000).toFixed(2));
      if (size > 2){
        this.imageProductEditError = 'error';
        this.formProductEditImage = null;
        this.formProductEdit.patchValue({
          image: null
        });
      }
      else{
        this.formProductEdit.patchValue({
          image: file.name
        });

        // File Preview
        const reader = new FileReader();
        reader.onload = () => {
          this.imageProductEditURL = reader.result as string;
        };
        reader.readAsDataURL(file);
        this.formProductEditImage = file;
      }
    }
    else{
      this.imageProductEditURL = '';
      this.formProductEdit.patchValue({
        image: ''
      });
      this.formProductEditImage = null;
    }

  }

  openModalAddProduct(template: TemplateRef<any>){
    this.formProduct.reset();
    this.formProductError = '';
    this.imageProductURL = '';
    this.modalAddProduct = this.modalService.show(template, Object.assign({}, { class: 'login' }));

  }

  deleteProduct(idR){
    this.loading = true;
    this.entityService.deleteProduct({id: idR}).subscribe((res: Product) => {
      this.loading = false;
      let index = -1;
      let remove = 0;
      this.products.forEach((el) => {
        index = index + 1;
        if (parseInt(el.id, 10) === parseInt(idR, 10)){
          remove = index;
        }
      });
      this.products.splice(remove, 1);
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

  getEntityManagers(){
    this.loading = true;
    this.entityService.getManagerEntity({id: this.entity.id}).subscribe((res: User[]) => {
      this.loading = false;
      this.managers = [];
      res.forEach((el) => {
        el.picture = Config.apiUrl + '/uploads/profile/' + el.picture;
        this.managers.push(el);
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

  openModalManager(template: TemplateRef<any>) {
    this.formManager.reset();
    this.formManagerError = '';
    this.modalManager = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }

  addManager(){
    const data = this.formManager.value;
    data.entity_id = this.entity.id;
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

  removeManager(uId){
    const data = {entity_id: this.entity.id, id: uId};
    this.loading = true;
    this.entityService.removeManager(data).subscribe((res: User) => {
      this.loading = false;
      let index = -1;
      let remove = 0;
      this.managers.forEach((el) => {
        index = index + 1;
        if (parseInt(el.id, 10) === parseInt(uId, 10)){
          remove = index;
        }
      });
      this.managers.splice(remove, 1);

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

  addTopManager(){
    const data = this.formTopManager.value;
    data.entity_id = this.entity.id;
    this.loadingFormTopManager = true;
    this.entityService.addEntityTopManager(data).subscribe((res: User) => {
      this.loadingFormTopManager = false;
      res.picture = Config.apiUrl + '/uploads/profile/' + res.picture;
      this.entity.top_manager = res;

      this.translateService.get('item updated', {}).subscribe((value: string) => {
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

  openModalTopManager(template: TemplateRef<any>) {
    this.formTopManager.reset();
    this.formTopManagerError = '';
    this.modalTopManager = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }

  showTopManager(template: TemplateRef<any>) {
    this.modalShowTopManager = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }

  removeTopManager(uId){
    this.loading = true;
    this.modalShowTopManager.hide();
    const data = {entity_id: this.entity.id, id: uId};
    this.loading = true;
    this.entityService.removeEntityTopManager(data).subscribe((res: User) => {
      this.loading = false;
      this.entity.top_manager = null;
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

  openModalAddPay(template: TemplateRef<any>) {
    this.formAddPay.reset();
    this.formAddPayError = '';
    this.modalAddPay = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }

  addPay() {
    const data = this.formAddPay.value;
    data.entity_id = this.entity.id;
    this.loadingFormAddPay = true;
    this.entityService.addAcceptedPayMode(data).subscribe((res: AcceptedPayMode) => {
      this.loadingFormAddPay = false;
      this.entity.accepted_pay_modes.push(res);

      this.translateService.get('item updated', {}).subscribe((value: string) => {
        this.constantService.updateGlobalStatus(value);
      });

      this.modalAddPay.hide();

    }, (error) => {
      this.loadingFormAddPay = false;
      if (error.error.message === undefined){
        this.formAddPayError = error.error;
      }
      else{
        this.formAddPayError = error.error.message;
      }
      console.log(error.error);

    }, () => {

    });
  }

  editPay() {
  }

  openModalEditPay(template: TemplateRef<any>, pay: AcceptedPayMode) {
    this.openPay = pay;
    this.formEditPay.reset();
    this.formEditPayError = '';
    this.formEditPay.patchValue({
      detail_one: pay.detail_one,
      detail_two: pay.detail_two,
      pay_mode: pay.pay_mode.id,
    });
    this.modalEditPay = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }

  deletePay(idR){
    this.loading = true;
    this.entityService.removeAcceptedPayMode({id: idR}).subscribe((res: string) => {
      this.loading = false;
      let index = -1;
      let remove = 0;
      this.entity.accepted_pay_modes.forEach((el) => {
        index = index + 1;
        if (parseInt(el.id, 10) === parseInt(idR, 10)){
          remove = index;
        }
      });
      this.entity.accepted_pay_modes.splice(remove, 1);
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
