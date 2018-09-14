import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RestaurantOrderTypeModalPage } from './restaurant-order-type-modal';

@NgModule({
  declarations: [
    RestaurantOrderTypeModalPage,
  ],
  imports: [
    IonicPageModule.forChild(RestaurantOrderTypeModalPage),
  ],
})
export class RestaurantOrderTypeModalPageModule {}
