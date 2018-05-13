import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { ClientApp } from './app.component';

import { LoginPage } from './../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { HomePage } from '../pages/home/home';
import { PartnerListingPage } from '../pages/partner-listing/partner-listing';
import { PartnerListingPageV2 } from '../pages/partner-listing-v2/partner-listing-v2';
import { MenuPage } from '../pages/menu/menu';
import { OrderSummaryPage } from '../pages/order-summary/order-summary';
import { OrderStatusPage } from '../pages/order-status/order-status';

import { AccordionListComponent } from '../components/accordion-list/accordion-list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    ClientApp,
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
  imports: [
    BrowserModule,
    IonicModule.forRoot(ClientApp, {
      scrollPadding: false,
      scrollAssist: false
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ClientApp,
    LoginPage,
    RegisterPage,
    HomePage,
    PartnerListingPage,
    PartnerListingPageV2,
    MenuPage,
    OrderSummaryPage,
    OrderStatusPage,
    AccordionListComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
