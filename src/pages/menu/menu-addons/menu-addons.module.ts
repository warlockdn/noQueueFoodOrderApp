import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuAddonsPage } from './menu-addons';

@NgModule({
  declarations: [
    MenuAddonsPage,
  ],
  imports: [
    IonicPageModule.forChild(MenuAddonsPage),
  ],
})
export class MenuAddonsPageModule {}
