import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { OrderSummaryPage } from '../order-summary/order-summary';

/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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

  items = [
    {
      name: 'Veg Starters',
      items: ['Deep Fried Paneer', 'Crispy Corn', 'and 9 more'],
      description: 'Brazil’s visa waiver during the Olympics was a success for one big reason: it encouraged travel beyond the big cities. The tourism board hopes to bring back the waiver, and if you’re planning to take advantage, save time to visit Angra dos Reis, between Rio and São Paulo. This popular Brazilian vacation area is where cariocas go to escape the crowds. “It’s where many of the country’s elite have their beach villas,” says Martin Frankenberg of Matuete, who has access to several of these glamorous rentals. Big changes are coming to the region. In May, Brazilian chain Fasano will open a long-awaited 54-suite hotel in a complex that includes a marina, golf course, restaurants, and a spa. The design is striking, with elevated wooden buildings that look like they’re floating, all with open-air terraces and views of the forest and sea. And the government recently pledged $8 million to improve the infrastructure on Ilha Grande—an island that’s so popular that they’ve had to impose a daily limit on visitors. —Stephanie Wu',
      imageUrl: 'https://cdn-image.travelandleisure.com/sites/default/files/styles/964x524/public/1479915553/angra-dos-reis-brazil-WTG2017.jpg?itok=damBsB9G',
    },
    {
      name: 'Non-Veg Starters',
      items: ['Deep Fried Paneer', 'Crispy Corn', 'and 9 more'],
      description: 'With a growing array of open-air bars, arts venues, and restaurants, Belfast is quickly becoming an attractive destination for travelers. Stay at the design-forward Bullitt Hotel (inspired by the Steve McQueen film), which opened in October with casual, well-appointed rooms and complimentary grab-and-go breakfast granola. Check out arts organization Seedhead, which runs street-art tours and hosts pop-up cabarets around the city. The Michelin-starred OX and EIPIC lead the fine-dining pack, but also visit Permit Room, with its internationally inspired breakfast and locally roasted coffee. Noteworthy new nightlife spots include the Muddlers Club, a stylish restaurant and cocktail bar in the trendy Cathedral Quarter, and Vandal, a graffiti-adorned pizza place that turns into a late-night club, on the top floor of a 17th-century pub.—Nell McShane Wulfhart',
      imageUrl: 'https://cdn-image.travelandleisure.com/sites/default/files/styles/964x524/public/1480711606/belfast-city-hall-northern-ireland-WTG2017.jpg?itok=mCqumH31',
    }    
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams, private ref: ChangeDetectorRef) {}

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

  changeStatus(status) {
    this.isTransparent = status;
  }

  updateCounter(status: Boolean) {
    if (status) {
      ++this.counter;
      this.showCart = true;
    } else {
      --this.counter;
      this.showCart = false;
    }
  }

  loadSummary() {
    this.navCtrl.push(OrderSummaryPage, {}, {
      animate: true,
      direction: 'forward'
    })
  }

}
