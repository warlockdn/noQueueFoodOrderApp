import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';

import { IonicPage, NavController, NavParams, Content, ModalController, AlertController, Platform } from 'ionic-angular';

import { PartnerProvider, Place } from '../../providers/partner/partner';
import { CartProvider } from '../../providers/cart/cart';
import { Observable } from 'rxjs';
import { Mixpanel } from '@ionic-native/mixpanel';

/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export interface Item {
  description?: string
  hasAddons: boolean
  id: number
  isEnabled: boolean
  isNonVeg: boolean
  name: string
  partnerID: number
  price: number
}

export interface Collection {
  name: string,
  items?: [Item],
  subcollection?: [Item]
}

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  @ViewChild(Content)
  content:Content;

  isLoading: boolean = true;
  
  showCart: Boolean = false;
  isTransparent = true;
  counter: number = 1;
  partnerDetails: Place;
  
  // Is menu loaded
  success: boolean = false;
  
  // If not loaded
  errorLoading: boolean = false;

  menu: any;

  constructor(public navCtrl: NavController, public platform: Platform, public navParams: NavParams, private ref: ChangeDetectorRef, private partnerService: PartnerProvider, public cartProvider: CartProvider, public modalCtrl: ModalController, private alertCtrl: AlertController, private mixpanel: Mixpanel) {

    const params = this.navParams.data["data"];
    this.cartProvider.partnerName = null;

    // Checking if the partner is being loaded through Barcode
    if (params.isDirect) {
      this.loadPartner(params.partner.id || params.partner.partnerID);
    } else {

      const partner: Place = JSON.parse(JSON.stringify(params.data));
      this.partnerDetails = partner;
      if (Array.isArray(this.partnerDetails.characteristics["cuisine"])) {
        this.partnerDetails.characteristics["cuisine"] = this.partnerDetails.characteristics["cuisine"].join(', ')
      }

      if (!this.partnerDetails.partnerbg) {
        this.partnerDetails.partnerbg = "assets/assets/doodle.png";
      } else {
        this.partnerDetails.partnerbg = "https://res.cloudinary.com/ddiiq3bzl/image/upload/fl_lossy,f_auto,q_auto,w_500/" + this.partnerDetails.partnerbg
      }

      console.log(this.partnerDetails);
      
      this.loadMenu(partner);

    }

    // demo
    // this.cartProvider.clearCartData();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

  ngAfterViewInit() {
    this.content.ionScroll.subscribe((event) => {
      if (parseInt(event.scrollTop) > 50) {
        this.changeStatus(false);
      } else {
        this.changeStatus(true);
      }
      this.ref.detectChanges();
    })
  }

  openLink(coordinates, name) {
    if (this.platform.is('android')) {
      window.open('geo://' + coordinates[1] + ',' + coordinates[0] + '?q=' + coordinates[1] + ',' + coordinates[0] + '(' + name + ')', '_system')
    };
    if (this.platform.is('ios')) {
      window.open("maps://?q=" + coordinates[1] + ',' + coordinates[0], '_system');
    }
  }

  loadMenu(partner: Place) {
    this.partnerService.getMenu(partner.partnerID).subscribe(
      (data) => {
        this.createMenuList(data);
      }, (err) => {
        this.errorLoading = true
      }
    )
  }

  loadPartner(partnerID) {
    this.partnerService.getSinglePartner(partnerID).subscribe(
      (data) => {
        
        this.partnerDetails = data.partner.detail;
        this.partnerService.setPartner(data.partner.detail);
        this.createMenuList(data.partner.menu);

        if (Array.isArray(this.partnerDetails.characteristics["cuisine"])) {
          this.partnerDetails.characteristics["cuisine"] = this.partnerDetails.characteristics["cuisine"].join(', ')
        }

        if (!this.partnerDetails.partnerbg) {
          this.partnerDetails.partnerbg = "assets/assets/doodle.png";
        } else {
          this.partnerDetails.partnerbg = "https://res.cloudinary.com/ddiiq3bzl/image/upload/fl_lossy,f_auto,q_auto,w_500/" + this.partnerDetails.partnerbg
        }

      }
    )
  }

  createMenuList(data) {
    
    try {

      let menu = JSON.parse(JSON.stringify(data.collection));
      let cartItems = this.cartProvider.cartData || null;

      console.log(JSON.stringify(cartItems));

      // If the loaded partnerID and in Cart partnerID does not match no need to match data.
      let toCheckBool = false;

      if (cartItems) {
        if (cartItems.partnerID === this.partnerDetails.partnerID) {
          toCheckBool = true;
          this.cartProvider.partnerName = cartItems.name;
        }
      }

      menu.forEach(collection => {

        // Has subcollection
        if (collection["subcollection"].length > 0) {

          collection["subcollection"].forEach(collection => {
            
            let items = [];
            collection.items.forEach(item => {
              
              if (toCheckBool) { 
                // checking if the item already is selected
                if (cartItems.cart[item.id]) {
                  
                  let count = 0;
                  cartItems.cart[item.id].forEach(cartItem => {
                    count += cartItem.quantity;
                  });
                  
                  data["items"][item.id].quantity = count;
                  data["items"][item.id].selected = true;

                }
              }

              items.push(data["items"][item.id])
            });

            collection.items = items;

          });

          delete collection["items"];

        } else { // has items

          let items = [];
          collection["items"].forEach(item => {
            
            if (toCheckBool) { // checking if the item already is selected
              if (cartItems.cart[item.id]) {
                data["items"][item.id].quantity = cartItems.cart[item.id][0].quantity;
                data["items"][item.id].selected = true;
              }
            }

            items.push(data["items"][item.id])
          });
          collection.items = items;
          delete collection["subcollection"];

        }
      });

      this.menu = menu;
      this.success = true;

      this.isLoading = false;
      this.checkTotal();
      

    } catch(err) {

      this.success = false;
      this.menu = null;
      this.isLoading = false;

      this.errorLoading = true;

      console.log(err);

    }
  }

  extractDesc(items) {

    try {

      let itemsDesc = "";
      if (items.length > 2) {
        for (var i = 0; i < 2; i++) {
          if (typeof items[i] !== 'undefined') {
            itemsDesc += `${items[i].name}, `;
          } else {
            throw new Error('Error');
          }
        }
        itemsDesc = `${itemsDesc.slice(0, -2)} and ${items.length - 2} more`;
      } else {
        items.forEach(item => {
          if (typeof item !== 'undefined') {
            itemsDesc += `${item.name}, `;
          } else {
            throw new Error('Error');
          }
        });
        itemsDesc = itemsDesc.slice(0, -2);
      }

      return itemsDesc;

    } catch(err) {

      console.log(err);
      this.success = false;
      this.menu = null;

    }
  }

  changeStatus(status) {
    this.isTransparent = status;
  }

  updateCounter(item, status: Boolean) {

    /*
     since implemented a check in order summary
     if a order was generated earlier and successfully order_id was generated from Payment Gateway
     then that order id would become invalid as the user has added a new item to the cart and the old cart
     will now be abandoned. cool ;)
    */
    this.removeFinalCart()

    if (!item.hasAddons) {
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

          // Save to Storage
          this.cartProvider.setCartData(response);
        } else {

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
            this.cartProvider.setCartData(response);
          } else {
            response.cart[item.id][0] = item;
            this.cartProvider.setCartData(response);
          }

        }

        /* if (status) {
        } else {
          item.selected = true;
  
          // Update Total Price
          response.total -= item.price * 100;
          this.cartProvider.total = response.total;
  
          item.counter -= 1;
          this.cartProvider.totalItems -= 1;
          
          if (item.counter === 0) {
            item.selected = false;
            delete response.items[item.id];
            this.cartProvider.setCartData(response);
          } else {
            // Save to Storage
            response.items[item.id] = item;
            this.cartProvider.setCartData(response);
          }
        } */
  
        // Check Balance
        this.checkTotal();
  
      })
    } else {

      if (status) { // Add More

        const addonNotificationModal = this.modalCtrl.create('MenuAddonNotificationPage', {}, {
          showBackdrop: true,
          enableBackdropDismiss: true,
          cssClass: 'addons-notification'
        });
  
        addonNotificationModal.onDidDismiss(data => {
          
          if (!!data) {
  
            if (data === 'repeat') { // if repeat yes
  
              this.cartProvider.getCartData().then(response => {

                console.log(item);
                
                let lastIndex = response.cart[item.id].length -1
                let lastItem = response.cart[item.id][lastIndex];
  
                lastItem.selected = true;
  
                // Update Total Price (Single Item = Total Item Price / quantity)
                response.total += (lastItem.price / lastItem.quantity) * 100;
                this.cartProvider.total = response.total;
                
                // Update Item Total Price
                lastItem.price += (lastItem.price / lastItem.quantity);

                // Increment Counter
                item.quantity += 1;
                response.totalItems += 1;
                this.cartProvider.totalItems += 1;
                lastItem.quantity += 1;
                
                this.cartProvider.setCartData(response);
                console.log(response.cart[item.id]);
  
              })
  
            } else { // if repeat no
  
              // Open Addons Modal
              this.addToCart(item, true);
  
            }
  
          }
  
        })
  
        addonNotificationModal.present();

      } else { // Remove Last

        this.cartProvider.getCartData().then(response => {

          let lastIndex = response.cart[item.id].length - 1;
          let lastItem = response.cart[item.id][lastIndex];

          // Update Total Price - Value of One Item = (lastItem / totalItem Quantity)
          response.total -= (lastItem.price  * 100) / lastItem.quantity;
          lastItem.price -= lastItem.price / lastItem.quantity;
          this.cartProvider.total = response.total;

          // Update Quantity
          item.quantity -= 1;
          lastItem.quantity -= 1;
          response.totalItems -= 1;
          this.cartProvider.totalItems -= 1;

          if (lastItem.quantity === 0) {
            if (item.quantity === 0) { delete item.selected }
            response.cart[item.id].splice(lastIndex, 1);
            this.cartProvider.setCartData(response);
          } else {
            
            // Update Item Price (Total Item Price - Singe Price)
            this.cartProvider.setCartData(response);

          }

          // Check Balance  
          this.checkTotal();

        });

      }

    }
    
  }

  addToCart(item, isNew) {
    
    /*
     since implemented a check in order summary
     if a order was generated earlier and successfully order_id was generated from Payment Gateway
     then that order id would become invalid as the user has added a new item to the cart and the old cart
     will now be abandoned. cool ;)
    */
    this.removeFinalCart()

    if (this.cartProvider.cartData) {
      if (this.cartProvider.cartData["partnerID"] !== this.partnerDetails.partnerID) {
        this.showPartnerErr(item);
        return false;
      }
    }

    if (!item.hasAddons) {

      this.cartProvider.getCartData().then(response => {
        
        if (response !== null) { // updating old
          
          // Set Properties
          item.selected = true;

          // Add new Quantity
          if (!item.quantity) {
            item.quantity = 0;
          }
          
          // Update Quantity
          item.quantity += 1;

          // Update Total Items
          this.cartProvider.totalItems += 1;
          response.totalItems = this.cartProvider.totalItems;
          
          response.total += item.price * 100;
          this.cartProvider.total = response.total;

          // Save to Storage
          response.cart[item.id] = new Array(item);
          this.cartProvider.setCartData(response);

        } else { // Adding new

          item.selected = true;
          item.quantity = 1;
          
          // Update total price
          this.cartProvider.total = item.price * 100;
          
          // Update total Items
          this.cartProvider.totalItems += 1;

          let newCart = new Object();
          newCart[item.id] = new Array(item);

          this.cartProvider.setCartData({
            partnerID: this.partnerDetails.partnerID,
            name: this.partnerDetails.name,
            cart: newCart,
            total: this.cartProvider.total,
            totalItems: this.cartProvider.totalItems, 
          })

        }

        // Check Balance  
        this.checkTotal();
        console.log('Selected Item: ', item);

      }).catch(err => {
        console.log(err);
      });
      
    } else {
      const addonModal = this.modalCtrl.create('MenuAddonsPage', { 
        data: {
          item: item,
          new: true
        } 
      }, {
        showBackdrop: true,
        enableBackdropDismiss: true,
        cssClass: 'addons'
      });

      addonModal.onDidDismiss(data => {

        if (!!data) {

          this.cartProvider.getCartData().then(response => {
          
            if (response !== null) { // updating old
              
              console.log('Select Data: ', data);

              // Set Properties
              data.selected = true;
              item.selected = true;
    
              if (!item.quantity) {
                item.quantity = 0;
              }
              
              // Update Quantity
              item.quantity += 1;

              if (Array.isArray(response.cart[item.id])) {
                data.quantity = 1;
              } else {
                data.quantity = item.quantity;
              }
              
              // Update Price
              response.total += data.price * 100;
              this.cartProvider.total = response.total;
              
              // Update Total Items
              this.cartProvider.totalItems += 1;
              response.totalItems = this.cartProvider.totalItems;
    
              // Save to Storage
              if (typeof response.cart[item.id] === 'undefined') {
                
                let newItem = new Array(data);
                response.cart[item.id] = newItem;

              } else {

                if (response.cart[item.id].length > 0) {
                  response.cart[item.id].push(data);
                } else {
                  response.cart[item.id] = new Array(data);
                }
                
              }
          
              // response.cart[data.id] = new Array(data);
              this.cartProvider.setCartData(response);
    
            } else { // Adding new
    
              item.selected = true;
              data.selected = true;

              // Add Quantity
              item.quantity = 1;
              data.quantity = item.quantity;
              
              // Update total price
              this.cartProvider.total = data.price * 100;
              
              // Update total Items
              this.cartProvider.totalItems += 1;

              let newCart = new Object();
              newCart[item.id] = new Array(data);

              this.cartProvider.setCartData({
                partnerID: this.partnerDetails.partnerID,
                name: this.partnerDetails.name,
                cart: newCart,
                total: this.cartProvider.total,
                totalItems: this.cartProvider.totalItems
              })
    
            }
    
            // Check Balance  
            this.checkTotal();
            console.log('Selected Item: ', item);
    
          }).catch(err => {
            console.log(err);
          });

        }

      })
  
      addonModal.present();
    }

  }

  checkTotal() {
    if (this.cartProvider.total >= 100) {
      this.showCart = true;
    } else {
      this.showCart = false;
    }
  }

  loadSummary() {

    this.mixpanel.track("Created Cart");

    this.navCtrl.push('OrderSummaryPage', {}, {
      animate: true,
      direction: 'forward'
    })
  }

  showPartnerErr(item) {
    const msg = this.alertCtrl.create({
      title: "Replace cart items?",
      message: "Your cart items contains items from different restaurant. Do you want to discard the previous selection and add new items?",
      buttons: [
        {
          text: 'NO',
          handler: () => {
            console.log('Not clearing items.');
          }
        },
        {
          text: 'YES',
          handler: () => {
            console.log('Clearing items and adding new');
            this.cartProvider.clearCartData();

            // Setting a timeout just for safe side
            setTimeout(() => {
              this.addToCart(item, true);
            }, 200);
          }
        }
      ]
    })

    msg.present();
  }

  removeFinalCart() {
    this.cartProvider.removeFinalCartData();
  }

}
