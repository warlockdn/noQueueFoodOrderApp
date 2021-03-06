import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';

import { AuthProvider } from '../auth/auth';
import { Observable, Unsubscribable } from 'rxjs';

/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseProvider {

  subscribe: any;
  order: any;
  latestStatus: any;
  public currentOrder: any = {
    stage: {
      placed: false,
      accepted: false,
      ready: false,
    }
  };

  constructor(public http: HttpClient, public afs: AngularFirestore, public firebaseNative: Firebase, private platform: Platform, public auth: AuthProvider) {
    console.log('Hello FirebaseProvider Provider');
  }

  // Get permission from the user
  async getToken() {

    let token;

    if (this.platform.is("android")) {
      console.log("Fetching Token...");
      token = await this.firebaseNative.getToken();
    }

    if (this.platform.is('ios')) {
      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();
    }

    return this.saveTokenToFirestore(token)

  }

  // Save the token to firestore
  private saveTokenToFirestore(token) {
    if (!token) return;

    console.log("Token: ", token);
    const devicesRef = this.afs.collection('devices')

    // Save only one device token per userid
    const docData = { 
      token,
      userId: (this.auth.user.id).toString(), 
    }

    return devicesRef.doc(docData.userId).set(docData);
  }

  deleteToken() {
    const devices = this.afs.collection("devices");
    const userID = (this.auth.user.id).toString();
    return devices.doc(userID).delete();
  }

  // Listen to incoming FCM messages
  listenToNotifications() {
    return this.firebaseNative.onNotificationOpen();
  }

  unregister() {
    return this.firebaseNative.unregister();
  }

  getOrder(orderID) {
    
    this.subscribe = this.afs.collection("orders", ref => ref.where("id", "==", orderID).limit(1)).valueChanges().subscribe(data => {
      this.order = data[0];
      this.currentOrder = data[0];
      console.log(this.order);
    })

  }

  unSubOrder() {
    this.subscribe.unsubscribe();
  }

}
