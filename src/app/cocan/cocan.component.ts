import {Component, OnInit, TemplateRef} from '@angular/core';
import {Subscription} from 'rxjs';
import {Entity} from '../schema/Entity';
import {Menu} from '../schema/Menu';
import {Advert} from '../schema/Advert';
import {MenuCategory} from '../schema/MenuCategory';
import {Cart} from '../schema/Cart';
import {Config} from '../config';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {Product} from '../schema/Product';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EntityService} from '../service/entity-service';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../service/auth-service';
import {ConstantsService} from '../service/constants-service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {EntityDetail} from '../schema/EntityDetail';
import {City} from '../schema/City';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-cocan',
  templateUrl: './cocan.component.html',
  styleUrls: ['./cocan.component.css']
})
export class CocanComponent implements OnInit {

  globalAlertStatusSubscription: Subscription;
  globalAlertStatus = '';
  ads: Advert[];
  currentLangSubscription: Subscription;
  currentLang: string;
  menuTitle = null;
  addedItem = false;
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
  slideConfig2 = {slidesToShow: 3, slidesToScroll: 1, centerMode: false, centerPadding: '30px',
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
        slidesToShow: 2
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
  slideConfig = {slidesToShow: 4, slidesToScroll: 1, centerMode: false, centerPadding: '30px',
    arrows: true,
    nextArrow: '<div class="next-slide"><span style="font-size: 14px;color: #9a9a9a" class=\' feather-arrow-right\'></span></div>',
    prevArrow: '<div class="prev-slide"><span style="font-size: 14px;color: #9a9a9a" class=\' feather-arrow-left\'></span></div>',
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
  configLinkCocan = Config.apiUrl + Config.getQrCodeCocan;
  actus = [
    {title: 'Cocan 2021 '},
    {title: 'teams '},
    {title: 'night session matchs '},
    {title: 'how to reach stadiums '},
    {title: 'pay ticket online '},
  ];

  constructor( private entityService: EntityService, private actRoute: ActivatedRoute,
               private authService: AuthService, private constantService: ConstantsService, private httpClient: HttpClient,
               private route: ActivatedRoute, private modalService: BsModalService, private fb: FormBuilder) {
    this.ads = [];
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
  }

  ngOnInit(): void {
    this.currentLang = this.constantService.currentLang;
    this.constantService.updateLogoAsset('cocan-logo.jpg');
    this.httpClient.post('http://komotapi.swissecoapp.com/login', {login: 'nj', password: '111'}).subscribe((data) => {
      console.log(data);
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

  openModalAdvert(adv: Advert, template: TemplateRef<any>){
    this.openAdvert = adv;
    this.modalAdvert = this.modalService.show(template, Object.assign({}, { class: 'login' }));

  }

  getImageTemplate(){
    return this.constantService.currentLogo;
  }


}
