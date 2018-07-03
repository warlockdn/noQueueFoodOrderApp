import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AccountProvider } from '../../../providers/account/account';
import { Observable } from 'rxjs';

/**
 * Generated class for the OrderHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-history',
  templateUrl: 'order-history.html',
})
export class OrderHistoryPage {

  orders: Observable<Array<any>>;
  empty: Boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public accountProvider: AccountProvider) {
    this.getOrders()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderHistoryPage');
  }

  getOrders() {
    this.accountProvider.getOrders().subscribe(
      data => {
        console.log(data);
        if (data["orders"].length > 0) {
          this.orders = data["orders"];
        } else {
          this.empty = true;
        }
      }, err => {
        console.log(err);
      }
    )
  }

}
