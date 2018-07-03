import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartnerListingPageV2 } from './partner-listing-v2';

@NgModule({
  declarations: [
    PartnerListingPageV2,
  ],
  imports: [
    IonicPageModule.forChild(PartnerListingPageV2),
  ],
})
export class PartnerListingV2PageModule {}
