import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, AlertController, LoadingController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';
import { CartProvider } from '../../providers/cart/cart';
import { PartnerProvider } from '../../providers/partner/partner';
import { ConstantsProvider } from '../../providers/constants/constants';
import { Mixpanel } from '@ionic-native/mixpanel';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { OrderProvider } from '../../providers/order/order';
/**
 * Generated class for the OrderStatusLivePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-status-live',
  templateUrl: 'order-status-live.html',
})
export class OrderStatusLivePage {
  orderID: any = '';
  partnerInfo: any;
  partnerName: any;
  tax: number = 0;
  currentOrder: any

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider, public modalCtrl: ModalController, public cartProvider: CartProvider, public platform: Platform, public partner: PartnerProvider, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public constants: ConstantsProvider, private mixpanel: Mixpanel, public firebase: FirebaseProvider, public order: OrderProvider) {
    this.loadPartnerInfo();
    this.loadOrderID();
    this.cartProvider.getCartData();
    this.liveOrderSub()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderStatusLivePage');
  }

  async loadOrderID() {
    this.orderID = await this.cartProvider.getOrderID()
  }

  async liveOrderSub() {
    const firebaseID = await this.cartProvider.getFirebaseRefID();
    if (firebaseID) {
      this.order.orderStatus(firebaseID);
    }
  }

  loadPartnerInfo() {
    this.partner.getPartner().then(partner => {
      this.partnerInfo = partner;
      this.partnerName = this.partnerInfo.name;

      // Setting Tax if applicable.
      if (partner.taxInfo) {
        let totalTax = 0;
        Object.keys(partner.taxInfo).forEach(tax => {
          totalTax += partner.taxInfo[tax];
        })
        this.tax = totalTax * 100;
      }

    }).catch(err => {
      console.log(err);
    });
  }

  orderMore() {
    
    this.navCtrl.push('MenuPage', {
      data: {
        partnerID: this.partnerInfo.partnerID,
        data: this.partnerInfo
      }
    }, {
      animate: true,
      direction: 'backward',
    });

  }

  async getPaymentLink() {

    const loading = this.loadingCtrl.create({
      content: "Please wait...",
      enableBackdropDismiss: false,
      dismissOnPageChange: true
    })

    loading.present();

    const orderID = await this.cartProvider.getOrderID();

    this.cartProvider.getPaymentID(orderID).subscribe(
      response => {
        if (response["status"] === 200) {
          loading.dismiss();
          this.pay(orderID, response["paymentID"])
        } else {
          loading.dismiss();
        }
      }
    )

  }

  pay(orderID, paymentID) {

    if (this.platform.is("android") || this.platform.is("ios") || this.platform.is("core")) {

      const options = {
        description: `Order #${orderID}`,
        // image: '',
        currency: 'INR',
        order_id: paymentID,
        key: ConstantsProvider.razorPayKey,
        amount: (this.cartProvider.total + this.tax),
        name: 'Flevva',
        prefill: {
          email: this.auth.user.email,
          contact: this.auth.user.phone,
          name: this.auth.user.name
        },
        theme: {
          color: '#F37254'
        }
      }

      let successCallback = (payment_id) => {
        console.log(payment_id);
        this.capturePayment(payment_id, options.amount, {
          id: orderID,
          amount: (this.cartProvider.total + this.tax),
          partnerID: this.partnerInfo.partnerID
        });
      };

      let cancelCallback = (error) => {
        
      };

      this.platform.ready().then(() => {
        RazorpayCheckout.open(options, successCallback, cancelCallback);
      })

    }
  
  }

  async capturePayment(paymentID, amount, cart) {

    this.mixpanel.track("User paid for Order");

    let captureLoading = this.loadingCtrl.create({
      content: "Verifying payment. Please wait!"
    })

    captureLoading.present();

    const refid = await this.cartProvider.getFirebaseRefID();

    this.cartProvider.capturePaymentAndClose(cart.id, paymentID, amount, cart.partnerID, refid).subscribe(
      response => {

        captureLoading.dismiss();
        this.cartProvider.clearCartData();

        setTimeout(() => {
          this.navCtrl.setRoot('HomePage', {}, {
            animate: true,
            direction: 'forward'
          })
        }, 200);

      }, err => {

        captureLoading.dismiss();

        const failedAlert = this.alertCtrl.create({
          title: 'Error!',
          subTitle: "Error while verifying payment. Please try again. If already paid your money will be returned in 3 days",
          buttons: ["OK"]
        })
        failedAlert.present();
        
      }
    )

  }

}
