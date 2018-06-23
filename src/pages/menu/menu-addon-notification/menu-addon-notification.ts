import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the MenuAddonNotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu-addon-notification',
  templateUrl: 'menu-addon-notification.html',
})
export class MenuAddonNotificationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuAddonNotificationPage');
  }

  repeat(status) {
    this.viewCtrl.dismiss(status);
  }

  dismiss() {
    this.viewCtrl.dismiss(null);
  }

}
