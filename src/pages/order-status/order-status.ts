import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartProvider } from '../../providers/cart/cart';
import { OrderProvider } from '../../providers/order/order';

import { FirebaseProvider } from '../../providers/firebase/firebase';
import { HomePage } from '../home/home';

/**
 * Generated class for the OrderStatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export interface Status {
  placed: boolean,
  accepted: boolean,
  ready: boolean
}

@IonicPage()
@Component({
  selector: 'page-order-status',
  templateUrl: 'order-status.html',
})
export class OrderStatusPage {

  isPlacing: boolean = true;
  currentOrder: any = {
    stage: {
      placed: false,
      accepted: false,
      ready: false,
    }
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private cart: CartProvider, public order: OrderProvider, public firebase: FirebaseProvider) {

    console.log(navParams);
    
    this.notify(this.navParams.data.data.id, "PAID", this.navParams.data.data.id);
    this.currentOrder.id = this.navParams.data.data.id;
    this.firebase.listenToNotifications();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderStatusPage');
  }

  orderStatus(refID, id) {

    // Setting On Going Order
    this.order.setOnGoingOrder();

    this.order.orderStatus(refID).subscribe(
      (doc) => {

        this.currentOrder = doc;
        console.log(this.currentOrder);

        if (this.currentOrder["stage"]["declined"]) {
          this.isPlacing = false;
        }

      }, (err) => {
        console.log(err);
      }
    )

  }

  notify(orderID, status, id) {
    this.cart.notifyStatus(orderID, status).subscribe(
      (response) => {
        this.orderStatus(response.refid, id);
        this.order.setOnGoingOrder();
      }, (error) => {

      }
    )
  }



}
