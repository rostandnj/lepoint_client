import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {City} from '../schema/City';

@Component({
  selector: 'app-home-search',
  templateUrl: './home-search.component.html',
  styleUrls: ['./home-search.component.css']
})
export class HomeSearchComponent implements OnInit {
  cities: City[];

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.httpClient.get('assets/city.json').subscribe((data: City[]) => {
      this.cities = data;
    });
  }

}
