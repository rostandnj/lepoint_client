import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../service/auth-service';
import {ConstantsService} from '../service/constants-service';
import {EntityService} from '../service/entity-service';
import {Entity} from '../schema/Entity';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  entities: Entity[];
  restaurantsSubscription: Subscription;
  token: string;
  globalAlertStatusSubscription: Subscription;
  globalAlertStatus = '';

  constructor( private entityService: EntityService, private actRoute: ActivatedRoute,
               private authService: AuthService, private constantService: ConstantsService, private router: Router) {
    this.restaurantsSubscription = this.entityService.entitiesSubject.subscribe((res) => {

      this.entities = res;

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
  }

  ngOnDestroy(): void{
    if (this.restaurantsSubscription) {this.restaurantsSubscription.unsubscribe(); }
    if (this.globalAlertStatusSubscription) {this.globalAlertStatusSubscription.unsubscribe(); }
  }

  ngOnInit(): void {
    this.entityService.getEntities('1');
    this.token = this.actRoute.snapshot.params.token;
    if (this.token !== undefined){
      this.authService.activateAccount(this.token).subscribe((res: string) => {
        this.token = undefined;
        this.constantService.updateGlobalStatus(res);
        setTimeout(() => {
          this.router.navigate(['']);
        }, 3000);

      }, (error) => {
        if (error.error.message === undefined){
          this.constantService.updateGlobalStatus(error.error);
        }else{
          this.constantService.updateGlobalStatus(error.error.message);
        }

        setTimeout(() => {
          this.router.navigate(['']);
        }, 3000);
      }, () => {

      });

    }
  }

}
