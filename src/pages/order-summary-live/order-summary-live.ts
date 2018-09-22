import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { AuthProvider } from '../../providers/auth/auth';
import { CartProvider } from '../../providers/cart/cart';
import { PartnerProvider } from '../../providers/partner/partner';
import { ConstantsProvider } from '../../providers/constants/constants';
import { Mixpanel } from '@ionic-native/mixpanel';
import { OrderProvider } from '../../providers/order/order';
// import { FirebaseProvider } from '../../providers/firebase/firebase';

export interface Coupon {
  code: any,
  message: any,
  couponAmount: number
}

/**
 * Generated class for the OrderSummaryLivePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-summary-live',
  templateUrl: 'order-summary-live.html',
})
export class OrderSummaryLivePage {

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
  updatedOrder: boolean = false;

  // For Hotel
  roomNo: String;

  couponForm: FormGroup;
  orderType: { type: any; table?: any };

  // public firebase: FirebaseProvider
  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider, public modalCtrl: ModalController, public cartProvider: CartProvider, public platform: Platform, public partner: PartnerProvider, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public constants: ConstantsProvider, private mixpanel: Mixpanel, private fb: FormBuilder, public order: OrderProvider) {
    this.finalData = null;
    this.loadPartnerInfo();
    this.createCouponForm();

    this.couponAmount = null;
    this.cartProvider.couponAmount = null;
    this.cartProvider.couponCode = null;

    this.cartProvider.getLiveCart()

  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderSummaryPage');
    this.createCart();
  }

  manageItem(item, status) {
    this.cartProvider.getCartData().then(response => {
        
      if (status) {
        item.selected = true;
        item.quantity += 1;
        response.cart[item.id][0].quantity += 1;

        this.cartProvider.totalItems += 1;
    
        // Update Total Price
        response.total += item.price * 100;
        this.cartProvider.total = response.total;

        // Update Total Items
        response.totalItems += 1;
        this.cartProvider.totalItems + response.totalItems;

        // Specific for Restaurant
        if (this.cartProvider.isLiveOrder) {
          this.updatedOrder = true;
        }

        // Save to Storage
        this.cartProvider.setCartData(response);
      } else {

        /* 
          Check for Restaurant. Check the lastCount and stop processing
          Since the Menu item has already been ordered. Cannot decrease quantity;
          */
         if (response.cart[item.id][0].lastCount) {
          console.log("entering")
          if (response.cart[item.id][0].lastCount === item.quantity) {
            console.log("entering")
            this.alertCtrl.create({
              title: "Alert!",
              message: "The menu item has already been ordered. Cannot decrease quantity.",
              buttons: [{
                text: "OK",
                role: "cancel"
              }]
            }).present();
            return false;
          }
        }

        // Update Total Price
        response.total -= item.price * 100;
        this.cartProvider.total = response.total;

        // Update Quantity
        item.quantity -= 1;
        response.totalItems -= 1;
        this.cartProvider.totalItems -= 1;

        if (item.quantity === 0) {
          delete item.selected;
          delete response.cart[item.id];

          // Delete item from CartItems
          for (let index = 0; index < this.cartItems.length; index++) {
            if (this.cartItems[index].id === item.id) {
              this.cartItems.splice(index, 1);
              break;
            }
          }

          this.cartProvider.setCartData(response);
        } else {

          // Specific for Restaurant
          if (response.cart[item.id][0].lastCount) {
            item.lastCount = response.cart[item.id][0].lastCount;
          }

          response.cart[item.id][0] = item;
          this.cartProvider.setCartData(response);
        }

        const toClearCart = this.cartProvider.checkCartList(this.cartItems);

        // No isNewItem || lastCount exists so not updating order.
        if (!toClearCart) {
          this.updatedOrder = false;
          // this.loadPartner();
        }

      }

    })
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
              if (item.lastCount) {
                if (item.lastCount !== item.quantity) {
                  this.updatedOrder = true;
                }
              }
              if (item.isNewItem) {
                this.updatedOrder = true;
              }
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

  selectOrderType() {

    if (this.partnerInfo.characteristics.takeout) {

      let orderTypeModal = this.modalCtrl.create('RestaurantOrderTypeModalPage', {}, {
        showBackdrop: false,
        enableBackdropDismiss: false,
        cssClass: 'order-type'
      })
  
      orderTypeModal.present();
  
      orderTypeModal.onDidDismiss(data => {
  
        if (data !== undefined) {
          this.orderType = {
            type: data.type
          }
  
          if (data.table) {
            this.orderType.table = data.table;
          }
  
          this.createOrder()
        }
  
      })

    } else {

      this.getTableNo();

    }

  }

  getTableNo() {

    if (!this.cartProvider.isLiveOrder) {

      const seatPrompt = this.alertCtrl.create({
        title: "Enter Table No.",
        message: "Please enter table number",
        inputs: [{
          name: "table",
          placeholder: "Table No."
        }],
        buttons: [{
          text: "Cancel",
          handler: data => {
            
          }
        }, {
          text: "Proceed",
          handler: data => {
            console.log("Proceed");
            if (data.table === "") {
              return false;
            } else {
              this.orderType = {
                type: "LIVE",
                table: data.table 
              };
              this.createOrder();
            }
          }
        }]
      })
  
      seatPrompt.present();

    } else {

      this.updateOrder()

    }

  }

  async createOrder() {

    this.mixpanel.track("Creating Live Order")

    const partner = await this.partner.getPartner();
    const cart = await this.cartProvider.getCartData();

    if (this.tax > 0) {
      cart.tax = this.tax;
    }

    let updatedCart = JSON.parse(JSON.stringify(cart));

    Object.keys(updatedCart.cart).forEach(items => {
      updatedCart.cart[items].forEach(item => {
        item.lastCount = item.quantity;
      });
    });

    this.cartProvider.setCartData(updatedCart);

    if (partner && cart) {
      let newCart = {
        customerID: this.auth.user.id,
        cart: updatedCart,
        notes: this.notes,
        partner: partner.name,
        type: null,
        table: null,
        orderType: "LIVE"
      }

      if (this.orderType) {
        if (this.orderType.type) {
          newCart.type = (this.orderType.type).toUpperCase();
        }
        if (this.orderType.table) {
          newCart.table = (this.orderType.table).toUpperCase()
        }
      }

      this.handleCart(newCart, false);
    }

  }

  async updateOrder() {

    this.mixpanel.track("Updating Live Order")

    const partner = await this.partner.getPartner();
    const cart = await this.cartProvider.getCartData();
    const refid = await this.cartProvider.getFirebaseRefID();
    const orderID = await this.cartProvider.getOrderID();

    if (partner && cart) {
      let newCart = {
        customerID: this.auth.user.id,
        cart: cart,
        notes: this.notes,
        partner: partner.name,
        type: null,
        table: null,
        orderType: "LIVE",
        refid: refid,
        orderID: orderID
      }

      if (this.orderType) {
        if (this.orderType.type) {
          newCart.type = (this.orderType.type).toUpperCase();
        }
        if (this.orderType.table) {
          newCart.table = (this.orderType.table).toUpperCase()
        }
      }

      this.handleCart(newCart, true);
    }

  }
  
  /**
   * @param cart The whole Cart Object
   * @param isUpdating Whether the order is being updated or is a new order
   */

  async handleCart(cart, isUpdating) {

    let loading = this.loadingCtrl.create({
      content: "Please wait, creating order"
    })

    loading.present();

    /* if (this.cartProvider.couponCode) {
      cart.couponCode = this.cartProvider.couponCode;
    } */

    if (!isUpdating) {
      
      this.cartProvider.manageCart(cart).subscribe(
        response => {
  
          if (response.cart) {
  
            loading.dismiss();
            
            let data = response.cart;
            data.orderID = response.orderID;
  
            this.cartProvider.setOrderID(data.id);
            this.cartProvider.enableLiveCart();

            let updatedCart = cart.cart;

            Object.keys(updatedCart.cart).forEach(item => {
              updatedCart.cart[item].forEach(data => {
                data.lastCount = data.quantity;
              });
            });

            this.cartProvider.setCartData(updatedCart);
            this.cartProvider.setFirebaseRefID(response.refid);
  
            this.navCtrl.push('OrderStatusLivePage', {}, {
              animate: true,
              direction: "forward"
            }).then(() => {
              this.navCtrl.insert(0, 'HomePage');
            });
    
          }
  
      }, () => {
  
        loading.dismiss();
  
        this.alertCtrl.create({
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
        }).present()
  
      })
      
    } else { // Updating Order

      this.cartProvider.updateCart(cart).subscribe(
        response => {
  
          if (response.cart) {
  
            loading.dismiss();
            
            let data = response.cart;
            data.orderID = response.orderID;
  
            this.cartProvider.setOrderID(data.id);
            this.cartProvider.enableLiveCart();

            let updatedCart = cart.cart;

            Object.keys(updatedCart.cart).forEach(item => {
              updatedCart.cart[item].forEach(data => {
                data.lastCount = data.quantity;
                if (data.isNewItem) {
                  delete data.isNewItem;
                }
              });
            });

            this.order.currentOrder.status = "PENDING";

            this.cartProvider.setCartData(updatedCart);
            this.cartProvider.setFirebaseRefID(response.refid);
  
            this.navCtrl.push('OrderStatusLivePage', {}, {
              animate: true,
              direction: "forward"
            }).then(() => {
              this.navCtrl.insert(0, 'HomePage');
            });
    
          }

        });
    }


  }

  confirmOrderClose() {
    
    const confirmAlert = this.alertCtrl.create({
      title: "Proceed and Pay",
      message: "If you are done with your order. Press OK to pay or cancel or continue ordering",
      buttons: [
        {
          text: "Cancel",
          role: "cancel"
        }, {
          text: "Pay",
          handler: () => {
            this.getPaymentLink();
          }
        }
      ]
    })

    confirmAlert.present();

  }

  async getPaymentLink() {

    const loading = this.loadingCtrl.create({
      content: "Please wait...",
      enableBackdropDismiss: false,
      dismissOnPageChange: true
    })

    loading.present();

    const orderID = await this.cartProvider.getOrderID();

    /* this.cartProvider.getPaymentLinkforLiveOrder(this.cartProvider.total, orderID, this.tax, this.partnerInfo.partnerID).subscribe(
      response => {
        if (response[status] === 200) {
          loading.dismiss();
          this.pay(orderID, response["orderID"])
        } else {
          loading.dismiss();
        }
      }
    ) */

  }

  async pay(orderID, paymentID) {

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
          this.navCtrl.setRoot('OrderHistoryPage', {}, {
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
