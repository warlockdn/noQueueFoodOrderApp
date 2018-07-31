import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the OrderDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {

  order: any;
  cartItems;
  subTotal;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.order = this.navParams.data["data"];
    // this.createCart();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetailPage');
  }

  createCart() {

    let cart = Object.keys(this.order.cart);
    let cartItems = [];

    cart.forEach(items => {

      debugger;
      this.order.cart[items].forEach(item => {
        cartItems.push(item);
      });

    });

    this.cartItems = cartItems;
    this.subTotal = this.order.total;

    console.log(this.cartItems);

  }

}
