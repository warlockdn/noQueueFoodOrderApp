import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Storage } from '@ionic/storage';

/**
 * Generated class for the WalkthroughPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-walkthrough',
  templateUrl: 'walkthrough.html',
})
export class WalkthroughPage {

  slides = [
    {
      title: "Food menu at your finger tips",
      description: "Choose from range of food from your favorite restaurants. Order without waiting in a queue",
      image: "assets/imgs/ica-slidebox-img-3.png",
    }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
  }

  loadHome() {

    this.storage.set('tutorialSeen', true).then((success) => {
      this.navCtrl.setRoot('HomePage', {}, {
        animate: true,
        direction: "forward"
      });
    }).catch((err) => {
      console.error('Error storing into storage ', err);
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalkthroughPage');
  }

}
