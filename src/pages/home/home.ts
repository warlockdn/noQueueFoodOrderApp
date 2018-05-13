import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PartnerListingPageV2 } from '../partner-listing-v2/partner-listing-v2';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  listPlaces() {
    this.navCtrl.push(PartnerListingPageV2, {}, { 
      animate: true,
      direction: 'forward'
    })
  }

}
