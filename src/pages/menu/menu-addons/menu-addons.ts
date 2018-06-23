import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the MenuAddonsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu-addons',
  templateUrl: 'menu-addons.html',
})
export class MenuAddonsPage {

  item: any;
  quantity: Array<any>;
  extras: Array<any>;
  totalPrice: number = 0;
  lastQuantity: any;
  cart: Array<any> = [];
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    let data = JSON.parse(JSON.stringify(this.navParams.data["data"]));
    this.loadItem(data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuAddonsPage');
  }

  loadItem(data) {
    // this.item = data.item;
    
    let quantity = [];
    let extras = [];
    data.item.addons.forEach(addon => {
      if (addon.name === "Quantity") {
        addon.choices.forEach(choice => {
          if (choice.price === 0) {
            choice.selected = true
          }
        });
        quantity.push(addon);
      } else {
        extras.push(addon);
      }
    });

    data.item.quantity = quantity;
    data.item.extras = extras;
    delete data.item.addons;
    
    this.item = data.item;
    console.log('Loaded Item: ', this.item);

    this.totalPrice += this.item.price;
    
    // this.quantity = quantity;
    // this.extras = extras;

  }

  updateQuantity(quantity) {
    this.totalPrice += quantity.price;
    quantity.counter = 0;
    quantity.counter += 1;

    this.cart.push(quantity);

    if (this.lastQuantity) {
      this.totalPrice -= this.lastQuantity.price;
      delete quantity.counter;

      // If the element exists in Cart then remove it.
      for(let i = 0; i < this.cart.length; i++) {
        if (this.cart["name"] === this.lastQuantity.name && this.cart["price"] === this.lastQuantity.price) {
          this.cart = this.cart.splice(i, 1);
          break;
        }
      }

    }

    this.lastQuantity = quantity
  }

  updateExtras(choice) {

    if (choice.selected) {
      this.totalPrice -= choice.price;
      choice.selected = false;
    } else {
      this.totalPrice += choice.price;
      choice.selected = true;
    }

    console.log(choice);

  }

  selectAddons() {
    let data = new Object({
      isNonVeg: this.item.isNonVeg,
      hasAddons: this.item.hasAddons,
      isEnabled: this.item.isEnabled,
      partnerID: this.item.partnerID,
      name: this.item.name,
      id: this.item.id,
      price: this.totalPrice
    });

    if (this.totalPrice > 0) {
      // Add quantity;
      data["quantities"] = this.cart[0] || this.item["quantity"][0].choices[0];

      // Add extras
      let extras = [];

      this.item.extras.forEach(extra => {
        let choices = [];
        
        extra.choices.forEach(choice => {
          if (choice.selected) {
            choices.push(choice);
          }
        });

        if (choices.length > 0) {
          extras.push({
            name: extra.name,
            _id: extra._id,
            choices: choices,
          });
        }

      });

      data["extras"] = extras;

    }

    /* data.push({
      price: this.item.price,
      isNonVeg: this.item.isNonVeg,
      hasAddons: this.item.hasAddons,
      isEnabled: this.item.isEnabled,
      partnerID: this.item.partnerID,
      name: this.item.name,
      id: 10050,
      addons: 
      name: extra.name,
      _id: extra._id,
      choices: choices,
    }); */

    this.viewCtrl.dismiss(data);
  }

  dismiss() {
    this.viewCtrl.dismiss(null);
  }

}
