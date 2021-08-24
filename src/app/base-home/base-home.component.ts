import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../service/auth-service';
import {ConstantsService} from '../service/constants-service';

@Component({
  selector: 'app-base-home',
  templateUrl: './base-home.component.html',
  styleUrls: ['./base-home.component.css']
})
export class BaseHomeComponent implements OnInit {
  loading = false;
  token: string;
  position = {};

  constructor(private actRoute: ActivatedRoute, private authService: AuthService,
              private constantService: ConstantsService) {

  }

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
  }

}
