import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartnerListingPage } from './partner-listing';

@NgModule({
  declarations: [
    PartnerListingPage,
  ],
  imports: [
    IonicPageModule.forChild(PartnerListingPage),
  ],
})
export class PartnerListingPageModule {}
