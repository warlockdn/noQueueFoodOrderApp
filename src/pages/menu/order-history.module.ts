import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderHistoryPage } from './order-history';

@NgModule({
  declarations: [
    OrderHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderHistoryPage),
  ],
})
export class OrderHistoryPageModule {}
