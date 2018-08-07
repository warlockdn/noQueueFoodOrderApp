import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Storage } from '@ionic/storage';

import 'rxjs/add/operator/map';
/*
  Generated class for the OrderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OrderProvider {

  public onGoingOrder: boolean = false;
  public status: any;

  constructor(public http: HttpClient, public angularfire: AngularFirestore, public storage: Storage) {
    console.log('Hello OrderProvider Provider');
  }

  isOnGoingOrder() {
    return this.storage.get("onGoing");
  }
  
  setOnGoingOrder() {
    this.storage.set("onGoing", true);
  }

  removeOnGoingOrder() {
    this.storage.remove("onGoing");
  }

  orderStatus(refID) {
    this.status = this.angularfire.collection("orders").doc(refID).valueChanges();
    
    this.status.subscribe(
      doc => {
        if (doc["stage"]["ready"]) {
          this.onGoingOrder = false;
          this.removeOnGoingOrder();
        }
      }
    )
    
    return this.status;
  }

  unSubOrderStatus() {
    this.status.unsubsribe();
  }

  getOrder(orderID) {

    const order = this.angularfire.collection("orders", ref => ref.where("id", "==", orderID));
    order.snapshotChanges().map(item => {
      item.map(d => {
        const docid = d.payload.doc.id;
        return docid;
      })  
    })
  }

}
