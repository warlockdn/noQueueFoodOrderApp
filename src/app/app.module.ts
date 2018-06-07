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

import { WalkthroughPage } from '../pages/walkthrough/walkthrough';
import { LoginPage } from './../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { HomePage } from '../pages/home/home';
import { PartnerListingPage } from '../pages/partner-listing/partner-listing';
import { PartnerListingPageV2 } from '../pages/partner-listing-v2/partner-listing-v2';
import { MenuPage } from '../pages/menu/menu';
import { OrderSummaryPage } from '../pages/order-summary/order-summary';
import { OrderStatusPage } from '../pages/order-status/order-status';

import { AccordionListComponent } from '../components/accordion-list/accordion-list';

import { InterceptorProvider } from '../providers/interceptor/interceptor';
import { ConstantsProvider } from '../providers/constants/constants';
import { AuthProvider } from '../providers/auth/auth';

@NgModule({
  declarations: [
    ClientApp,
    LoginPage,
    RegisterPage,
    HomePage,
    WalkthroughPage,
    PartnerListingPage,
    PartnerListingPageV2,
    MenuPage,
    OrderSummaryPage,
    OrderStatusPage,
    AccordionListComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(ClientApp, {
      scrollPadding: false,
      scrollAssist: false
    }),
    IonicStorageModule.forRoot(),
    ReactiveFormsModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ClientApp,
    WalkthroughPage,
    LoginPage,
    RegisterPage,
    HomePage,
    PartnerListingPage,
    PartnerListingPageV2,
    MenuPage,
    OrderSummaryPage,
    OrderStatusPage,
    AccordionListComponent,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    ConstantsProvider,
    AuthProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    // { provide: HTTP_INTERCEPTORS, useClass: InterceptorProvider, multi: true },
  ]
})
export class AppModule {}
