import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { CartProvider } from '../../providers/cart/cart';

@IonicPage()  
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  isDisabled: boolean = false;

  constructor(
    public navCtrl: NavController,
    private geolocation: Geolocation,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public cartProvider: CartProvider
  ) {}

  listPlaces() {

    const loading = this.loadingCtrl.create({
      content: "Locating you...",
    });

    loading.present();
    this.isDisabled = true;

    /* this.navCtrl.push('PartnerListingPageV2', {
      data: {
        accuracy: 37, 
        altitude: null, 
        altitudeAccuracy: null,
        heading: null,
        latitude: 28.597528699999998,
        longitude: 77.0991781
      }
    }, { 
      direction: "forward", 
      animate: true 
    }) */

    /* this.navCtrl.push('PartnerListingPageV2', {
      // data: response.coords
      data: {
        accuracy: 37, 
        altitude: null, 
        altitudeAccuracy: null,
        heading: null,
        latitude: 28.5975541,
        longitude: 77.0991781
      }
    }, { 
      direction: "forward",
      animate: true 
    }) */

    this.geolocation.getCurrentPosition().then((response) => {

      loading.dismiss();
      this.isDisabled = false;
      
      console.log(`Lat: ${response.coords.latitude}, Long: ${response.coords.longitude}, Altitude: ${response.coords.altitude}`);
      
      this.navCtrl.push('PartnerListingPageV2', {
        // data: response.coords
        data: {
          accuracy: 37, 
          altitude: null, 
          altitudeAccuracy: null,
          heading: null,
          latitude: 28.597528699999998,
          longitude: 77.0991781
        }
      }, { 
        direction: "forward",
        animate: true 
      })
    
    }).catch((err) => {
      this.isDisabled = false;
      loading.dismiss();
      console.log('Error fetching Current position ', JSON.stringify(err));
      this.showError();
    })
    
  }

  goToCart() {
    this.navCtrl.push('OrderSummaryPage', {}, {
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
