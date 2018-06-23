import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartProvider } from '../../providers/cart/cart';
import { OrderProvider } from '../../providers/order/order';

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

  currentOrder: any = {
    stage: {
      placed: false,
      accepted: false,
      ready: false,
    }
  };
  
  /* statusCodes: Status = {
    placed: false,
    accepted: false,
    ready: false
  }; */

  constructor(public navCtrl: NavController, public navParams: NavParams, private cart: CartProvider, public order: OrderProvider) {

    console.log(navParams);
    
    this.notify(this.navParams.data.data.id, "PAID", this.navParams.data.data.id);

    /* setTimeout(() => {
      this.statusCodes.accepted = true;
      console.log('Accepted');
    }, 2000);
    
    setTimeout(() => {
      this.statusCodes.ready = true;
      console.log('Ready');
    }, 4000); */

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderStatusPage');
  }

  orderStatus(refID, id) {

    this.order.orderStatus(refID, id).subscribe(
      (doc) => {
        
        this.currentOrder = doc;
        console.log(this.currentOrder);

      }, (err) => {
        console.log(err);
      }
    )

  }

  notify(orderID, status, id) {
    this.cart.notifyStatus(orderID, status).subscribe(
      (response) => {
        this.orderStatus(response.refid, id);
      }, (error) => {

      }
    )
  }



}
