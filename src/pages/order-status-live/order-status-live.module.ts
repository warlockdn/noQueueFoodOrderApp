import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderStatusLivePage } from './order-status-live';

@NgModule({
  declarations: [
    OrderStatusLivePage,
  ],
  imports: [
    IonicPageModule.forChild(OrderStatusLivePage),
  ],
})
export class OrderStatusLivePageModule {}
