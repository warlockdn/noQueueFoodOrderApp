import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Menu } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { HomePage } from '../pages/home/home';
import { OrderStatusPage } from '../pages/order-status/order-status';

@Component({
  templateUrl: 'app.html'
})
export class ClientApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = RegisterPage;

  pages: Array<{title: string, subtitle: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', subtitle: '', component: HomePage },
      { title: 'List', subtitle: 'History, Payments, etc.', component: HomePage },
      { title: 'Coupons', subtitle: '', component: HomePage },
      { title: 'Points', subtitle: '', component: HomePage },
      { title: 'Settings', subtitle: 'Accounts, Reviews, Referrals, etc.', component: HomePage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
