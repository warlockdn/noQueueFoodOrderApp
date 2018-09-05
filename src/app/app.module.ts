import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicApp, IonicModule } from 'ionic-angular';

import { ClientApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Deeplinks } from '@ionic-native/deeplinks';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Mixpanel, MixpanelPeople } from '@ionic-native/mixpanel';

import { Firebase } from '@ionic-native/firebase';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { CodePush } from '@ionic-native/code-push';

const firebase = {
  apiKey: "AIzaSyA2BVvIim73UWQj5z5lFRwMIGCShSk27Ho",
  authDomain: "resapp-1523718961807.firebaseapp.com",
  databaseURL: "https://resapp-1523718961807.firebaseio.com",
  projectId: "resapp-1523718961807",
  messagingSenderId: "872990739786"
}

import { ComponentsModule } from '../components/components.module';
import { InterceptorProvider } from '../providers/interceptor/interceptor';
import { ConstantsProvider } from '../providers/constants/constants';
import { AuthProvider } from '../providers/auth/auth';
import { PartnerProvider } from '../providers/partner/partner';
import { CartProvider } from '../providers/cart/cart';
import { FirebaseProvider } from '../providers/firebase/firebase';
import { OrderProvider } from '../providers/order/order';
import { AccountProvider } from '../providers/account/account';

import { SentryIonicErrorHandler } from './sentry';

@NgModule({
  declarations: [
    ClientApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(ClientApp, {
      scrollPadding: false,
      scrollAssist: false,
      backButtonText: '',
      backButtonIcon: 'ios-arrow-back-outline'
    }),
    IonicStorageModule.forRoot(),
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebase), 
    AngularFirestoreModule,
    ComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ClientApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    InAppBrowser,
    ConstantsProvider,
    AuthProvider,
    Firebase,
    Deeplinks,
    Mixpanel,
    MixpanelPeople,
    CodePush,
    { provide: ErrorHandler, useClass: SentryIonicErrorHandler },
    PartnerProvider,
    CartProvider,
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorProvider, multi: true },
    FirebaseProvider,
    OrderProvider,
    AccountProvider,
    BarcodeScanner
  ]
})
export class AppModule {}
