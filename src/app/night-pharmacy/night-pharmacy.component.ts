import {Component, OnInit, TemplateRef} from '@angular/core';
import {EntityService} from '../service/entity-service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../service/auth-service';
import {ConstantsService} from '../service/constants-service';
import {FormBuilder, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Config} from '../config';
import {NightPharmacy} from '../schema/NightPharmacy';
import {Subscription} from 'rxjs';
import {City} from '../schema/City';
import {User} from '../schema/User';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {BsModalService} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-night-pharmacy',
  templateUrl: './night-pharmacy.component.html',
  styleUrls: ['./night-pharmacy.component.css']
})
export class NightPharmacyComponent implements OnInit {
  loading = true;
  pharmacies: NightPharmacy[];
  globalAlertStatusSubscription: Subscription;
  globalAlertStatus = '';
  cities: City[];
  modalPharmacy: BsModalRef;
  openPharmacy: NightPharmacy;
  configLinkPharmacy = Config.apiUrl + Config.getQrCodePharmacy;

  constructor( private entityService: EntityService, private router: Router, private actRoute: ActivatedRoute,
               private authService: AuthService, private constantService: ConstantsService, private fb: FormBuilder,
               private httpClient: HttpClient, private modalService: BsModalService) {
    this.pharmacies = [];
    this.cities = [];
    this.openPharmacy = null;
    this.globalAlertStatusSubscription = this.constantService.globalAlertStatusSubject.subscribe((res) => {
      this.globalAlertStatus = res;

    }, (error) => {
      console.log(error);
    }, () => {

    });
  }

  ngOnInit(): void {
    this.httpClient.get('assets/city.json').subscribe((data: City[]) => {
      this.cities = data;
    });

    this.entityService.listPharmacyNight({}).subscribe((res: NightPharmacy[]) => {
      this.loading = false;
      this.pharmacies = [];
      res.forEach((el) => {
        this.pharmacies.push(el);
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

  showDetail(template: TemplateRef<any>, phar: NightPharmacy) {
    this.openPharmacy = phar;
    this.modalPharmacy = this.modalService.show(template, Object.assign({}, { class: 'login' }));
  }
}
