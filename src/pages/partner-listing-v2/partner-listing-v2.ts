import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MenuPage } from '../menu/menu';

/**
 * Generated class for the PartnerListingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-partner-listing-v2',
  templateUrl: 'partner-listing-v2.html',
})
export class PartnerListingPageV2 {

  partners: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.partners = [
      {
        name: 'Taco Bell',
        images: {
          logo: 'https://www.seeklogo.net/wp-content/uploads/2016/11/taco-bell-logo-preview.png',
          large: '../../assets/temp/1.jpg'
        },
        cuisine: 'Mexican, Fast Food, American',
        avgtime: '15',
        avgpp: '250'
      }, {
        name: 'Dominos',
        images: {
          logo: 'https://seeklogo.com/images/D/domino-s-logo-5A72DDBD09-seeklogo.com.png',
          large: '../../assets/temp/2.jpg'
        },
        cuisine: 'Pizza, Fast Food, American',
        avgtime: '20',
        avgpp: '350'
      }, {
        name: 'Burger King',
        images: {
          logo: 'https://seeklogo.com/images/B/Burger_King-logo-487821F628-seeklogo.com.png',
          large: 'https://f.roocdn.com/images/menus/37868/header-image.jpg'
        },
        cuisine: 'Burgers, Fast Food, American',
        avgtime: '20',
        avgpp: '350'
      }, {
        name: 'Wat A Burger',
        images: {
          logo: 'https://seeklogo.com/images/B/Burger_King-logo-487821F628-seeklogo.com.png',
          large: '../../assets/temp/4.jpg'
        },
        cuisine: 'Burgers, Fast Food, American, Indian',
        avgtime: '10',
        avgpp: '150'
      }
    ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PartnerListingPageV2');
  }

  loadMenu() {
    this.navCtrl.push(MenuPage, {}, {
      animate: true,
      direction: 'forward'
    });
  }

}
