import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Entity} from '../schema/Entity';
import {Observable, Subscription} from 'rxjs';
import {EntityService} from '../service/entity-service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../service/auth-service';
import {ConstantsService} from '../service/constants-service';
import {Config} from '../config';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {City} from '../schema/City';
import {HttpClient} from '@angular/common/http';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Coord} from '../schema/Coord';
import {GoogleMap, MapDirectionsService, MapInfoWindow} from '@angular/google-maps';
import {map} from 'rxjs/operators';

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
  modalMap: BsModalRef;
  zoom = 12;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 18,
    minZoom: 3,
    center: this.center
  };
  currentPosition: Coord;
  currentPositionSubscription: Subscription;
  markers = [];
  mapType = 'roadmap';
  iconMap = null;
  centerMap = null;
  directionsResults$: Observable<google.maps.DirectionsResult|undefined>;

  constructor( private entityService: EntityService, private router: Router, private actRoute: ActivatedRoute,
               private authService: AuthService, private constantService: ConstantsService, private fb: FormBuilder,
               private httpClient: HttpClient, private modalService: BsModalService,
               private mapDirectionsService: MapDirectionsService) {
    this.iconMap = {
      url: 'assets/img/resto.png',
      labelOrigin: new google.maps.Point(15, 40)
    };
    this.center = null;
    this.entities = [];
    this.currentPosition = {latitude: '', longitude: ''};
    this.center = null;
    this.entitiesToShow = [];
    this.entitiesSubscription = this.entityService.entitiesSubject.subscribe((res) => {
      this.isSearch = false;
      if (this.isStart === true){
        this.entitiesToShow = [];
        this.entities = [];
        this.markers = [];
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
        if (el.location.latitude !== null){
          this.markers.push(
            {
              position: {
                lat: Number(el.location.latitude) ,
                lng: Number(el.location.longitude),
              },
              label: {
                color: 'red',
                text: el.global_info.name,
                fontWeight: 'bold',
                fontSize: '12px'
              },
              title: el.global_info.name,
              clickable: true,
              id: el.id,
              ling: el.link,
              slug: el.global_info.slug,
              options: { },
            }
          );
        }
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
        this.markers = [];
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
        if (el.location.latitude !== null){
          this.markers.push(
            {
              position: {
                lat: Number(el.location.latitude) ,
                lng: Number(el.location.longitude),
              },
              label: {
                color: 'red',
                text: el.global_info.name,
                fontWeight: 'bold',
                fontSize: '12px'
              },
              title: el.global_info.name,
              clickable: true,
              id: el.id,
              ling: el.link,
              slug: el.global_info.slug,
              options: { },
            }
          );
        }
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

    this.currentPositionSubscription = this.constantService.currentPositionSubject.subscribe((res) => {
      this.currentPosition = res;
      this.center = {lat: Number(this.currentPosition.latitude), lng: Number(this.currentPosition.longitude)};
      this.centerMap = {
        position: {
          lat: this.center.lat ,
          lng: this.center.lng,
        },
        label: {
          color: 'red',
          text: 'Me ',
          fontWeight: 'bold',
          fontSize: '12px'
        },
        title: 'Me',
        clickable: false,
        id: 'nj',
        options: { },
      };
      this.markers.push(
        this.centerMap
      );

    }, (error) => {
      console.log(error);
    }, () => {

    });
  }

  get f1() { return this.formSearch.controls; }

  ngOnInit(): void {
    this.center = {lat: Number('3.860934195914553'), lng: Number('11.520466610495909')};
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

    if (this.constantService.currentPositionIsOk){
      this.centerMap = {
        position: {
          lat: Number(this.constantService.currentPosition.latitude) ,
          lng: Number(this.constantService.currentPosition.longitude),
        },
        label: {
          color: 'red',
          text: 'Me ',
          fontWeight: 'bold',
          fontSize: '12px'
        },
        title: 'Me',
        clickable: false,
        id: 'nj',
        options: { },
      };
      this.options.center = new google.maps.LatLng(Number(this.constantService.currentPosition.latitude),
        Number(this.constantService.currentPosition.longitude));
      this.markers.push(
        this.centerMap
      );
    }
    else{
      this.centerMap = {
        position: {
          lat: Number('3.860934195914553') ,
          lng: Number('11.520466610495909'),
        },
        label: {
          color: 'red',
          text: 'POSTE ',
          fontWeight: 'bold',
          fontSize: '12px'
        },
        title: 'Poste',
        clickable: false,
        id: 'nj',
        options: { },
      };
      this.markers.push(
        this.centerMap
      );
    }

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

  zoomIn() {
    if (this.zoom < this.options.maxZoom) { this.zoom++; }
    console.log(this.zoom);
  }

  zoomOut() {
    if (this.zoom > this.options.minZoom) { this.zoom--; }
    console.log(this.zoom);
  }

  public openMap(template: TemplateRef<any>) {
    if (this.centerMap !== null){
      this.markers.push(
        this.centerMap
      );
    }
    this.modalMap = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }

  clickMap($event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) {
  }

  openInfoWindow(marker) {
    if (marker.id !== 'nj'){
      this.modalMap.hide();
      this.router.navigate([marker.ling + marker.id.toString() + '/' + marker.slug]);
      /*const request: google.maps.DirectionsRequest = {
        destination: {lat: marker.position.lat, lng: marker.position.lng},
        origin: {lat: this.center.lat, lng: this.center.lng},
        travelMode: google.maps.TravelMode.DRIVING
      };
      this.directionsResults$ = this.mapDirectionsService.route(request).pipe(map(response => response.result));*/
    }
  }
}
