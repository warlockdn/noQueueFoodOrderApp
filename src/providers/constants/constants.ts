import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  Generated class for the ConstantsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConstantsProvider {

  public static api = "http://localhost:3003/v1/";

  // Auth
  public static register = "http://localhost:3003/v1/auth/registration";
  public static authByPhonePass = "http://localhost:3003/v1/auth/login";
  public static authByOTP = "http://localhost:3003/v1/auth/loginByOtp";

  constructor(public http: HttpClient, private storage: Storage) {
    console.log('Hello ConstantsProvider Provider');
  }

  getToken() {
    this.storage.get("token").then((token) => {
      return token;
    }).catch((err) => {
      return err;
    })
  }

  setToken(token) {
    this.storage.set("token", token);
  }

}
