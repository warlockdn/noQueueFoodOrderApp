import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { CartProvider } from '../../providers/cart/cart';
import { PartnerProvider } from '../../providers/partner/partner';
import { MixpanelPeople, Mixpanel } from '@ionic-native/mixpanel';

@IonicPage()  
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  isDisabled: boolean = false;
  homeImage: string = 'home-02';

  constructor(
    public navCtrl: NavController,
    private geolocation: Geolocation,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public cartProvider: CartProvider,
    public barCode: BarcodeScanner,
    public partnerService: PartnerProvider,
    private mixpanel: Mixpanel, 
    private mixpanelPeople: MixpanelPeople
  ) {
    this.mixpanel.track("Opened Homepage");
    this.randomHomeImage();
  }

  ionViewDidLeave() {
    this.randomHomeImage();
  }

  listPlaces() {

    this.mixpanel.track("Finding Places");

    const loading = this.loadingCtrl.create({
      content: "Locating you...",
    });

    this.navCtrl.push('PartnerListingPageV2', {
      data: {
        accuracy: 37, 
        altitude: null, 
        altitudeAccuracy: null,
        heading: null,
        latitude: 28.59752869,
        longitude: 77.0991781
      }
    }, { 
      direction: "forward", 
      animate: true 
    })

    

    /* loading.present();
    this.isDisabled = true;
    
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
    }) */
    
  }

  // Lets the customer use the barcode instantly and open menu
  openbarcode() {

    this.mixpanel.track("Open Barcode");

    this.barCode.scan({
      disableSuccessBeep: true,
      resultDisplayDuration: 0,
      showTorchButton: true 
    }).then(barcodeData => {

      console.log("Barcode data: ", JSON.stringify(barcodeData));

      if (!barcodeData.text) {
        return;
      }

      const loading = this.loadingCtrl.create({
        content: "Loading..."
      })

      loading.present();
      
      // cancelled, text, format
      const partnerData = this.parseBarCodeDetail(barcodeData);
      console.log(JSON.stringify(partnerData));

      // this.partnerService.removePartner();
      // this.cartProvider.clearCartData();

      loading.dismiss();

      this.navCtrl.push('MenuPage', {
        data: {
          isDirect: true,
          partner: partnerData
        }
      }, {
        animate: true,
        direction: 'forward',
      });

    }).catch(err => {
      
      this.alertCtrl.create({
        title: "Error!",
        message: "There was a error reading barcode data. Please try again later."
      }).present()

    })
  }

  parseBarCodeDetail(barCode) {

    const code = barCode;
    let partner = {};

    // Check if the code has any comma (Comma means there is a table number attached.)
    if ((code.text).includes(',')) {
      partner["id"] = atob(code.text.split(",")[0]);
      partner["table"] = atob(code.text.split(",")[1]);
    } else {
      partner["id"] = atob(code.text);
    }

    return partner;

  }

  goToCart() {

    this.mixpanel.track("Opened Order Summary from Homepage");

    this.partnerService.getPartner().then(data => {

      if (data.characteristics.typeid === "2" && data.characteristics.type === "Restaurant") {
        
        this.navCtrl.push('OrderSummaryLivePage', {}, {
          animate: true,
          direction: 'forward'
        })

      } else {
        this.navCtrl.push('OrderSummaryPage', {}, {
          animate: true,
          direction: 'forward'
        })
      }

    }).catch(err => {

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

  randomHomeImage() {
    let homeImageArr = ['home-01', 'home-02', 'home-03'];
    // this.homeImage = homeImageArr[Math.floor((Math.random()*homeImageArr.length))]; 
    setInterval(() => {
      this.homeImage = homeImageArr[Math.floor((Math.random()*homeImageArr.length))]
    }, 5000)

  }

}
