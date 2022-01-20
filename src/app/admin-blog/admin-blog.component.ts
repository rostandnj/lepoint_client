import {Component, OnInit, TemplateRef} from '@angular/core';
import {Subscription} from 'rxjs';
import {Config} from '../config';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {EntityService} from '../service/entity-service';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../service/auth-service';
import {ConstantsService} from '../service/constants-service';
import {HttpClient} from '@angular/common/http';
import {BsModalService} from 'ngx-bootstrap/modal';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Article} from '../schema/Article';

import ClassicEditor from '../../../../ckeditor5/packages/ckeditor5-build-classic/build/ckeditor';
import {ChangeEvent} from '@ckeditor/ckeditor5-angular';
import {Image} from '../schema/Image';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from '../service/api-service';
import { AngularConfirmModalModule } from 'angular-confirm-modal';
import {Advert} from '../schema/Advert';



@Component({
  selector: 'app-admin-blog',
  templateUrl: './admin-blog.component.html',
  styleUrls: ['./admin-blog.component.css']
})
export class AdminBlogComponent implements OnInit {

  globalAlertStatusSubscription: Subscription;
  globalAlertStatus = '';
  articles: Article[];
  currentLangSubscription: Subscription;
  currentLang: string;
  configLink = Config.apiUrl + Config.getQrCode;
  configLinkAdvert = Config.apiUrl + Config.getQrCodeAdvert;
  showExtensions2 = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/pjpg'];
  showExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.jpg'];
  modalAddArticle: BsModalRef;
  modalupdateArticle: BsModalRef;
  openArticle: Article;
  formArticle: FormGroup;
  formArticleEdit: FormGroup;
  canLoadMoreArticle = false;
  alertStatus: boolean;
  alertMsg: string;
  loadingMore = false;
  loadingFormArticleEdit = false;
  loading = true;
  formArticleFile = null;
  formArticleFileEdit = null;
  imageArticleURL = '';
  imageArticleURLEdit = '';
  articleOffset = 0;
  formArticleError = '';
  formArticleErrorEdit = '';
  imageArticleError = '';
  imageArticleErrorEdit = '';
  articleFileIsclear = false;
  articleFileIsclearEdit = false;
  loadingFormArticle = false;
  currentCharacter = 0;
  currentCharacterEdit = 0;
  editorContent = '';
  modalRef: BsModalRef;
  public Editor = ClassicEditor;
  public Editor2 = ClassicEditor;
  public config = {
    language: 'fr',
    wordCount: {
      onUpdate: stats => {
        // Prints the current content statistics.
        this.currentCharacter = stats.characters;
        // console.log( `Characters: ${ stats.characters }\nWords: ${ stats.words }` );
      }
    },
    // plugins: [],
    ckfinder: {
    uploadUrl: Config.apiUrl + Config.uploadEditor + '?command=QuickUpload&type=Images&responseType=json',
      headers: {
        Authorization: 'Bearer ',
        lang: ''
      },
      options: {
        resourceType: 'Images',
        resizeImages: true,
      },
      openerMethod: 'popup'
  }
  };
  public config2 = {
    language: 'fr',
    wordCount: {
      onUpdate: stats => {
        // Prints the current content statistics.
        this.currentCharacterEdit = stats.characters;
        // console.log( `Characters: ${ stats.characters }\nWords: ${ stats.words }` );
      }
    },
    // plugins: [],
    ckfinder: {
    uploadUrl: Config.apiUrl + Config.uploadEditor + '?command=QuickUpload&type=Images&responseType=json',
      headers: {
        Authorization: 'Bearer ',
        lang: ''
      },
      options: {
        resourceType: 'Images',
        resizeImages: true,
      },
      openerMethod: 'popup'
  }
  };


  constructor( private entityService: EntityService, private actRoute: ActivatedRoute,
               private authService: AuthService, private constantService: ConstantsService, private httpClient: HttpClient,
               private route: ActivatedRoute, private modalService: BsModalService, private fb: FormBuilder,
               private apiService: ApiService, private translateService: TranslateService) {
    this.articles = [];
    this.globalAlertStatusSubscription = this.constantService.globalAlertStatusSubject.subscribe((res) => {
      this.globalAlertStatus = res;

    }, (error) => {
      console.log(error);
    }, () => {

    });
    this.currentLangSubscription = this.constantService.currentLangSubject.subscribe((lang) => {
      this.currentLang = lang;
      if (lang === 'en'){
        this.config.language = 'en-gb';
      }else{
        this.config.language = 'fr';
      }

    }, (error) => {
      console.log(error);
    }, () => {

    });
    this.formArticle = this.fb.group({
      title: ['', Validators.minLength(1)],
      type: ['0', Validators.required],
      content: ['', Validators.minLength(1)],
      image: ['']
    });
    this.formArticleEdit = this.fb.group({
      title: ['', Validators.minLength(1)],
      type: ['0', Validators.required],
      content: ['', Validators.minLength(1)],
      image: ['']
    });
  }

  get f4() { return this.formArticle.controls; }
  get f44() { return this.formArticle.controls; }

  ngOnInit(): void {
    this.currentLang = this.constantService.currentLang;
    this.entityService.userArticles({limit: this.entityService.userLimit, offset: this.articleOffset}).subscribe((res: Article[]) => {
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
  openModalAddArticle(template: TemplateRef<any>){
    this.formArticle.reset();
    this.formArticleError = '';
    this.formArticleFile = null;
    this.imageArticleError = '';
    this.currentCharacter = 0;
    this.modalAddArticle = this.modalService.show(template, Object.assign({}, { class: 'login' }));

  }

  showPreviewArticleFile($event: Event) {
    this.imageArticleError = '';
    this.imageArticleURL = '';
    const file = (event.target as HTMLInputElement).files[0];
    if (file !== undefined ){
      const size = parseFloat((file.size / 1000 / 1000).toFixed(2));
      if (size > 2 || !this.showExtensions2.includes(file.type)){
        this.imageArticleError = 'error';
        this.formArticleFile = null;
        this.formArticle.patchValue({
          file: null
        });
      }
      else{
          this.formArticle.patchValue({
            file: file.name
          });
          this.articleFileIsclear = false;

          // File Preview
          const reader = new FileReader();
          reader.onload = () => {
            this.imageArticleURL = reader.result as string;
          };
          reader.readAsDataURL(file);
          this.formArticleFile = file;
      }
    }
    else{
      this.imageArticleURL = '';
      this.formArticle.patchValue({
        file: ''
      });
      this.formArticleFile = null;
    }

  }

  showPreviewArticleFileEdit($event: Event) {
    this.imageArticleErrorEdit = '';
    this.imageArticleURLEdit = '';
    const file = (event.target as HTMLInputElement).files[0];
    if (file !== undefined ){
      const size = parseFloat((file.size / 1000 / 1000).toFixed(2));
      if (size > 2 || !this.showExtensions2.includes(file.type)){
        this.imageArticleErrorEdit = 'error';
        this.formArticleFileEdit = null;
        this.formArticleEdit.patchValue({
          file: null
        });
      }
      else{
          this.formArticleEdit.patchValue({
            file: file.name
          });
          this.articleFileIsclearEdit = false;

          // File Preview
          const reader = new FileReader();
          reader.onload = () => {
            this.imageArticleURLEdit = reader.result as string;
          };
          reader.readAsDataURL(file);
          this.formArticleFileEdit = file;
      }
    }
    else{
      this.imageArticleURLEdit = '';
      this.formArticleEdit.patchValue({
        file: ''
      });
      this.formArticleFileEdit = null;
    }

  }

  getImageTemplate(){
    return this.constantService.currentLogo;
  }

  addArticle() {
    console.log(this.currentCharacter < 0);
    this.loadingFormArticle = true;

    if (this.formArticleFile === null){
      const data = this.formArticle.value;
      data.cover_image = null;
      this.entityService.addArticle(data).subscribe((res: Article) => {
        this.loadingFormArticle = false;
        res.image_cover = Config.apiUrl + '/img/news.png';

        this.articles.unshift(res);

        this.translateService.get('item updated', {}).subscribe((value: string) => {
          this.constantService.updateGlobalStatus(value);
        });
        this.modalAddArticle.hide();

      }, (error) => {
        this.loadingFormArticle = false;
        if (error.error.message === undefined){
          this.formArticleError = error.error;
        }
        else{
          this.formArticleError = error.error.message;
        }
        console.log(error.error);

      }, () => {

      });
    }
    else{
      const formData = new FormData();
      formData.append('file', this.formArticleFile);
      this.apiService.postFile(Config.uploadImage, formData).subscribe((res1: Image) => {
        const data = this.formArticle.value;
        data.cover_image = res1.path;
        this.entityService.addArticle(data).subscribe((res: Article) => {
          this.loadingFormArticle = false;
          if (res.image_cover !==  null){
            res.image_cover = Config.apiUrl + '/uploads/mini/' +  res.image_cover;
          }

          this.articles.unshift(res);

          this.translateService.get('item updated', {}).subscribe((value: string) => {
            this.constantService.updateGlobalStatus(value);
          });
          this.modalAddArticle.hide();

        }, (error) => {
          this.loadingFormArticle = false;
          if (error.error.message === undefined){
            this.formArticleError = error.error;
          }
          else{
            this.formArticleError = error.error.message;
          }
          console.log(error.error);

        }, () => {

        });


      }, (error) => {
        if (error.error.message === undefined){
          this.formArticleError = error.error;
        }
        else{
          this.formArticleError = error.error.message;
        }
        console.log(error.error);
        this.loadingFormArticle = false;
      }, () => {
      });

    }

  }

  public onChange( { editor }: ChangeEvent ) {
    const data = editor;

    // console.log( data );
  }

  getMoreArticles() {
    this.loadingMore = true;
    this.entityService.userArticles({limit: this.entityService.userLimit, offset: this.articleOffset}).
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

  clearArticleFile(){
    this.formArticleFile = null;
    this.imageArticleURL = '';
    this.formArticleError = '';
    this.articleFileIsclear = true;
  }

  clearArticleFileEdit(){
    this.formArticleFileEdit = null;
    this.imageArticleURLEdit = '';
    this.formArticleErrorEdit = '';
    this.articleFileIsclearEdit = true;
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

  openModalArticle(adv: Article, template: TemplateRef<any>){
    this.openArticle = adv;
    this.formArticleEdit.reset();
    this.formArticleFileEdit = null;
    this.imageArticleURLEdit = '';
    this.formArticleErrorEdit = '';
    this.articleFileIsclearEdit = false;

    this.formArticleEdit.patchValue({
      title: adv.title,
      content: adv.content,
      type: adv.type,
      file: null,
    });
    if (adv.image_cover !== null && adv.image_cover.length > 0){
      if (this.showExtensions2.includes(adv.image_cover.split('.').pop())){
        this.imageArticleURLEdit = adv.image_cover;
      }
    }
    this.modalupdateArticle = this.modalService.show(template, Object.assign({}, { class: 'login' }));

  }

  updateArticle(){
    if (this.openArticle != null){
      this.loadingFormArticleEdit = true;
      if (this.formArticleFileEdit === null){
        const data = this.formArticleEdit.value;
        data.id = this.openArticle.id;
        data.cover_image = null;
        this.entityService.updateArticle(data).subscribe((res: Article) => {
          this.loadingFormArticleEdit = false;
          if (res.image_cover == null || res.image_cover.length === 0){
            res.image_cover = Config.apiUrl + '/img/news.png';
          }else{
            res.image_cover = Config.apiUrl + '/uploads/mini/' + res.image_cover;
          }

          const length = this.articles.length;
          let index = null;
          for (let i = 0; i < length; i++){
            if (parseInt(this.articles[i].id, 10) === parseInt(this.openArticle.id, 10) ){
              index = i;
            }
          }
          if (index !== null){
            this.articles.splice(index, 1, res);
          }

          this.translateService.get('item updated', {}).subscribe((value: string) => {
            this.constantService.updateGlobalStatus(value);
          });
          this.openArticle = null;
          this.modalupdateArticle.hide();

        }, (error) => {
          this.loadingFormArticleEdit = false;
          if (error.error.message === undefined){
            this.formArticleErrorEdit = error.error;
          }
          else{
            this.formArticleErrorEdit = error.error.message;
          }
          console.log(error.error);

        }, () => {

        });
      }
      else{
        const formData = new FormData();
        formData.append('file', this.formArticleFileEdit);
        this.apiService.postFile(Config.uploadImage, formData).subscribe((res1: Image) => {
          const data = this.formArticleEdit.value;
          data.id = this.openArticle.id;
          data.cover_image = res1.path;
          this.entityService.updateArticle(data).subscribe((res: Article) => {
            this.loadingFormArticleEdit = false;
            if (res.image_cover == null || res.image_cover.length === 0){
              res.image_cover = Config.apiUrl + '/img/news.png';
            }else{
              res.image_cover = Config.apiUrl + '/uploads/mini/' + res.image_cover;
            }

            const length = this.articles.length;
            let index = null;
            for (let i = 0; i < length; i++){
              if (parseInt(this.articles[i].id, 10) === parseInt(this.openArticle.id, 10) ){
                index = i;
              }
            }
            if (index !== null){
              this.articles.splice(index, 1, res);
            }

            this.translateService.get('item updated', {}).subscribe((value: string) => {
              this.constantService.updateGlobalStatus(value);
            });
            this.openArticle = null;
            this.modalupdateArticle.hide();

          }, (error) => {
            this.loadingFormArticleEdit = false;
            if (error.error.message === undefined){
              this.formArticleErrorEdit = error.error;
            }
            else{
              this.formArticleErrorEdit = error.error.message;
            }
            console.log(error.error);

          }, () => {

          });


        }, (error) => {
          if (error.error.message === undefined){
            this.formArticleErrorEdit = error.error;
          }
          else{
            this.formArticleErrorEdit = error.error.message;
          }
          console.log(error.error);
          this.loadingFormArticleEdit = false;
        }, () => {
        });

      }
    }
  }

  clickMethod(name: string) {
    if (confirm('Are you sure to delete ' +  name)) {
      console.log('Implement delete functionality here');
    }
  }

  openModal(art: Article, template: TemplateRef<any>) {
    this.openArticle = art;
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'login modal-small' }));
  }

  confirmed() {}

  cancelled() {
  }

  deleteArticle(){
    this.loading = true;
    this.entityService.deleteArticle({id: this.openArticle.id}).subscribe((res: Article) => {
      this.loading = false;
      let index = -1;
      let remove = 0;
      this.articles.forEach((el) => {
        index = index + 1;
        if (parseInt(el.id, 10) === parseInt(this.openArticle.id, 10)){
          remove = index;
        }
      });
      this.articles.splice(remove, 1);
      this.openArticle = null;
      this.modalRef.hide();
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
