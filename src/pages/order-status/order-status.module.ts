import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderStatusPage } from './order-status';

@NgModule({
  declarations: [
    OrderStatusPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderStatusPage),
  ],
})
export class OrderStatusPageModule {}
