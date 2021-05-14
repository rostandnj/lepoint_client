import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {EntityService} from '../service/entity-service';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../service/auth-service';
import {ConstantsService} from '../service/constants-service';
import {Entity} from '../schema/Entity';
import {EntityDetail} from '../schema/EntityDetail';
import {Menu} from '../schema/Menu';
import {MenuCategory} from '../schema/MenuCategory';
import {Config} from '../config';
import {Cart} from '../schema/Cart';

@Component({
  selector: 'app-restaurant-page',
  templateUrl: './restaurant-page.component.html',
  styleUrls: ['./restaurant-page.component.css']
})
export class RestaurantPageComponent implements OnInit {

  globalAlertStatusSubscription: Subscription;
  globalAlertStatus = '';
  id: string;
  loading = true;
  loadingAll = false;
  entity: Entity;
  menus: Menu[];
  showingMenus: Menu[];
  categories: MenuCategory[];
  slideConfig = {slidesToShow: 4, slidesToScroll: 1, centerMode: false, centerPadding: '30px',
    arrows: true,
    nextArrow: '<span style="float: right;font-size: 16px;color: #dc3545!important;' +
      'font-weight: bold" class=\'feather-arrow-right\'></span>',
    prevArrow: '<span style="font-size: 16px;color: #dc3545!important;font-weight: bold" class=\' feather-arrow-left\'></span>',
    autoplay: false,
    /*autoplaySpeed: 4000,*/
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
  slideConfig2 = {slidesToShow: 3, slidesToScroll: 1, centerMode: false, centerPadding: '30px',
    arrows: true,
    nextArrow: '<span style="float: right;font-size: 16px;color: #dc3545!important;' +
      'font-weight: bold" class=\'feather-arrow-right\'></span>',
    prevArrow: '<span style="font-size: 16px;color: #dc3545!important;font-weight: bold" class=\' feather-arrow-left\'></span>',
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
          slidesToShow: 1
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
  currentLogo  = '';
  currentLogoSubscription: Subscription;

  constructor( private entityService: EntityService, private actRoute: ActivatedRoute,
               private authService: AuthService, private constantService: ConstantsService,
               private route: ActivatedRoute) {
    this.entity = null;
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

    this.cartSubscription = this.entityService.cartSubject.subscribe((res) => {
      this.cart = res;

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
  }

  ngOnInit(): void {
    this.currentLang = this.constantService.currentLang;
    this.id = this.route.snapshot.paramMap.get('id');
    this.entityService.getOneEntity({id: this.id}).subscribe((res: EntityDetail) => {
      this.loading = false;
      this.entity = res.entity;
      this.constantService.updateLogo(this.entity.global_info.image);
      this.menus = [];
      this.categories = [];
      res.menus.forEach((el) => {
        el.image = Config.apiUrl + '/uploads/profile/' + el.image;
        this.menus.push(el);
      });
      res.categories.forEach((el) => {
        el.base_category.image = Config.apiUrl + 'img/' + el.base_category.image;
        this.categories.push(el);
      });
      this.showingMenus = this.menus;

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

  addToCart(men){
    this.addedItem = true;
    this.entityService.addItemToCart({menu: men, quantity: 1});
    setTimeout(() => {
      this.addedItem = false;
    }, 2000);
  }

}
