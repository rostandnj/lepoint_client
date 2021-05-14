import { Component, OnInit, OnDestroy } from '@angular/core';
import {Entity} from '../schema/Entity';
import {Subscription} from 'rxjs';
import {Config} from '../config';
import {EntityService} from '../service/entity-service';

@Component({
  selector: 'app-home-list',
  templateUrl: './home-list.component.html',
  styleUrls: ['./home-list.component.css']
})
export class HomeListComponent implements OnInit, OnDestroy {
  entities: Entity[];
  loading = true;
  loadingMore = false;
  entitiesSubscription: Subscription;
  entitiesLoadMoreSubscription: Subscription;

  constructor( private entityService: EntityService) {
    this.entities = [];
    this.entitiesSubscription = this.entityService.entitiesSubject.subscribe((res) => {
      res.forEach((el) => {
        el.global_info.image = Config.apiUrl + 'uploads/profile/' + el.global_info.image;
        this.entities.push(el);
      });
      this.loading = false;

    }, (error) => {
      console.log(error);
    }, () => {

    });

    this.entitiesLoadMoreSubscription = this.entityService.canLoadMoreSubject.subscribe((data: boolean) => {
      this.loadingMore = data;
    }, (error) => {
      console.log(error);
    }, () => {});
  }

  counterGoodStar(i){
    const tab = [];
    for (let s = 1; s <= i; s++){
      tab.push(s);
    }
    return tab;
  }
  counterBadStar(i){
    const tab = [];
    const max = 5 - i;
    for (let s = 1; s <= max; s++){
      tab.push(s);
    }
    return tab;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void{
    if (this.entitiesSubscription) {this.entitiesSubscription.unsubscribe(); }
    if (this.entitiesLoadMoreSubscription) {this.entitiesLoadMoreSubscription.unsubscribe(); }
  }
  load() {
    this.loading = true;
    this.entityService.getMoreEntities('1');
  }
}
