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
  public cartData: any;

  constructor(public http: HttpClient, private storage: Storage) {
    console.log('Hello CartProvider Provider');
    this.getCartData(); 
  }

  getCartData() {
    return this.storage.get("cartData").then(
      (data) => {
        if (data) {
          this.cartData = data;
          this.total = data.total;
          this.totalItems = data.totalItems;
        }
        return data;
      }, (err) => {
        this.cartData = err;
        return err
      }
    )
  }

  setCartData(cart) {
    this.storage.set("cartData", cart).then(
      (data) => {
        this.cartData = data;
        return data
      }, (err) => {
        this.cartData = err;
        return err
      }
    )
  }

  clearCartData() {
    this.cartData = null;
    this.total = 0;
    this.totalItems = 0;
    this.storage.remove("cartData");
  }

  manageCart(cart): Observable<any> {

    console.log("Submitting Order: ", JSON.stringify(cart));

    return this.http.post(ConstantsProvider.cart, {
      partnerID: cart.partnerID,
      customerID: cart.customerID,
      cart: cart.cart,
      notes: cart.notes,
      partner: cart.partner
    });
  }

  notifyStatus(orderID, status): Observable<any> {
    return this.http.post(ConstantsProvider.notifyStatus, {
      orderID: orderID,
      status: status
    });
  }

}
