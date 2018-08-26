import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Menu, Events, MenuController, ToastController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { Deeplinks } from '@ionic-native/deeplinks';
import { Mixpanel, MixpanelPeople } from '@ionic-native/mixpanel';

import { AuthProvider } from '../providers/auth/auth';
import { FirebaseProvider } from '../providers/firebase/firebase';
import { ConstantsProvider } from '../providers/constants/constants';
import { AccountProvider } from '../providers/account/account';
import { PartnerProvider, Hotel } from '../providers/partner/partner';
import { CartProvider } from '../providers/cart/cart';

@Component({
  templateUrl: 'app.html'
})

export class ClientApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  isLoggedIn: boolean = false;

  /* // used for an example of ngFor and navigation
  loggedInMenu: Array<{title: string, subtitle: string, component: any, disabled?: boolean }> = [
    { title: 'Home', subtitle: '', component: 'HomePage', disabled: false },
    { title: 'Account', subtitle: 'History, Payments, etc.', component: 'OrderHistoryPage', disabled: false },
    { title: 'Coupons', subtitle: '', component: 'HomePage', disabled: true },
    { title: 'Points', subtitle: '', component: 'HomePage', disabled: true },
    { title: 'Settings', subtitle: 'Accounts, Reviews, Referrals, etc.', component: 'HomePage', disabled: true }
  ];

  notLoggedInMenu: Array<{title: string, subtitle: string, component?: any, disabled: boolean }> = [
    { title: 'Home', subtitle: '', component: 'HomePage', disabled: false },
    { title: 'Account', subtitle: 'History, Payments, etc.', disabled: true },
    { title: 'Coupons', subtitle: '', disabled: true },
    { title: 'Points', subtitle: '', disabled: true },
    { title: 'Settings', subtitle: 'Accounts, Reviews, Referrals, etc.', disabled: true }
  ] */

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
    public constants: ConstantsProvider,
    public account: AccountProvider,
    public deeplinks: Deeplinks,
    private loadingCtrl: LoadingController,
    public partnerService: PartnerProvider,
    public cartProvider: CartProvider,
    private mixpanel: Mixpanel, 
    private mixpanelPeople: MixpanelPeople,
  ) {

    this.mixpanel.init(ConstantsProvider.mixPanelToken)
      .then(success => {
        console.log("Mixpanel successfully initiated");
      })
      .catch(err => {
        console.log("Mixpanel initiate error");
      });

    this.mixpanel.track("App Open");
    this.mixpanel.distinctId();
    
    this.storage.get('tutorialSeen')
      .then((seen) => {
        if (seen) {
          this.rootPage = 'HomePage'
        } else {
          this.rootPage = 'WalkthroughPage'
        }
        this.initializeApp();
      });

    this.auth.loggedInStatus().then((status) => {
      if (status) {
        this.isLoggedIn = true
        if (this.platform.is("android") || this.platform.is("ios")) {
          this.firebase.getToken();
        }
        this.account.fetchFromAccount();
      } else {
        this.isLoggedIn = false;
      }

      /* this.deeplinks.routeWithNavController(this.nav, {
        '/order-detail/:productId': 'OrderDetailPage'
      }).subscribe(match => {
        // match.$route - the route we matched, which is the matched entry from the arguments to route()
        // match.$args - the args passed in the link
        // match.$link - the full link data
        console.log('Successfully matched route', match);
      }, nomatch => {
        // nomatch.$link - the full link data
        console.error('Got a deeplink that didn\'t match', nomatch);
      }); */

      

    })
    
    this.menu.enable(true);
    this.listenToLoginEvents();

  }

  loadHotelMenu(partner: Hotel) {
    
    this.menu.close();

    const loading = this.loadingCtrl.create({
      content: "Loading..."
    })

    loading.present();

    // this.partnerService.removePartner();
    // this.cartProvider.clearCartData();

    loading.dismiss();

    this.nav.push('MenuPage', {
      data: {
        isDirect: true,
        partner: partner
      }
    }, {
      animate: true,
      direction: 'forward',
    });
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
      this.account.fetchFromAccount();
    });

    this.events.subscribe('user:logout', () => {
      this.isLoggedIn = false;
      // this.mixpanel.reset();
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
    this.nav.push('LoginPage', {}, {
      animate: true,
      direction: "forward"
    });
  }

  logout() {

    this.menu.close();
    this.auth.logout();
    setTimeout(() => {
      this.events.publish("user:logout");
      this.nav.setRoot('HomePage', {}, {
        animate: true,
        direction: "switch"
      });
    }, 200);
    
  }

}
