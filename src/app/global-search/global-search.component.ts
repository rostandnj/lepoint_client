import { Component, OnInit } from '@angular/core';
import {City} from '../schema/City';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.css']
})
export class GlobalSearchComponent implements OnInit {

  cities: City[];

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.httpClient.get('assets/city.json').subscribe((data: City[]) => {
      this.cities = data;
    });
  }

}
