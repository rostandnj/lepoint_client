import {Component, OnInit, TemplateRef} from '@angular/core';
import {EntityService} from '../service/entity-service';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../service/auth-service';
import {ConstantsService} from '../service/constants-service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {EntityDetail} from '../schema/EntityDetail';
import {Config} from '../config';
import {Menu} from '../schema/Menu';
import {Advert} from '../schema/Advert';
import {Subscription} from 'rxjs';
import {Entity} from '../schema/Entity';
import {MenuCategory} from '../schema/MenuCategory';
import {Cart} from '../schema/Cart';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {AdvertPage} from '../schema/AdvertPage';

@Component({
  selector: 'app-show-advert',
  templateUrl: './show-advert.component.html',
  styleUrls: ['./show-advert.component.css']
})
export class ShowAdvertComponent implements OnInit {
  globalAlertStatusSubscription: Subscription;
  globalAlertStatus = '';
  id: string;
  loading = true;
  loadingAll = false;
  entity: Entity;
  openAdvert: Advert;
  currentLangSubscription: Subscription;
  currentLang: string;
  configLink = Config.apiUrl + Config.getQrCode;
  configLinkAdvert = Config.apiUrl + Config.getQrCodeAdvert;
  currentLogo  = '';
  currentLogoSubscription: Subscription;
  showExtensions2 = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/pjpg'];
  showExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.jpg'];

  constructor( private entityService: EntityService, private actRoute: ActivatedRoute,
               private authService: AuthService, private constantService: ConstantsService,
               private route: ActivatedRoute, private modalService: BsModalService) {
    this.entity = null;
    this.openAdvert = null;
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
    this.id = this.route.snapshot.paramMap.get('slug');
    this.entityService.showAdvert({slug: this.id}).subscribe((res: AdvertPage) => {
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

      if (res.advert.file !==  null){
        if (this.showExtensions2.includes(res.advert.file.extension)){
          res.advert.file.path = Config.apiUrl + '/uploads/profile/' +  res.advert.file.path;
        }
        else{
          res.advert.file.path = Config.apiUrl + '/uploads/' +  res.advert.file.path;
        }

      }
      this.openAdvert = res.advert;

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
}
