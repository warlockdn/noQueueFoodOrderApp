import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderSummaryLivePage } from './order-summary-live';

@NgModule({
  declarations: [
    OrderSummaryLivePage,
  ],
  imports: [
    IonicPageModule.forChild(OrderSummaryLivePage),
  ],
})
export class OrderSummaryLivePageModule {}
