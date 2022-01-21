import {Component, OnInit, TemplateRef} from '@angular/core';
import {Subscription} from 'rxjs';
import {Advert} from '../schema/Advert';
import {Config} from '../config';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {EntityService} from '../service/entity-service';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../service/auth-service';
import {ConstantsService} from '../service/constants-service';
import {HttpClient} from '@angular/common/http';
import {BsModalService} from 'ngx-bootstrap/modal';
import {FormBuilder} from '@angular/forms';
import {Article} from '../schema/Article';
import ClassicEditor from '../../../../ckeditor5/packages/ckeditor5-build-classic/build/ckeditor';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  globalAlertStatusSubscription: Subscription;
  globalAlertStatus = '';
  articles: Article[];
  currentLangSubscription: Subscription;
  currentLang: string;
  addedItem = false;
  currentLogo  = '';
  articleOffset = 0;
  openArticle: Article;
  comments = [];
  modalArticle: BsModalRef;
  loading = true;
  loadingMore = false;
  canLoadMoreArticle = false;
  alertStatus: boolean;
  alertMsg: string;
  currentLogoSubscription: Subscription;

  constructor( private entityService: EntityService, private actRoute: ActivatedRoute,
               private authService: AuthService, private constantService: ConstantsService, private httpClient: HttpClient,
               private route: ActivatedRoute, private modalService: BsModalService, private fb: FormBuilder) {
    this.articles = [];
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
    this.entityService.recentArticles({limit: this.entityService.userLimit, offset: this.articleOffset}).subscribe((res: Article[]) => {
      this.loading = false;
      res.forEach((el) => {
        if (el.image_cover == null || el.image_cover.length === 0){
          el.image_cover = Config.apiUrl + '/img/news.png';
        }else{
          el.image_cover = Config.apiUrl + '/uploads/mini/' + el.image_cover;
        }
        this.articles.push(el);
      });
      this.canLoadMoreArticle = res.length === this.entityService.userLimit;
      this.articleOffset = this.articleOffset + this.entityService.userLimit;

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

  goodStart(nb){
    const output = [];
    for (let i = 1; i <= nb; i ++) {
      output.push(i);
    }
    return output;
  }
  badStart(nb){
    const output = [];
    for (let i = 1; i <= 5 - nb; i ++) {
      output.push(i);
    }
    return output;
  }

  getMoreArticles() {
    this.loadingMore = true;
    this.entityService.recentArticles({limit: this.entityService.userLimit, offset: this.articleOffset}).
    subscribe((res: Article[]) => {
      this.loadingMore = false;
      res.forEach((el) => {
        if (el.image_cover === null || el.image_cover.length === 0){
          el.image_cover = Config.apiUrl + '/img/news.png';
        }else{
          el.image_cover = Config.apiUrl + '/uploads/mini/' + el.image_cover;
        }
        this.articles.push(el);
      });
      this.canLoadMoreArticle = res.length === this.entityService.userLimit;
      this.articleOffset = this.articleOffset + this.entityService.userLimit;
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

  openModal(art: Article, template: TemplateRef<any>) {
    this.openArticle = art;
    this.modalArticle = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }

}
