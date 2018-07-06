import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Menu, Events, MenuController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { WalkthroughPage } from '../pages/walkthrough/walkthrough';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { OrderHistoryPage } from '../pages/account/order-history/order-history';

import { AuthProvider } from '../providers/auth/auth';
import { FirebaseProvider } from '../providers/firebase/firebase';
import { ConstantsProvider } from '../providers/constants/constants';

@Component({
  templateUrl: 'app.html'
})
export class ClientApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  isLoggedIn: boolean = false;

  // used for an example of ngFor and navigation
  loggedInMenu: Array<{title: string, subtitle: string, component: any, disabled?: boolean }> = [
    { title: 'Home', subtitle: '', component: HomePage, disabled: false },
    { title: 'Account', subtitle: 'History, Payments, etc.', component: OrderHistoryPage, disabled: false },
    { title: 'Coupons', subtitle: '', component: HomePage, disabled: true },
    { title: 'Points', subtitle: '', component: HomePage, disabled: true },
    { title: 'Settings', subtitle: 'Accounts, Reviews, Referrals, etc.', component: HomePage, disabled: true }
  ];

  notLoggedInMenu: Array<{title: string, subtitle: string, component?: any, disabled: boolean }> = [
    { title: 'Home', subtitle: '', component: HomePage, disabled: false },
    { title: 'Account', subtitle: 'History, Payments, etc.', disabled: true },
    { title: 'Coupons', subtitle: '', disabled: true },
    { title: 'Points', subtitle: '', disabled: true },
    { title: 'Settings', subtitle: 'Accounts, Reviews, Referrals, etc.', disabled: true }
  ]

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen, 
    private storage: Storage, 
    private auth: AuthProvider,
    public menu: MenuController,
    public events: Events,
    public firebase: FirebaseProvider,
    public toastCtrl: ToastController,
    public constants: ConstantsProvider
  ) {
    
    this.storage.get('tutorialSeen')
      .then((seen) => {
        if (seen) {
          this.rootPage = HomePage
        } else {
          this.rootPage = WalkthroughPage
        }
        this.initializeApp();
      });

    this.auth.loggedInStatus().then((status) => {
      if (status) {
        this.isLoggedIn = true
        this.firebase.getToken();
      } else {
        this.isLoggedIn = false;
      }
    })


    
    this.menu.enable(true);
    this.listenToLoginEvents();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.isLoggedIn = true;
    });

    this.events.subscribe('user:logout', () => {
      this.isLoggedIn = false;
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario

    if (page.disabled) {
      return;
    }
    
    this.nav.setRoot(page.component);
  }

  goToLogin() {
    this.menu.close();
    this.nav.push(LoginPage, {}, {
      animate: true,
      direction: "forward"
    });
  }

  logout() {

    this.menu.close();
    this.auth.logout();
    setTimeout(() => {
      this.events.publish("user:logout");
      this.nav.setRoot(HomePage, {}, {
        animate: true,
        direction: "switch"
      });
    }, 200);
    
  }

}
