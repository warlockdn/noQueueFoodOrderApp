import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { ConstantsProvider } from '../constants/constants';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the CartProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CartProvider {

  total: number = 0;
  totalItems: number = 0;

  constructor(public http: HttpClient, private storage: Storage) {
    console.log('Hello CartProvider Provider');
  }

  getCartData() {
    return this.storage.get("cartData").then(
      (data) => {
        return data;
      }, (err) => {
        return err
      }
    )
  }

  setCartData(cart) {
    this.storage.set("cartData", cart).then(
      (data) => {
        return data
      }, (err) => {
        return err
      }
    )
  }

  clearCartData() {
    this.storage.remove("cartData");
  }

  manageCart(cart): Observable<any> {
    return this.http.post(ConstantsProvider.cart, {
      partnerID: cart.partnerID,
      customerID: cart.customerID,
      cart: cart.cart,
      notes: cart.notes
    });
  }

  notifyStatus(orderID, status): Observable<any> {
    return this.http.post(ConstantsProvider.notifyStatus, {
      orderID: orderID,
      status: status
    });
  }

}
