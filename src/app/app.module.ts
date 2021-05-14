import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {Interceptor} from './service/interceptor';
import {ApiService} from './service/api-service';
import {isObject} from 'rxjs/internal-compatibility';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ConstantsService} from './service/constants-service';
import { HomeComponent } from './home/home.component';
import { HomeListComponent } from './home-list/home-list.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { HomeSearchComponent } from './home-search/home-search.component';
import { RestaurantPageComponent } from './restaurant-page/restaurant-page.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import {AuthService} from './service/auth-service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { RestaurantManagementComponent } from './restaurant-management/restaurant-management.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { BaseHomeComponent } from './base-home/base-home.component';
import { GlobalSearchComponent } from './global-search/global-search.component';
import { AdminManagerComponent } from './admin-manager/admin-manager.component';
import { OwnerManagerComponent } from './owner-manager/owner-manager.component';
import { ManagerManagerComponent } from './manager-manager/manager-manager.component';
import { UserOrdersComponent } from './user-orders/user-orders.component';
import { UserNotificationsComponent } from './user-notifications/user-notifications.component';
import { EntityMenuComponent } from './entity-menu/entity-menu.component';
import { EntityProductComponent } from './entity-product/entity-product.component';
import { EntitySimpleComponent } from './entity-simple/entity-simple.component';
import { EntityListComponent } from './entity-list/entity-list.component';
import { ManageEntityComponent } from './manage-entity/manage-entity.component';
import { TopManagerEntityComponent } from './top-manager-entity/top-manager-entity.component';
import { PlaceMenuComponent } from './place-menu/place-menu.component';
import { PlaceProductComponent } from './place-product/place-product.component';
import { PlaceComponent } from './place/place.component';
import { ShowAdvertComponent } from './show-advert/show-advert.component';
import { NightPharmacyComponent } from './night-pharmacy/night-pharmacy.component';



export function TranslationLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HomeListComponent,
    CategoryListComponent,
    HomeSearchComponent,
    RestaurantPageComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RestaurantManagementComponent,
    UserProfileComponent,
    BaseHomeComponent,
    GlobalSearchComponent,
    AdminManagerComponent,
    OwnerManagerComponent,
    ManagerManagerComponent,
    UserOrdersComponent,
    UserNotificationsComponent,
    EntityMenuComponent,
    EntityProductComponent,
    EntitySimpleComponent,
    EntityListComponent,
    ManageEntityComponent,
    TopManagerEntityComponent,
    PlaceMenuComponent,
    PlaceProductComponent,
    PlaceComponent,
    ShowAdvertComponent,
    NightPharmacyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    SlickCarouselModule,
    TranslateModule.forRoot({
      defaultLanguage: 'fr',
      loader: {provide: TranslateLoader, useFactory: TranslationLoaderFactory, deps: [HttpClient]}
    }),
    BrowserAnimationsModule,
    ReactiveFormsModule,
  ],
  providers: [CookieService, ConstantsService, ApiService, TranslateService, AuthService,
    {provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true}, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
