import {Component, OnInit, TemplateRef} from '@angular/core';
import {Subscription} from 'rxjs';
import {Entity} from '../schema/Entity';
import {Menu} from '../schema/Menu';
import {Advert} from '../schema/Advert';
import {MenuCategory} from '../schema/MenuCategory';
import {Cart} from '../schema/Cart';
import {Config} from '../config';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {EntityService} from '../service/entity-service';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../service/auth-service';
import {ConstantsService} from '../service/constants-service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {EntityDetail} from '../schema/EntityDetail';
import {Product} from '../schema/Product';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-place-product',
  templateUrl: './place-product.component.html',
  styleUrls: ['./place-product.component.css']
})
export class PlaceProductComponent implements OnInit {
  globalAlertStatusSubscription: Subscription;
  globalAlertStatus = '';
  id: string;
  loading = true;
  loadingAll = false;
  entity: Entity;
  menus: Menu[];
  ads: Advert[];
  showingMenus: Menu[];
  categories: MenuCategory[];
  slideConfig2 = {slidesToShow: 4, slidesToScroll: 1, centerMode: false, centerPadding: '30px',
    arrows: true,
    nextArrow: '<div class="next-slide"><span style="font-size: 16px;color:#e23744!important;"' +
      'class=\' feather-arrow-right\'></span></div>',
    prevArrow: '<div class="prev-slide"><span style="font-size: 16px;color:#e23744!important;" class=\' feather-arrow-left\'></span></div>',
    responsive: [{
      breakpoint: 768,
      settings: {
        arrows: true,
        centerMode: false,
        centerPadding: '10px',
        slidesToShow: 3
      }
    },
      {
        breakpoint: 480,
        settings: {
          arrows: true,
          centerMode: false,
          centerPadding: '10px',
          slidesToShow: 2
        }
      }
    ]
  };
  currentLangSubscription: Subscription;
  currentLang: string;
  menuTitle = null;
  addedItem = false;
  cartSubscription: Subscription;
  cart: Cart;
  configLink = Config.apiUrl + Config.getQrCode;
  configLinkAdvert = Config.apiUrl + Config.getQrCodeAdvert;
  currentLogo  = '';
  currentLogoSubscription: Subscription;
  showExtensions2 = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/pjpg'];
  showExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.jpg'];
  modalAdvert: BsModalRef;
  openAdvert: Advert;
  canLoadMoreAdvert = false;
  advertOffset = 0;
  products: Product[];
  productsToShow: Product[];
  formSearch: FormGroup;

  constructor( private entityService: EntityService, private actRoute: ActivatedRoute,
               private authService: AuthService, private constantService: ConstantsService,
               private route: ActivatedRoute, private modalService: BsModalService, private fb: FormBuilder) {
    this.entity = null;
    this.ads = [];
    this.products = [];
    this.productsToShow = [];
    this.globalAlertStatusSubscription = this.constantService.globalAlertStatusSubject.subscribe((res) => {
      this.globalAlertStatus = res;

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
    this.currentLogoSubscription = this.constantService.currentLogoSubject.subscribe((lo) => {
      this.currentLogo = lo;

    }, (error) => {
      console.log(error);
    }, () => {

    });
    this.formSearch = this.fb.group({
      name: ['', Validators.required],
    });
  }

  get f1() { return this.formSearch.controls; }

  ngOnInit(): void {
    this.currentLang = this.constantService.currentLang;
    this.id = this.route.snapshot.paramMap.get('id');
    this.entityService.getOneEntity({id: this.id}).subscribe((res: EntityDetail) => {
      this.loading = false;
      this.entity = res.entity;
      if (parseInt( this.entity.type, 10) === 1){
        this.entity.link = '/restaurants';
      }
      if (parseInt( this.entity.type, 10) === 2){
        this.entity.link = '/lunches';
      }
      if (parseInt( this.entity.type, 10) === 3){
        this.entity.link = '/discos';
      }
      if (parseInt( this.entity.type, 10) === 4){
        this.entity.link = '/hostels';
      }
      if (parseInt( this.entity.type, 10) === 5){
        this.entity.link = '/art-culture';
      }
      if (parseInt( this.entity.type, 10) === 6){
        this.entity.link = '/office-institution';
      }
      if (parseInt( this.entity.type, 10) === 7){
        this.entity.link = '/pharmacies';
      }
      this.constantService.updateLogo(this.entity.global_info.image);
      this.ads = [];
      this.products = [];
      this.advertOffset = 0;
      res.products.forEach((el) => {
        el.image = Config.apiUrl + '/uploads/profile/' + el.image;
        this.products.push(el);
        this.productsToShow.push(el);
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
      if (res.adverts.length === this.entityService.limit){
        this.advertOffset = this.advertOffset + this.entityService.limit;
        this.canLoadMoreAdvert = true;
      }else{
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

  slickInit(e) {
    console.log('slick initialized');
  }

  breakpoint(e) {
    console.log('breakpoint');
  }

  afterChange(e) {
    console.log('afterChange');
  }

  beforeChange(e) {
    console.log('beforeChange');
  }

  getAllMenu(){
    this.loadingAll = true;
    this.menuTitle = null;
    this.showingMenus = this.menus;
    this.loadingAll = false;
  }

  filterMenu(cat){
    this.loadingAll = true;
    if (this.currentLang === 'fr'){
      this.menuTitle = cat.name_fr;
    }
    else{
      this.menuTitle = cat.name_en;
    }
    this.showingMenus = [];
    this.entityService.getEntityCategoriesMenu({entity: this.id, id: cat.id}).subscribe((res: Menu[]) => {
      this.loadingAll = false;
      res.forEach((el) => {
        el.image = Config.apiUrl + '/uploads/profile/' + el.image;
        this.showingMenus.push(el);
      });

    }, (error) => {
      this.loadingAll = false;
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

  openModalAdvert(adv: Advert, template: TemplateRef<any>){
    this.openAdvert = adv;
    this.modalAdvert = this.modalService.show(template, Object.assign({}, { class: 'login' }));

  }

  getMoreAdvert() {
    this.loading = true;
    this.entityService.listAdvert({id: this.entity.id, limit: this.entityService.limit, offset: this.advertOffset}).
    subscribe((res: Advert[]) => {
      this.loading = false;
      res.forEach((el) => {
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

      if (res.length === this.entityService.limit){
        this.advertOffset = this.advertOffset + this.entityService.limit;
        this.canLoadMoreAdvert = true;
      }else{
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

  getImageTemplate(){
    return this.constantService.currentLogo;
  }

  searchProduct(){
    this.loadingAll = true;
    this.entityService.
    searchProduct({entity_id: this.entity.id, name: this.formSearch.value.name, city: '',
      type: this.entity.type, limit: this.entityService.limit, offset: this.advertOffset}).
    subscribe((res: Product[]) => {
      this.productsToShow = [];
      this.loadingAll = false;
      res.forEach((el) => {
        el.image = Config.apiUrl + '/uploads/profile/' + el.image;
        this.productsToShow.push(el);
      });


    }, (error) => {
      this.loadingAll = false;
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

  showAll() {
    this.productsToShow = [];
    this.products.forEach((el) => {
      this.productsToShow.push(el);
    });
  }
}
