import { Component, forwardRef } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { AlertController } from 'ionic-angular';

import { OrderSummaryPage } from '../order-summary/order-summary';

import { PartnerListingPageV2 } from '../partner-listing-v2/partner-listing-v2';
import { CartProvider } from '../../providers/cart/cart';

@IonicPage()  
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    private geolocation: Geolocation,
    public alertCtrl: AlertController,
    public cartProvider: CartProvider
  ) {}

  listPlaces() {

    // this.navCtrl.push(PartnerListingPageV2, {
    //   data: {
    //     accuracy: 37, 
    //     altitude: null, 
    //     altitudeAccuracy: null,
    //     heading: null,
    //     latitude: 28.597528699999998,
    //     longitude: 77.0991781
    //   }
    // }, { 
    //   direction: "forward", 
    //   animate: true 
    // })

    this.geolocation.getCurrentPosition().then((response) => {
      
      console.log(`Lat: ${response.coords.latitude}, Long: ${response.coords.longitude}, Altitude: ${response.coords.altitude}`);
      
      this.navCtrl.push(PartnerListingPageV2, {
        data: response.coords
      }, { 
        direction: "forward", 
        animate: true 
      })
    
    }).catch((err) => {
      console.log('Error fetching Current position ', err);
      this.showError();
    })

    /* this.navCtrl.push(PartnerListingPageV2, {}, { 
      animate: true,
      direction: 'forward'
    }) */ 
  }

  goToCart() {
    this.navCtrl.push(OrderSummaryPage, {}, {
      animate: true,
      direction: "forward"
    })
  }

  showError() {
    const alert = this.alertCtrl.create({
      title: 'Error!',
      subTitle: 'Your location is required to list places near you. Please try again.',
      buttons: ['OK']
    });
    alert.present();
  }

}
