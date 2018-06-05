import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

import { ConstantsProvider } from "../constants/constants";

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  public user: any;

  constructor(public http: HttpClient, private storage: Storage) {
    console.log('Hello AuthProvider Provider');
  }

  setUser(user) {
    this.storage.set("user", JSON.stringify(user));
  }

  getUser() {
    this.storage.get("user").then((user) => {
      return user
    }).catch((err) => {
      return err
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

}
