import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PartnerProvider, Place } from '../../providers/partner/partner';
import { CartProvider } from '../../providers/cart/cart';
import { Mixpanel } from '@ionic-native/mixpanel';

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

  partners: Array<any>;
  fakePlaces: Array<any> = new Array(3);
  notfound: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public partnerService: PartnerProvider, public cartProvider: CartProvider, private mixpanel: Mixpanel) {

    const coordinates = this.navParams.data["data"];
    this.loadPlaces(coordinates);

    // Removing Old Partner
    this.partnerService.removePartner();

  }

  ionViewDidLoad() {}

  loadPlaces(coordinates) {
    this.partnerService.listPlaces(coordinates).subscribe(
      (data) => {
        
        this.partners = data.places;
        this.fakePlaces = null;
        this.notfound = false;
        
      }, (err) => {
        
        this.partners = null;
        this.fakePlaces = null;
        this.notfound = true;
        
      }
    )
  }

  loadMenu(partner: Place) {

    this.mixpanel.track("Clicked Partner for Menu");

    // Save Partner to Storage for Ref Purposes.
    this.partnerService.setPartner(partner);

    this.navCtrl.push('MenuPage', {
      data: {
        partnerID: partner.partnerID,
        data: partner
      }
    }, {
      animate: true,
      direction: 'forward',
    });
  }

}
