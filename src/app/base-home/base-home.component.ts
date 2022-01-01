import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../service/auth-service';
import {ConstantsService} from '../service/constants-service';
import {City} from '../schema/City';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-base-home',
  templateUrl: './base-home.component.html',
  styleUrls: ['./base-home.component.css']
})
export class BaseHomeComponent implements OnInit {
  loading = false;
  token: string;
  position = {};
  cities: City[];
  formSearch: FormGroup;

  constructor(private actRoute: ActivatedRoute, private authService: AuthService, private httpClient: HttpClient,
              private constantService: ConstantsService, private fb: FormBuilder, private router: Router) {
    this.formSearch = this.fb.group({
      city: ['', Validators.required],
      entity: ['', Validators.required],
    });

  }
  get f1() { return this.formSearch.controls; }

  ngOnInit(): void {
    this.token = this.actRoute.snapshot.params.token;
    if (this.token !== undefined){
      this.authService.activateAccount(this.token).subscribe((res: string) => {
        this.token = undefined;
        this.constantService.updateGlobalStatus(res);

      }, (error) => {
        this.constantService.updateGlobalStatus(error.error.message);
      }, () => {

      });

    }
    this.httpClient.get('assets/city.json').subscribe((data: City[]) => {
      this.cities = data;
    });
  }

  goToEntityPageByTown() {
    this.router.navigate([this.formSearch.value.entity], { queryParams: { c: this.formSearch.value.city } });
  }

}
