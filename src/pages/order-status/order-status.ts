import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  statusCodes: Status = {
    placed: false,
    accepted: false,
    ready: false
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    // demo
    console.log('Placed');
    this.statusCodes.placed = true;
    
    setTimeout(() => {
      this.statusCodes.accepted = true;
      console.log('Accepted');
    }, 2000);
    
    setTimeout(() => {
      this.statusCodes.ready = true;
      console.log('Ready');
    }, 4000);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderStatusPage');
  }



}
