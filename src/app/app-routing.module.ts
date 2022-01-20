import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {HomeListComponent} from './home-list/home-list.component';
import {RestaurantPageComponent} from './restaurant-page/restaurant-page.component';
import {RestaurantManagementComponent} from './restaurant-management/restaurant-management.component';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {BaseHomeComponent} from './base-home/base-home.component';
import {OwnerManagerComponent} from './owner-manager/owner-manager.component';
import {AdminManagerComponent} from './admin-manager/admin-manager.component';
import {ManagerManagerComponent} from './manager-manager/manager-manager.component';
import {UserOrdersComponent} from './user-orders/user-orders.component';
import {UserNotificationsComponent} from './user-notifications/user-notifications.component';
import {EntityMenuComponent} from './entity-menu/entity-menu.component';
import {EntityProductComponent} from './entity-product/entity-product.component';
import {EntitySimpleComponent} from './entity-simple/entity-simple.component';
import {EntityListComponent} from './entity-list/entity-list.component';
import {ManageEntityComponent} from './manage-entity/manage-entity.component';
import {TopManagerEntityComponent} from './top-manager-entity/top-manager-entity.component';
import {PlaceMenuComponent} from './place-menu/place-menu.component';
import {PlaceProductComponent} from './place-product/place-product.component';
import {PlaceComponent} from './place/place.component';
import {ShowAdvertComponent} from './show-advert/show-advert.component';
import {NightPharmacyComponent} from './night-pharmacy/night-pharmacy.component';
import {CocanComponent} from './cocan/cocan.component';
import {NewsComponent} from './news/news.component';
import {AdminBlogComponent} from './admin-blog/admin-blog.component';
import {ShowArticleComponent} from './show-article/show-article.component';


const routes: Routes = [
  { path: '', component: BaseHomeComponent},
  { path: 'restaurants', component: EntityListComponent},
  { path: 'lunches', component: EntityListComponent},
  { path: 'discos', component: EntityListComponent},
  { path: 'hostels', component: EntityListComponent},
  { path: 'office-institution', component: EntityListComponent},
  { path: 'art-culture', component: EntityListComponent},
  { path: 'pharmacies', component: EntityListComponent},
  { path: 'validation/account/:token', component: HomeComponent},
  { path: 'restaurant/:id/:name', component: PlaceMenuComponent},
  { path: 'lunch/:id/:name', component: PlaceMenuComponent},
  { path: 'snack-disco-club/:id/:name', component: PlaceMenuComponent},
  { path: 'pharmacy/:id/:name', component: PlaceProductComponent},
  { path: 'hostel/:id/:name', component: PlaceComponent},
  { path: 'art-culture/:id/:name', component: PlaceComponent},
  { path: 'office-institution/:id/:name', component: PlaceComponent},
  { path: 'advert/:slug', component: ShowAdvertComponent},
  { path: 'all-night/drugstore', component: NightPharmacyComponent},
  { path: 'manage/entity/:slug', component: ManageEntityComponent},
  { path: 'manage/dashboard', component: TopManagerEntityComponent},
  { path: 'manage/dashboard/admin', component: AdminManagerComponent},
  { path: 'manage/restaurant/manager', component: ManagerManagerComponent},
  { path: 'user/profil/@/:name/:id', component: UserProfileComponent},
  { path: 'my/orders', component: UserOrdersComponent},
  { path: 'my/notifications', component: UserNotificationsComponent},
  { path: 'cocan', component: CocanComponent},
  { path: 'news', component: NewsComponent},
  { path: 'manage/news', component: AdminBlogComponent},
  { path: 'article/:slug', component: ShowArticleComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
