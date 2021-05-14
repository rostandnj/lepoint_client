import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {ApiService} from './api-service';
import {Config} from '../config';
import {Entity} from '../schema/Entity';
import {Cart} from '../schema/Cart';
import {CartItem} from '../schema/CartItem';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  entities: Entity[];
  entitiesSearch: Entity[];
  entitiesSubject = new Subject<Entity[]>();
  entitiesSearchSubject = new Subject<Entity[]>();
  limit = 20;
  offset = 0;
  uLimit = 20;
  aLimit = 20;
  uOffset = 0;
  hOffset = 0;
  aOffset = 0;
  homeOffset = 0;
  homeSearchOffset = 0;
  userOffset = 0;
  userLimit = 20;
  canLoadMore = false;
  canLoadMoreSearch = false;
  canLoadMoreSubject = new Subject<boolean>();
  canLoadMoreSearchSubject = new Subject<boolean>();
  cart: Cart;
  cartSubject = new Subject<Cart>();
  constructor(private apiService: ApiService) {
    if (localStorage.getItem('cart') === null){
      this.cart = {items: [], totalPrice: 0, location: '', contact: ''};
    }
    else{
      this.cart = JSON.parse(localStorage.getItem('cart'));
    }
    // f
  }

  emitEntities() {
    this.entitiesSubject.next(this.entities);
  }

  emitEntitiesSearch() {
    this.entitiesSearchSubject.next(this.entitiesSearch);
  }

  emitCart() {
    this.cartSubject.next(this.cart);
  }

  emitCanLoadMore(){
    this.canLoadMoreSubject.next(this.canLoadMore);
  }

  emitCanLoadSearchMore(){
    this.canLoadMoreSearchSubject.next(this.canLoadMoreSearch);
  }

  updateList(data: Entity[]){
    this.offset = this.offset + this.limit;
    data.forEach((r) => {
      this.entities.push(r);
    });
    if (data.length >= this.limit){
      this.canLoadMore = true;
    }
    else{
      this.canLoadMore = false;
    }
    this.emitEntities();
    this.emitCanLoadMore();
  }

  getEntities(entityType: string) {
    this.homeOffset = 0;
    this.apiService.post(Config.entityList, {limit: this.limit, offset: this.homeOffset, type: entityType}).
    subscribe((res: Entity[]) => {
      this.entities = res;
      this.emitEntities();
      this.homeOffset = this.homeOffset + this.limit;
      this.canLoadMore = res.length === this.limit;
      this.emitCanLoadMore();

    }, (error => {
      return error;
    }));
  }

  getMoreEntitiesHome(entityType: string) {
    this.apiService.post(Config.entityList, {limit: this.limit, offset: this.homeOffset, type: entityType}).
    subscribe((res: Entity[]) => {
      this.entities = res;

      this.emitEntities();
      this.homeOffset = this.homeOffset + this.limit;
      this.canLoadMore = res.length === this.limit;
      this.emitCanLoadMore();

    }, (error => {
      return error;
    }));
  }

  getMoreEntities(entityType: string) {
    return this.apiService.post(Config.userEntities, {limit: this.limit, offset: this.offset, type: entityType});
  }

  getUserEntities(entityType: string){
    this.offset = 0;
    return this.apiService.post(Config.userEntities, {limit: this.limit, offset: this.offset, type: entityType});

  }

  getAdminUser(start){
    if (start){
      this.userOffset = 0;
      return this.apiService.post(Config.allUsers, {limit: this.userLimit, offset: 0});
    }
    else{
      this.userOffset = this.userOffset + this.userLimit;
      return this.apiService.post(Config.allUsers, {limit: this.userLimit, offset: this.userOffset });
    }

  }

  registerEntityOwner(data){
    return this.apiService.post(Config.registerEntity, data);
  }

  registerEntityAdmin(data){
    return this.apiService.post(Config.registerEntityAdmin, data);
  }

  getOneEntity(data){
    return this.apiService.post(Config.getEntityDetails, data);
  }

  getManagerEntity(data){
    return this.apiService.post(Config.getManagersEntity, data);
  }

  getEntityCategoriesMenu(data){
    return this.apiService.post(Config.getEntityCategoriesMenu, data);
  }

  getAllBaseCategories(){
    return this.apiService.post(Config.allBaseCategories, {});
  }

  getAllBaseCategoriesLunch(){
    return this.apiService.post(Config.allBaseCategoriesLunch, {});
  }

  getAllBaseCategoriesDrink(){
    return this.apiService.post(Config.allBaseCategoriesDrink, {});
  }

  getAllEntityBaseCategories(data){
    return this.apiService.post(Config.allEntityBaseCategories, data);
  }

  updateEntity(data){
    return this.apiService.post(Config.updateEntity, data);
  }

  createMenu(data){
    return this.apiService.post(Config.createMenu, data);
  }

  getCart(){
    return this.cart;
  }

  addItemToCart(item: CartItem){
    if (this.cart.items.length > 0){
      const first = this.cart.items[0];
      if (first.menu.entity.id === item.menu.entity.id){
        let test = false;
        this.cart.items.forEach((e) => {
          if (e.menu.id === item.menu.id){
            test = true;
          }

        });
        if (test === false){
          this.cart.items.push(item);
          this.emitCart();
          localStorage.setItem('cart', JSON.stringify(this.cart));
        }

      }else{
        this.cart.items = [];
        localStorage.removeItem('cart');
        this.cart.items.push(item);
        localStorage.setItem('cart', JSON.stringify(this.cart));

      }

    }
    else{
      this.cart.items = [];
      this.cart.items.push(item);
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
    this.emitCart();

  }

  removerItemToCart(id){
    if (this.cart.items.length > 0){
      let ind = null;
      this.cart.items.forEach((e, index ) => {
        if (parseInt(e.menu.id, 10) === parseInt(id, 10)){
          ind = index;
        }

      });
      if (ind !== null){
        this.cart.items.splice(ind, 1);
        localStorage.setItem('cart', JSON.stringify(this.cart));
      }

    }
    this.emitCart();
  }

  addItemQuantity(id){
    this.cart.items.forEach((e) => {
      if (e.menu.id === id){
        e.quantity = e.quantity + 1;
        this.emitCart();
      }
    });
  }

  removeItemQuantity(id){
    this.cart.items.forEach((e) => {
      if (e.menu.id === id){
        if (e.quantity > 1){
          e.quantity = e.quantity - 1;
          this.emitCart();
        }
        else{
          this.removerItemToCart(id);
        }
      }
    });

  }

  clearCart(){
    this.cart.items = [];
    localStorage.removeItem('cart');
    this.emitCart();

  }

  updateMenu(data) {
    return this.apiService.post(Config.updateMenu, data);
  }

  removeManager(data){
    return this.apiService.post(Config.removeManager, data);
  }

  addManager(data){
    return this.apiService.post(Config.addManager, data);
  }

  registerManager(data){
    return this.apiService.post(Config.registerManager, data);
  }

  entityOrders(data){
    return this.apiService.post(Config.entityOrders, data);
  }

  allEntityOrders(start){
    if (start){
      this.userOffset = 0;
      return this.apiService.post(Config.allEntityOrders, {limit: this.userLimit, offset: 0});
    }
    else{
      this.userOffset = this.userOffset + this.userLimit;
      return this.apiService.post(Config.allEntityOrders, {limit: this.userLimit, offset: this.userOffset });
    }
  }

  userOrders(data){
    return this.apiService.post(Config.userOrders, data);
  }

  updateOrderStatus(data){
    return this.apiService.post(Config.updateOrderStatus, data);
  }

  makeOrder(data){
    return this.apiService.post(Config.makeOrder, data);
  }

  makeOrderConnected(data){
    return this.apiService.post(Config.makeOrderConnected, data);
  }

  extendActivation(data){
    return this.apiService.post(Config.extendActivation, data);
  }

  addFlashMessage(data){
    return this.apiService.post(Config.addFlashMessage, data);
  }

  changeEntityCanOrder(data){
    return this.apiService.post(Config.changeEntityCanOrder, data);
  }

  addTopManager(data){
    return this.apiService.post(Config.addTopManager, data);
  }

  addAdvert(data){
    return this.apiService.post(Config.addAdvert, data);
  }

  updateAdvert(data){
    return this.apiService.post(Config.updateAdvert, data);
  }

  deleteAdvert(data){
    return this.apiService.post(Config.deleteAdvert, data);
  }

  listAdvert(data){
    return this.apiService.post(Config.listAdvert, data);
  }

  addProduct(data){
    return this.apiService.post(Config.addProduct, data);
  }

  updateProduct(data){
    return this.apiService.post(Config.updateProduct, data);
  }

  deleteProduct(data){
    return this.apiService.post(Config.deleteProduct, data);
  }

  listProduct(data){
    return this.apiService.post(Config.listProduct, data);
  }

  searchProduct(data){
    return this.apiService.post(Config.searchProduct, data);
  }

  searchEntity(data){
    return this.apiService.post(Config.searchEntity, data);
  }

  getAdminManagers(start){
    if (start){
      this.userOffset = 0;
      return this.apiService.post(Config.allManagers, {limit: this.userLimit, offset: 0});
    }
    else{
      this.userOffset = this.userOffset + this.userLimit;
      return this.apiService.post(Config.allManagers, {limit: this.userLimit, offset: this.userOffset });
    }

  }

  getAdminTopManagers(start){
    if (start){
      this.userOffset = 0;
      return this.apiService.post(Config.allTopManagers, {limit: this.userLimit, offset: 0});
    }
    else{
      this.userOffset = this.userOffset + this.userLimit;
      return this.apiService.post(Config.allTopManagers, {limit: this.userLimit, offset: this.userOffset });
    }

  }

  changeUserStatus(data){
    return this.apiService.post(Config.changeUserStatus, data);
  }

  changeEntityStatus(data){
    return this.apiService.post(Config.changeEntityStatus, data);
  }

  addEntityTopManager(data){
    return this.apiService.post(Config.addEntityTopManager, data);
  }

  removeEntityTopManager(data){
    return this.apiService.post(Config.removeEntityTopManager, data);
  }

  deleteMenuEntity(data){
    return this.apiService.post(Config.deleteMenuEntity, data);
  }

  addAcceptedPayMode(data){
    return this.apiService.post(Config.addAcceptedPayMode, data);
  }

  updateAcceptedPayMode(data){
    return this.apiService.post(Config.updateAcceptedPayMode, data);
  }

  removeAcceptedPayMode(data){
    return this.apiService.post(Config.removeAcceptedPayMode, data);
  }

  listPayMode(data){
    return this.apiService.post(Config.listPayMode, data);
  }

  searchAdvert(data){
    return this.apiService.post(Config.searchAdvert, data);
  }

  searchEntities(entityType: string, town: string, key: string) {
    this.homeSearchOffset = 0;
    this.apiService.post(Config.searchEntity, {limit: this.limit, offset: this.homeSearchOffset, type: entityType, city: town, name: key}).
    subscribe((res: Entity[]) => {
      this.entitiesSearch = res;
      this.emitEntitiesSearch();
      this.homeSearchOffset = this.homeSearchOffset + this.limit;
      this.canLoadMoreSearch = res.length === this.limit;
      this.emitCanLoadSearchMore();

    }, (error => {
      return error;
    }));
  }

  searchEntitiesMore(entityType: string, town: string, key: string) {
    this.apiService.post(Config.searchEntity, {limit: this.limit, offset: this.homeSearchOffset, type: entityType, city: town, name: key}).
    subscribe((res: Entity[]) => {
      this.entitiesSearch = res;
      this.emitEntitiesSearch();
      this.homeSearchOffset = this.homeSearchOffset + this.limit;
      this.canLoadMoreSearch = res.length === this.limit;
      this.emitCanLoadSearchMore();

    }, (error => {
      return error;
    }));
  }

  listPharmacyNight(data){
    return this.apiService.post(Config.listPharmacyNight, data);
  }

  addPharmacyNight(data){
    return this.apiService.post(Config.addPharmacyNight, data);
  }

  updatePharmacyNight(data){
    return this.apiService.post(Config.updatePharmacyNight, data);
  }

  deletePharmacyNight(data){
    return this.apiService.post(Config.deletePharmacyNight, data);
  }

  showAdvert(data){
    return this.apiService.post(Config.showAdvert, data);
  }
}
