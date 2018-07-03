import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginWithpassPage } from './login-withpass';

@NgModule({
  declarations: [
    LoginWithpassPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginWithpassPage),
  ],
})
export class LoginWithpassPageModule {}
