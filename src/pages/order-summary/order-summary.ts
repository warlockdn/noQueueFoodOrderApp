import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform } from 'ionic-angular';
import { OrderStatusPage } from '../order-status/order-status';
import { LoginPage } from '../login/login';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { AuthProvider } from '../../providers/auth/auth';
import { CartProvider } from '../../providers/cart/cart';
import { HomePage } from '../home/home';
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

  isLoggedIn: boolean = false;
  cartItems: Array < any > ;
  subTotal: number = 0;
  total: number = 0;
  tax: number = 0;
  notes: string;

  // public firebase: FirebaseProvider
  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider, public modalCtrl: ModalController, public cartProvider: CartProvider, public platform: Platform) {
    console.log(auth.isLoggedIn);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderSummaryPage');
    this.createCart();
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
    const loginModal = this.modalCtrl.create(LoginPage, {}, {
      enableBackdropDismiss: true
    })
    loginModal.present();
  }

  loadStatus() {
    this.navCtrl.push(OrderStatusPage, {}, {
      animate: true,
      direction: 'forward'
    })
  }

  pay() {

    this.cartProvider.getCartData().then(cart => {
      if (cart !== null) {

        const newCart = {
          customerID: this.auth.user.id,
          cart: cart,
          notes: this.notes
        }

        this.handleCart(newCart);

      }
    }).catch(err => {

    })

    // this.cart.manageCart()

    /* const options = {
      description: 'Order #200',
      // image: '',
      currency: 'INR',
      key: 'rzp_test_8ZuXe81gFihhsI',
      amount: '100',
      name: 'foo',
      prefill: {
        email: 'warlockdn@gmail.com',
        contact: '9818120583',
        name: 'Deepankar'
      },
      theme: {
        color: '#F37254'
      },
      modal: {
        ondismiss: function() {
          alert('dismissed')
        }
      }
    }

    const successCallback = function(payment_id) {
      alert('payment_id: ' + payment_id);
    };

    const cancelCallback = function(error) {
      alert(error.description + ' (Error ' + error.code + ')');
    };

    RazorpayCheckout.open(options, successCallback, cancelCallback); */

  }

  handleCart(cart) {

    this.cartProvider.manageCart(cart).subscribe(
      response => {

        if (response.cart) {
          
          this.cartProvider.clearCartData();

          setTimeout(() => {
            this.navCtrl.push(OrderStatusPage, {
              data: response.cart
            }, {
              animate: true,
              direction: 'forward'
            })
          }, 200);

  
          /* const options = {
            description: `Order #${data.id}`,
            // image: '',
            currency: 'INR',
            order_id: data.id,
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
            },
            modal: {
              ondismiss: function() {
                console.log('Dismissed at: ', new Date());
              }
            }
          }
  
          let successCallback = (payment_id) => {
            console.log(payment_id)
          };
  
          let cancelCallback = (error) => {
            alert(error.description + ' (Error ' + error.code + ')');
          };
  
          this.platform.ready().then(() => {
            RazorpayCheckout.open(options, successCallback, cancelCallback);
          }) */

        }


    }, err => {

      console.log(err);

    }
  )

}

}
