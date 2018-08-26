import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { AuthProvider } from '../../providers/auth/auth';
import { CartProvider } from '../../providers/cart/cart';
import { PartnerProvider } from '../../providers/partner/partner';
import { ConstantsProvider } from '../../providers/constants/constants';
import { Mixpanel } from '@ionic-native/mixpanel';
// import { FirebaseProvider } from '../../providers/firebase/firebase';

export interface Coupon {
  code: any,
  message: any,
  couponAmount: number
}

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
  cartItems: Array <any>;
  subTotal: number = 0;
  total: number = 0;
  couponAmount: number;
  tax: number = 0;
  notes: string;
  finalData: any;

  // For Hotel
  roomNo: String;

  couponForm: FormGroup;

  // public firebase: FirebaseProvider
  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider, public modalCtrl: ModalController, public cartProvider: CartProvider, public platform: Platform, public partner: PartnerProvider, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public constants: ConstantsProvider, private mixpanel: Mixpanel, private fb: FormBuilder) {
    this.finalData = null;
    this.loadPartnerInfo();
    this.createCouponForm();

    this.couponAmount = null;
    this.cartProvider.couponAmount = null;
    this.cartProvider.couponCode = null;
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderSummaryPage');
    this.createCart();
  }

  createCouponForm() {
    this.couponForm = this.fb.group({
      couponcode: new FormControl(null)
    })
  }

  validateCoupon() {
    if (this.couponForm.valid) {

      let loader = this.loadingCtrl.create({
        content: "Validating coupon..."
      })

      loader.present();

      const couponCode = (this.couponForm.controls['couponcode'].value).toUpperCase();

      this.cartProvider.validateCoupon(couponCode, this.partnerInfo.partnerID, this.cartProvider.total).subscribe(
        response => {
          let data = response;
          if (data["code"] === 200) {
            
            loader.dismiss();

            this.cartProvider.couponAmount = data["couponAmount"];
            this.couponAmount = data["couponAmount"];
            this.cartProvider.couponCode = couponCode;

            this.alertCtrl.create({
              title: "Coupon applied!",
              message: "Coupon has been successfully applied to your order",
              buttons: ["OK"]
            }).present();

          } else {
            
            loader.dismiss();
            this.couponForm.controls['couponcode'].setValue('');

            this.cartProvider.couponAmount = null;
            this.couponAmount = null;

            this.alertCtrl.create({
              title: "Coupon invalid",
              message: "Entered coupon is not valid",
              buttons: ["OK"]
            }).present();

          }
        }, err => {

          loader.dismiss();
          this.couponForm.controls['couponcode'].setValue('');

          this.cartProvider.couponAmount = null;
          this.couponAmount = null;

          this.alertCtrl.create({
            title: "Coupon invalid",
            message: "Entered coupon is not valid",
            buttons: ["OK"]
          }).present();

        }
      )
    }
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

      
      if (this.partnerInfo.characteristics.typeid === "3") {
        
        if (this.partnerInfo.partnerID === this.constants.checkInDetail.partnerID) {
          this.roomNo = this.constants.checkInDetail.room;
        }

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

    this.mixpanel.track("Loggin in from Cart")

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

    this.mixpanel.track("Pressed Pay")

    const partner = await this.partner.getPartner();
    const cart = await this.cartProvider.getCartData();

    if (this.tax > 0) {
      cart.tax = this.tax;
    }

    if (partner && cart) {
      let newCart = {
        customerID: this.auth.user.id,
        cart: cart,
        notes: this.notes,
        partner: partner.name,
        room: null
      }

      if (this.roomNo) {
        newCart.room = this.roomNo;
      }

      this.handleCart(newCart);
    }

  }

  async handleCart(cart) {

    // Checking if there is a cart data earlier created.
    let finalData = await this.cartProvider.getFinalCartData();

    if (!finalData) {

      let loading = this.loadingCtrl.create({
        content: "Please wait, creating order"
      })

      loading.present();

      if (this.cartProvider.couponCode) {
        cart.couponCode = this.cartProvider.couponCode;
      }

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

      if (this.platform.is("android") || this.platform.is("ios")) {

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

      } else {

        
        setTimeout(() => {
          this.navCtrl.setRoot('OrderStatusPage', {
            data: finalData
          }, {
            animate: true,
            direction: 'forward'
          }).then(() => {
            this.navCtrl.insert(0, 'HomePage');
            this.cartProvider.clearCartData();
          })
        }, 200);

      }


    }

  }

  capturePayment(paymentID, amount, cart) {

    this.mixpanel.track("User paid for Order");

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
