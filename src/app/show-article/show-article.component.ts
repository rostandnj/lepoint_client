import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {Entity} from '../schema/Entity';
import {Advert} from '../schema/Advert';
import {Config} from '../config';
import {EntityService} from '../service/entity-service';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../service/auth-service';
import {ConstantsService} from '../service/constants-service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {AdvertPage} from '../schema/AdvertPage';
import {Article} from '../schema/Article';
import {ArticleAndComment} from '../schema/AticleAndComment';
import {CommentArticle} from '../schema/CommentArticle';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../schema/User';
import {Image} from '../schema/Image';
import {ArticleAndOneComment} from '../schema/ArticleAndOneComment';
import {combineAll} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-show-article',
  templateUrl: './show-article.component.html',
  styleUrls: ['./show-article.component.css']
})
export class ShowArticleComponent implements OnInit {
  globalAlertStatusSubscription: Subscription;
  globalAlertStatus = '';
  userSubscription: Subscription;
  user: User;
  isLogin: boolean;
  isLoginSubscription: Subscription;
  formCommentError = '';
  id: string;
  slug: string;
  loading = true;
  loadingAll = false;
  loadingMore = false;
  canLoadMore = false;
  sendingComment = false;
  formComment: FormGroup;
  openArticle: Article;
  comments: CommentArticle[];
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
               private route: ActivatedRoute, private modalService: BsModalService, private fb: FormBuilder,
               private translateService: TranslateService) {
    this.openArticle = null;
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
    this.comments = [];
    this.formComment = this.fb.group({
      message: ['', Validators.minLength(1)],
    });
    this.userSubscription = this.authService.userSubject.subscribe((user: User) => {
      this.user = user;
    }, (error) => {
      console.log(error);
    }, () => {

    });
    this.isLoginSubscription = this.authService.userIsLoginSubject.subscribe((status: boolean) => {
      this.isLogin = status;
    }, (error) => {
      console.log(error);
    }, () => {

    });
  }


  get f1() { return this.formComment.controls; }
  ngOnInit(): void {
    this.currentLang = this.constantService.currentLang;
    this.slug = this.route.snapshot.paramMap.get('slug');
    this.entityService.showArticle({slug: this.slug}).subscribe((res: ArticleAndComment) => {
      this.loading = false;
      this.openArticle = res.article;
      if (this.openArticle.image_cover === null || this.openArticle.image_cover.length === 0 ){
        this.openArticle.image_cover = Config.apiUrl + '/img/news.png';
      }
      else{
        this.openArticle.image_cover = Config.apiUrl + '/uploads/' + this.openArticle.image_cover;
      }

      res.comments.forEach((el) => {
        el.user.picture = Config.apiUrl + '/uploads/' + el.user.picture;
        this.comments.push(el);
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

  getImageTemplate(){
    return this.constantService.currentLogo;
  }

  goodStart(nb){
    const output = [];
    for (let i = 1; i <= nb; i ++) {
      output.push(i);
    }
    console.log(output);
    return output;
  }
  badStart(nb){
    const output = [];
    for (let i = 1; i <= 5 - nb; i ++) {
      output.push(i);
    }
    return output;
  }

  makeComment(){
    if (this.openArticle != null){
      this.sendingComment = true;
      const data = this.formComment.value;
      data.id = this.openArticle.id;
      this.entityService.commentArticle(data).subscribe((res: ArticleAndOneComment) => {
        this.sendingComment = false;
        this.openArticle = res.article;
        if (this.openArticle.image_cover === null || this.openArticle.image_cover.length === 0 ){
          this.openArticle.image_cover = Config.apiUrl + '/img/news.png';
        }
        else{
          this.openArticle.image_cover = Config.apiUrl + '/uploads/' + this.openArticle.image_cover;
        }

        res.comment.user.picture = Config.apiUrl + '/uploads/' + res.comment.user.picture;
        this.comments.push(res.comment);
        this.translateService.get('comment added', {}).subscribe((value: string) => {
          this.constantService.updateGlobalStatus(value);
        });
        this.formComment.reset();

      }, (error) => {
        this.sendingComment = false;
        if (error.error.message === undefined){
          this.formCommentError = error.error;
        }
        else{
          this.formCommentError = error.error.message;
        }
        console.log(error.error);

      }, () => {

      });
    }
  }

  makeReactionOnArticle(val){
    if (this.openArticle != null){
      this.sendingComment = true;
      this.entityService.reactOnArticle({id: this.openArticle.id, action: val}).subscribe((res: Article) => {
        this.sendingComment = false;
        this.openArticle = res;
        if (this.openArticle.image_cover === null || this.openArticle.image_cover.length === 0 ){
          this.openArticle.image_cover = Config.apiUrl + '/img/news.png';
        }
        else{
          this.openArticle.image_cover = Config.apiUrl + '/uploads/' + this.openArticle.image_cover;
        }
        this.translateService.get('reaction added', {}).subscribe((value: string) => {
          this.constantService.updateGlobalStatus(value);
        });
        this.formComment.reset();
        this.formCommentError = '';

      }, (error) => {
        this.sendingComment = false;
        if (error.error.message === undefined){
          this.formCommentError = error.error;
        }
        else{
          this.formCommentError = error.error.message;
        }
        console.log(error.error);

      }, () => {

      });
    }
  }

  makeReactionOnComment(cid){
    if (this.openArticle != null){
      this.sendingComment = true;
      this.entityService.reactOnComment({id: cid, action: 1}).subscribe((res: CommentArticle) => {
        this.sendingComment = false;
        res.user.picture = Config.apiUrl + '/uploads/' + res.user.picture;
        const length = this.comments.length;
        let index = null;
        for (let i = 0; i < length; i++){
          if (parseInt(this.comments[i].id, 10) === parseInt(res.id, 10) ){
            index = i;
          }
        }
        if (index !== null){
          this.comments.splice(index, 1, res);
        }
        this.translateService.get('reaction added', {}).subscribe((value: string) => {
          this.constantService.updateGlobalStatus(value);
        });
        this.formComment.reset();
        this.formCommentError = '';

      }, (error) => {
        this.sendingComment = false;
        if (error.error.message === undefined){
          this.formCommentError = error.error;
        }
        else{
          this.formCommentError = error.error.message;
        }
        console.log(error.error);

      }, () => {

      });
    }
  }
}
