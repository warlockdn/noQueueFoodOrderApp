import { Events } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ConstantsProvider } from "../constants/constants";

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  public user: any;
  public isLoggedIn: boolean = false;
  public fromCart: boolean = false;

  constructor(public http: HttpClient, private storage: Storage, public events: Events) {
    console.log('Hello AuthProvider Provider');
    this.getUser();
  }

  loggedInStatus(): Promise<boolean> {
    return this.storage.get('isLoggedIn').then((value) => {
      return value === true;
    })
  }

  setUser(user) {
    this.isLoggedIn = true;
    console.log('User LoggedIn: ', user);
    this.storage.set("user", user);
    this.storage.set("isLoggedIn", true);
    this.user = user;
    setTimeout(() => {
      this.events.publish("user:login");
    }, 200);

  }

  getUser() {
    this.storage.get("user").then((user) => {
      if (user) { 
        this.user = user;
        this.isLoggedIn = true;
      };
      return user
    }).catch((err) => {
      return err
    });
  }

  checkUser(phone): Observable<any> {
    return this.http.post(ConstantsProvider.findCustomer, {
      phone: phone
    });
  }

  registration(user) {

    const newUser = {
      name: user.name,
      phone: user.phone,
      email: user.email,
      password: user.password
    }

    return new Promise((resolve: (success) => void, reject: (reason: Error) => void) => {
      this.http.post(`${ConstantsProvider.register}`, 
        {
          user: newUser
        }).subscribe(
        response => {
          resolve(response);
        }, error => {
          reject(error);
        }
      )
    })

  }

  authenticate(user): Observable<any> {
    return this.http.post(ConstantsProvider.authByPhonePass, {
      phone: user.phone,
      password: user.password
    })
  }

  logout() {
    this.storage.remove("isLoggedIn");
    this.storage.remove("token");
    this.storage.remove("user");
    this.isLoggedIn = false;
  }

}
