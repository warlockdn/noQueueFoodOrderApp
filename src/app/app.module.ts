import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { ClientApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { Firebase } from '@ionic-native/firebase';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

const firebase = {
  apiKey: "AIzaSyA2BVvIim73UWQj5z5lFRwMIGCShSk27Ho",
  authDomain: "resapp-1523718961807.firebaseapp.com",
  databaseURL: "https://resapp-1523718961807.firebaseio.com",
  projectId: "resapp-1523718961807",
  messagingSenderId: "872990739786"
}  

import { WalkthroughPage } from '../pages/walkthrough/walkthrough';
import { LoginPage } from './../pages/login/login';
import { LoginWithpassPage } from '../pages/login/login-withpass/login-withpass';
import { RegisterPage } from '../pages/register/register';
import { HomePage } from '../pages/home/home';
import { PartnerListingPage } from '../pages/partner-listing/partner-listing';
import { PartnerListingPageV2 } from '../pages/partner-listing-v2/partner-listing-v2';
import { MenuPage } from '../pages/menu/menu';
import { MenuAddonsPage } from '../pages/menu/menu-addons/menu-addons';
import { MenuAddonNotificationPage } from '../pages/menu/menu-addon-notification/menu-addon-notification';
import { OrderSummaryPage } from '../pages/order-summary/order-summary';
import { OrderStatusPage } from '../pages/order-status/order-status';
import { OrderHistoryPage } from '../pages/account/order-history/order-history';
import { OrderDetailPage } from '../pages/account/order-detail/order-detail';

import { AccordionListComponent } from '../components/accordion-list/accordion-list';

import { InterceptorProvider } from '../providers/interceptor/interceptor';
import { ConstantsProvider } from '../providers/constants/constants';
import { AuthProvider } from '../providers/auth/auth';
import { PartnerProvider } from '../providers/partner/partner';
import { CartProvider } from '../providers/cart/cart';
import { FirebaseProvider } from '../providers/firebase/firebase';
import { OrderProvider } from '../providers/order/order';

@NgModule({
  declarations: [
    ClientApp,
    LoginPage,
    LoginWithpassPage,
    RegisterPage,
    HomePage,
    WalkthroughPage,
    PartnerListingPage,
    PartnerListingPageV2,
    MenuPage,
    MenuAddonsPage,
    MenuAddonNotificationPage,
    OrderSummaryPage,
    OrderStatusPage,
    AccordionListComponent,
    OrderHistoryPage,
    OrderDetailPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(ClientApp, {
      scrollPadding: false,
      scrollAssist: false
    }),
    IonicStorageModule.forRoot(),
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebase), 
    AngularFirestoreModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ClientApp,
    WalkthroughPage,
    LoginPage,
    LoginWithpassPage,
    RegisterPage,
    HomePage,
    PartnerListingPage,
    PartnerListingPageV2,
    MenuPage,
    MenuAddonsPage,
    MenuAddonNotificationPage,
    OrderSummaryPage,
    OrderStatusPage,
    AccordionListComponent,
    OrderHistoryPage,
    OrderDetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    InAppBrowser,
    ConstantsProvider,
    AuthProvider,
    Firebase,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    PartnerProvider,
    CartProvider,
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorProvider, multi: true },
    FirebaseProvider,
    OrderProvider,
  ]
})
export class AppModule {}
