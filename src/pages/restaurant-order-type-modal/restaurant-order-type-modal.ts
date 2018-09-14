import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

/**
 * Generated class for the RestaurantOrderTypeModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-restaurant-order-type-modal',
  templateUrl: 'restaurant-order-type-modal.html',
})
export class RestaurantOrderTypeModalPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RestaurantOrderTypeModalPage');
  }

  selectedOrderType(type) {
    this.viewCtrl.dismiss({
      type: type
    })
  }

  seatno() {
    const seatPrompt = this.alertCtrl.create({
      title: "Enter Table No.",
      message: "Please enter table number",
      inputs: [{
        name: "table",
        placeholder: "Table No."
      }],
      buttons: [{
        text: "Cancel",
        handler: data => {

        }
      }, {
        text: "Proceed",
        handler: data => {
          console.log("Proceed");
          if (data.table !== "") {
            this.viewCtrl.dismiss({
              type: "dine",
              table: data.table
            })
          }
        }
      }]
    })

    seatPrompt.present();

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
