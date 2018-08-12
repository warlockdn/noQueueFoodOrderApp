import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { AuthProvider } from '../../providers/auth/auth';
import { CartProvider } from '../../providers/cart/cart';
import { PartnerProvider } from '../../providers/partner/partner';
import { ConstantsProvider } from '../../providers/constants/constants';
// import { FirebaseProvider } from '../../providers/firebase/firebase';

/**
 * Generated class for the OrderSummaryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-summary',
  templateUrl: 'order-summary.html',
})
export class OrderSummaryPage {

  partnerInfo: any;
  partnerName: string = '';
  partnerCity: string = '';
  isLoggedIn: boolean = false;
  cartItems: Array < any > ;
  subTotal: number = 0;
  total: number = 0;
  tax: number = 0;
  notes: string;
  finalData: any;

  // public firebase: FirebaseProvider
  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider, public modalCtrl: ModalController, public cartProvider: CartProvider, public platform: Platform, public partner: PartnerProvider, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.finalData = null;
    this.loadPartnerInfo();
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderSummaryPage');
    this.createCart();
  }

  async loadPartnerInfo() {
    this.partner.getPartner().then(partner => {
      this.partnerInfo = partner;
      this.partnerName = this.partnerInfo.name;
      this.partnerCity = this.partnerInfo.basic.city;

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

  deleteCart() {
    const confirmDelete = this.alertCtrl.create({
      title: "Clear Cart",
      subTitle: "Are you sure you want to clear cart?",
      buttons: [
        {
          text: "No"
        }, {
          text: "Yes",
          handler: () => {
            this.cartProvider.clearCartData();
            this.navCtrl.setRoot('HomePage', {}, {
              animate: true,
              direction: "switch"
            });
          }
        }
      ]
    });
    
    confirmDelete.present();
  }

  showTax() {

    let taxInfo = '';

    Object.keys(this.partnerInfo.taxInfo).forEach(tax => {
      taxInfo += `${tax.toUpperCase()}: ${this.partnerInfo.taxInfo[tax]} <br/>`;
    })

    let taxAlert = this.alertCtrl.create({
      title: "Taxes",
      message: taxInfo,
      buttons: ['OK']
    })

    taxAlert.present();

  }

  loadPartner() {
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

  createCart() {

    this.cartProvider.getCartData().then(
      result => {
        if (result) {

          let cart = Object.keys(result.cart);
          let cartItems = [];

          cart.forEach(items => {

            result.cart[items].forEach(item => {
              cartItems.push(item);
            });

          });

          this.cartItems = cartItems;
          this.subTotal = result.total;

          console.log(this.cartItems);

        }
      }, err => {
        console.log('Error');
      }
    )
  }

  login() {
    const loginModal = this.modalCtrl.create('LoginPage', {
      data: true
    }, {
      enableBackdropDismiss: true
    })
    loginModal.present();
  }

  loadStatus() {
    this.navCtrl.push('OrderStatusPage', {}, {
      animate: true,
      direction: 'forward'
    })
  }

  async pay() {

    const partner = await this.partner.getPartner();
    const cart = await this.cartProvider.getCartData();

    if (this.tax > 0) {
      cart.tax = this.tax;
    }

    if (partner && cart) {
      const newCart = {
        customerID: this.auth.user.id,
        cart: cart,
        notes: this.notes,
        partner: partner.name
      }
      this.handleCart(newCart);
    }

  }

  async handleCart(cart) {

    let finalData = await this.cartProvider.getFinalCartData();

    if (!finalData) {

      let loading = this.loadingCtrl.create({
        content: "Please wait, creating order"
      })

      loading.present();

      this.cartProvider.manageCart(cart).subscribe(
        response => {
  
          if (response.cart) {

            loading.dismiss();
            
            let data = response.cart;
            data.orderID = response.orderID;

            // setting final data
            finalData = data;
            this.cartProvider.setFinalCartData(data);
  
            if (this.platform.is("android") || this.platform.is("ios") || this.platform.is("core")) {
  
              const options = {
                description: `Order #${data.id}`,
                // image: '',
                currency: 'INR',
                order_id: response.orderID,
                key: ConstantsProvider.razorPayKey,
                amount: data.total,
                name: 'foodSpaze',
                prefill: {
                  email: this.auth.user.email,
                  contact: this.auth.user.phone,
                  name: this.auth.user.name
                },
                theme: {
                  color: '#F37254'
                }
              }
  
              alert(JSON.stringify(options));
  
              let successCallback = (payment_id) => {
                console.log(payment_id);
                this.capturePayment(payment_id, options.amount, finalData);
              };
      
              let cancelCallback = (error) => {
                alert(JSON.stringify(error));
                alert(error.description + ' (Error ' + error.code + ')');
              };
      
              this.platform.ready().then(() => {
                RazorpayCheckout.open(options, successCallback, cancelCallback);
              })
              
            } else {
  
              setTimeout(() => {
                this.navCtrl.setRoot('OrderStatusPage', {
                  data: response.cart
                }, {
                  animate: true,
                  direction: 'forward'
                }).then(() => {
                  this.navCtrl.insert(0, 'HomePage');
                })
              }, 200);
  
            }
    
          }
  
      }, err => {

        loading.dismiss();

        let errAlert = this.alertCtrl.create({
          title: "Error!",
          subTitle: "There seems to be a error while creating your order. Please delete your cart and try again",
          buttons: [
            {
              text: "Cancel",
              handler: () => {
                console.log("Clearing cart")
              }
            }, {
                text: "Delete Cart",
                handler: () => {
                  console.log("Clearing cart")
                }
            }
          ]
        })
  
      })

    } else {

      const data = finalData;
      const options = {
        description: `Order #${data.id}`,
        // image: '',
        currency: 'INR',
        order_id: data.orderID,
        key: ConstantsProvider.razorPayKey,
        amount: data.total,
        name: 'foodSpaze',
        prefill: {
          email: this.auth.user.email,
          contact: this.auth.user.phone,
          name: this.auth.user.name
        },
        theme: {
          color: '#F37254'
        }
      }

      alert(JSON.stringify(options));

      let successCallback = (payment_id) => {
        console.log(payment_id);
        this.capturePayment(payment_id, options.amount, finalData);
      };

      let cancelCallback = (error) => {
        alert(JSON.stringify(error));
        alert(error.description + ' (Error ' + error.code + ')');
      };

      this.platform.ready().then(() => {
        RazorpayCheckout.open(options, successCallback, cancelCallback);
      })

    }

  }

  capturePayment(paymentID, amount, cart) {

    let captureLoading = this.loadingCtrl.create({
      content: "Verifying payment. Please wait!"
    })

    captureLoading.present();

    this.cartProvider.capturePayment(cart.id, paymentID, amount, cart.partnerID).subscribe(
      response => {

        captureLoading.dismiss();
        this.cartProvider.clearCartData();

        setTimeout(() => {
          this.navCtrl.setRoot('OrderStatusPage', {
            data: cart
          }, {
            animate: true,
            direction: 'forward'
          }).then(() => {
            this.navCtrl.insert(0, 'HomePage');
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
