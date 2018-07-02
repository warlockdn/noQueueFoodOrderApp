import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, ModalController, AlertController } from 'ionic-angular';
import { OrderSummaryPage } from '../order-summary/order-summary';

import { MenuAddonsPage } from './menu-addons/menu-addons';
import { MenuAddonNotificationPage } from './menu-addon-notification/menu-addon-notification';
import { PartnerProvider, Place } from '../../providers/partner/partner';
import { CartProvider } from '../../providers/cart/cart';

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
  
  showCart: Boolean = false;
  isTransparent = true;
  counter: number = 1;
  partnerDetails: Place;
  
  // Is menu loaded
  success: boolean = false;
  
  // If not loaded
  isError: boolean = false;

  menu: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private ref: ChangeDetectorRef, private partnerService: PartnerProvider, public cartProvider: CartProvider, public modalCtrl: ModalController, private alertCtrl: AlertController) {

    const partner: Place = this.navParams.data["data"].data;
    this.partnerDetails = partner;
    if (Array.isArray(this.partnerDetails.characteristics["cuisine"])) {
      this.partnerDetails.characteristics["cuisine"] = this.partnerDetails.characteristics["cuisine"].join(', ')
    }
    this.loadMenu(partner);
    this.checkTotal();

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

  loadMenu(partner: Place) {
    this.partnerService.getMenu(partner.partnerID).subscribe(
      (data) => {
        this.createMenuList(data);
      }, (err) => {
        this.isError = true
      }
    )
  }

  createMenuList(data) {
    
    try {

      let menu = JSON.parse(JSON.stringify(data.collection));

      menu.forEach(collection => {

        // Has subcollection
        if (collection["subcollection"].length > 0) {

          collection["subcollection"].forEach(collection => {
            
            let items = [];
            collection.items.forEach(item => {
              items.push(data["items"][item.id])
            });

            collection.items = items;

          });

          delete collection["items"];

        } else { // has items

          let items = [];
          collection["items"].forEach(item => {
            items.push(data["items"][item.id])
          });
          collection.items = items;
          delete collection["subcollection"];

        }
      });

      console.log(menu);

      this.menu = menu;
      this.success = true;

    } catch(err) {

      this.success = false;
      this.menu = null;

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

        const addonNotificationModal = this.modalCtrl.create(MenuAddonNotificationPage, {}, {
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
      
    } else {
      const addonModal = this.modalCtrl.create(MenuAddonsPage, { 
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
    this.navCtrl.push(OrderSummaryPage, {}, {
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

}
