import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import {} from '@ionic-native'

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
  couponAmount = 0;
  couponCode;
  totalItems: number = 0;
  public partnerName: string;
  public cartData: any;
  public finalCartData: any;
  public isLiveOrder: boolean = false;

  constructor(public http: HttpClient, private storage: Storage) {
    console.log('Hello CartProvider Provider');
    // this.clearCartData();
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
        this.partnerName = data.name;
        return data
      }, (err) => {
        this.cartData = err;
        return err
      }
    )
  }

  async getFinalCartData() {
    return this.storage.get("finalCartData")
  }

  setFinalCartData(cart) {
    this.storage.set("finalCartData", cart);
  }

  removeFinalCartData() {
    this.storage.remove("finalCartData");
  }

  clearCartData() {
    this.cartData = null;
    this.total = 0;
    this.totalItems = 0;
    this.storage.remove("cartData");
    this.storage.remove("finalCartData");
    this.storage.remove("firebaseRefID");
    this.storage.remove("liveOrder");
    this.storage.remove("table");
    this.storage.remove("liveOrderID");
  }

  setOrderID(orderID) {
    this.storage.set("liveOrderID", orderID);
  }

  getOrderID() {
    return this.storage.get("liveOrderID");
  }

  getLiveCart() {
    this.storage.get("liveOrder").then(
      (data) => {
        if (data) {
          this.isLiveOrder = true;
        } else {
          this.isLiveOrder = false;
        }
      }
    )
  }

  enableLiveCart() {
    this.storage.set("liveOrder", true).then(
      () => {
        this.isLiveOrder = true;
      }
    );
  }

  disableLiveCart() {
    this.storage.remove("liveOrder").then(
      () => {
        this.isLiveOrder = false;
      }
    )
  }

  setTableNo(tableNo) {
    this.storage.set("table", tableNo);
  }

  getTableNo() {
    return this.storage.get("table");
  }

  removeTableNo() {
    this.storage.remove("table");
  }

  setFirebaseRefID(refid) {
    this.storage.set("firebaseRefID", refid)
  }

  getFirebaseRefID() {
    return this.storage.get("firebaseRefID");
  }

  manageCart(cart): Observable<any> {

    console.log("Submitting Order: ", JSON.stringify(cart));

    return this.http.post(ConstantsProvider.cart, {
      partnerID: cart.partnerID,
      customerID: cart.customerID,
      cart: cart.cart,
      notes: cart.notes,
      partner: cart.partner,
      room: cart.room || null,
      table: cart.table || null,
      couponCode: this.couponCode || null,
      orderType: cart.orderType || "NORMAL"
    });
  }

  updateCart(cart): Observable<any> {

    console.log("Updating Order: ", JSON.stringify(cart));

    return this.http.patch(ConstantsProvider.cart, {
      orderID: cart.orderID,
      partnerID: cart.partnerID,
      customerID: cart.customerID,
      cart: cart.cart,
      partner: cart.partner,
      refid: cart.refid,
      orderType: "LIVE"
    });
  }

  validateCoupon(couponcode, partnerID, cartTotal) {
    return this.http.post(ConstantsProvider.validateCoupon, {
      couponCode: couponcode,
      partnerID: partnerID,
      cartTotal: cartTotal
    })
  }

  getPaymentID(orderID) {
    return this.http.post(ConstantsProvider.getPaymentID, {
      orderID: orderID
    })
  }

  capturePayment(orderID, paymentID, amount, partnerID): Observable<any> {

    return this.http.post(ConstantsProvider.capturePayment, {
      orderID: orderID,
      paymentID: paymentID,
      amount: amount,
      partnerID: partnerID
    })

  }

  capturePaymentAndClose(orderID, paymentID, amount, partnerID, refid): Observable<any> {

    return this.http.post(ConstantsProvider.capturePaymentClose, {
      orderID: orderID,
      paymentID: paymentID,
      amount: amount,
      partnerID: partnerID,
      refid: refid
    })

  }

  notifyStatus(orderID, status): Observable<any> {
    return this.http.post(ConstantsProvider.notifyStatus, {
      orderID: orderID,
      status: status
    });
  }

  /**
   * Helper Function to Check whether the list of Cart Items 
   * has any isNewItem or lastCount
   */
  checkCartList(cart) {

    if (cart.length === 0) {
      return true;
    }

    let clearCart = false;

    for (let index = 0; index < cart.length; index++) {
      const item = cart[index];

      if (item.isNewItem) {
        clearCart = true;
        break;
      }

      if (item.lastCount) {
        if (item.lastCount !== item.quantity) {
          clearCart = true;
          break;
        }
      }
      
    }

    return clearCart;

  }

}
