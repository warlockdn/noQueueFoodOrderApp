import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FirebaseProvider } from '../../../providers/firebase/firebase';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: FirebaseProvider, public modalCtrl: ModalController) {
    this.order = this.navParams.data["data"];
    this.firebase.order = null;
    // this.createCart();
    if (this.order.status === "PAID" || this.order.status === "ACCEPTED") {
      this.firebase.getOrder(this.order.id)
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetailPage');
  }

  ionViewDidLeave() {

    if (this.firebase.order) {
      this.firebase.unSubOrder();
    }

  }

  createCart() {

    let cart = Object.keys(this.order.cart);
    let cartItems = [];

    cart.forEach(items => {
      this.order.cart[items].forEach(item => {
        cartItems.push(item);
      });

    });

    this.cartItems = cartItems;
    this.subTotal = this.order.total;

    console.log(this.cartItems);

  }

}
