import {Component, OnDestroy, OnInit} from '@angular/core';
import {Entity} from '../schema/Entity';
import {Subscription} from 'rxjs';
import {EntityService} from '../service/entity-service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../service/auth-service';
import {ConstantsService} from '../service/constants-service';
import {Config} from '../config';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {City} from '../schema/City';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-entity-list',
  templateUrl: './entity-list.component.html',
  styleUrls: ['./entity-list.component.css']
})
export class EntityListComponent implements OnInit, OnDestroy {

  entities: Entity[];
  entitiesToShow: Entity[];
  entitiesSubscription: Subscription;
  entitiesSearchSubscription: Subscription;
  entitiesLoadMoreSubscription: Subscription;
  entitiesLoadMoreSearchSubscription: Subscription;
  globalAlertStatusSubscription: Subscription;
  globalAlertStatus = '';
  entityType = '';
  entityShowNote = true;
  loading = true;
  loadingMore = false;
  canLoadingSearchMore = false;
  formSearch: FormGroup;
  cities: City[];
  isSearch = false;
  isSearchMore = false;
  loadingSearchMore = false;
  isStart = true;

  constructor( private entityService: EntityService, private router: Router, private actRoute: ActivatedRoute,
               private authService: AuthService, private constantService: ConstantsService, private fb: FormBuilder,
               private httpClient: HttpClient) {
    this.entities = [];
    this.entitiesToShow = [];
    this.entitiesSubscription = this.entityService.entitiesSubject.subscribe((res) => {
      this.isSearch = false;
      if (this.isStart === true){
        this.entitiesToShow = [];
        this.entities = [];
      }
      res.forEach((el) => {
        if (parseInt(el.type, 10) === 1){
          el.link = 'restaurant/';
        }
        if (parseInt(el.type, 10) === 2){
          el.link = 'lunch/';
        }
        if (parseInt(el.type, 10) === 3){
          el.link = 'snack-disco-club/';
        }
        if (parseInt(el.type, 10) === 4){
          el.link = 'hostel/';
        }
        if (parseInt(el.type, 10) === 5){
          el.link = 'art-culture/';
        }
        if (parseInt(el.type, 10) === 6){
          el.link = 'office-institution/';
        }
        if (parseInt(el.type, 10) === 7){
          el.link = 'pharmacy/';
        }
        if (!el.global_info.image.includes(Config.apiUrl)){
          el.global_info.image = Config.apiUrl + 'uploads/profile/' + el.global_info.image;
        }
        this.entities.push(el);
        this.entitiesToShow.push(el);
      });
      this.loading = false;


    }, (error) => {
      console.log(error);
    }, () => {

    });

    this.globalAlertStatusSubscription = this.constantService.globalAlertStatusSubject.subscribe((res) => {
      this.globalAlertStatus = res;

    }, (error) => {
      console.log(error);
    }, () => {

    });

    this.entitiesLoadMoreSubscription = this.entityService.canLoadMoreSubject.subscribe((data: boolean) => {
      this.loadingMore = data;
    }, (error) => {
      console.log(error);
    }, () => {});
    this.formSearch = this.fb.group({
      city: ['Yaoundé', Validators.required],
    });

    this.entitiesSearchSubscription = this.entityService.entitiesSearchSubject.subscribe((res) => {
      this.isSearch = true;
      if (this.isSearchMore === false){
        this.entitiesToShow = [];
        this.entities = [];
      }
      res.forEach((el) => {
        if (parseInt(el.type, 10) === 1){
          el.link = 'restaurant/';
        }
        if (parseInt(el.type, 10) === 2){
          el.link = 'lunch/';
        }
        if (parseInt(el.type, 10) === 3){
          el.link = 'snack-disco-club/';
        }
        if (parseInt(el.type, 10) === 4){
          el.link = 'hostel/';
        }
        if (parseInt(el.type, 10) === 5){
          el.link = 'art-culture/';
        }
        if (parseInt(el.type, 10) === 6){
          el.link = 'office-institution/';
        }
        if (parseInt(el.type, 10) === 7){
          el.link = 'pharmacy/';
        }
        if (!el.global_info.image.includes(Config.apiUrl)){
          el.global_info.image = Config.apiUrl + 'uploads/profile/' + el.global_info.image;
        }
        this.entitiesToShow.push(el);
      });
      this.loading = false;
      this.loadingSearchMore = false;


    }, (error) => {
      console.log(error);
    }, () => {

    });


    this.entitiesLoadMoreSearchSubscription = this.entityService.canLoadMoreSearchSubject.subscribe((data: boolean) => {
      this.canLoadingSearchMore = data;
    }, (error) => {
      console.log(error);
    }, () => {});
  }

  get f1() { return this.formSearch.controls; }

  ngOnInit(): void {
    if (this.router.url === '/restaurants'){
      this.entityType = '1';
    }
    if (this.router.url === '/lunches'){
      this.entityType = '2';
    }
    if (this.router.url === '/discos'){
      this.entityType = '3';
    }
    if (this.router.url === '/hostels'){
      this.entityType = '4';
    }
    if (this.router.url === '/art-culture'){
      this.entityType = '5';
    }
    if (this.router.url === '/office-institution'){
      this.entityType = '6';
      this.entityShowNote = false;
    }
    if (this.router.url === '/pharmacies'){
      this.entityType = '7';
      this.entityShowNote = false;
    }
    if (this.entityType === ''){
      this.entityService.getEntities('');
    }
    else{
      this.entityService.getEntities(this.entityType);
    }
    this.httpClient.get('assets/city.json').subscribe((data: City[]) => {
      this.cities = data;
    });

  }

  ngOnDestroy(): void{
    if (this.entitiesSubscription) {this.entitiesSubscription.unsubscribe(); }
    if (this.globalAlertStatusSubscription) {this.globalAlertStatusSubscription.unsubscribe(); }
  }

  load() {
    this.loading = true;
    this.isStart = false;
    this.entityService.getMoreEntitiesHome(this.entityType);
  }

  searchEntity() {
    this.isSearch = true;
    this.isSearchMore = false;
    this.loading = true;
    this.entityService.searchEntities(this.entityType, this.formSearch.value.city, '');
  }

  searchEntityMore(){
    this.isSearch = true;
    this.isSearchMore = true;
    this.loadingSearchMore = true;
    this.entityService.searchEntitiesMore(this.entityType, this.formSearch.value.city, '');
  }

  showAll() {
    this.isSearch = false;
    this.isStart = true;
    this.isSearchMore = false;
    this.entityService.getEntities(this.entityType);
  }
}
