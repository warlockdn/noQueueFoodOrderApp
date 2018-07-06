import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the ConstantsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConstantsProvider {

  public static razorPayKey = "rzp_test_8ZuXe81gFihhsI";
  public static api = "https://localhost:3003/v1/";
 
  // Auth
  public static findCustomer = "https://cs.spazefood.xyz/v1/auth/findCustomer";
  public static register = "https://cs.spazefood.xyz/v1/auth/registration";
  public static authByPhonePass = "https://cs.spazefood.xyz/v1/auth/login";
  public static authByOTP = "https://cs.spazefood.xyz/v1/auth/loginByOtp";

  // Places
  public static getPlaces = "https://cs.spazefood.xyz/v1/places/listPlaces";
  public static getMenu = "https://cs.spazefood.xyz/v1/places/menu/";

  // Cart
  public static cart = "https://cs.spazefood.xyz/v1/cart/manage";
  public static notifyStatus = "https://cs.spazefood.xyz/v1/cart/notify";

  // Account
  public static orderList = "https://cs.spazefood.xyz/v1/account/orders";

  public token = null;

  constructor(public http: HttpClient, private storage: Storage) {
    console.log('Hello ConstantsProvider Provider');
    this.getToken().then((token) => {
      if (token) {
        console.log(token);
        this.token = token;
      }
    })
  }

  getToken() {
    return this.storage.get("token").then((token) => {
      return token;
    }).catch((err) => {
      return err;
    })
  }

  setToken(token) {
    console.log('Setting Token ', token);
    this.storage.set("token", token);
    this.token = token;
  }

}
