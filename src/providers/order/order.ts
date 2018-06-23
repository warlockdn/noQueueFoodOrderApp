import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
/*
  Generated class for the OrderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OrderProvider {

  constructor(public http: HttpClient, public angularfire: AngularFirestore) {
    console.log('Hello OrderProvider Provider');
  }

  orderStatus(refID, orderID) {
    const status = this.angularfire.collection("orders").doc(refID).valueChanges();
    return status;
  } 

}
