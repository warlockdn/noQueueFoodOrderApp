import { Component, forwardRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { LoginWithpassPage } from './login-withpass/login-withpass';
import { RegisterPage } from '../register/register';
import { AuthProvider } from '../../providers/auth/auth';
// import { HomePage } from '../home/home';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder, public auth: AuthProvider) {
    if (this.navParams.data.data) {
      this.auth.fromCart = true;
    }
    this.createLoginForm()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      phone: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]{10}$")])
    })
  }

  authenticate() {

    if (this.loginForm.valid) {

      this.auth.checkUser(this.loginForm.value.phone).subscribe(
        (data) => {
          
          if (data.result) {

            // Navigate to Register Page - Account exists.
            this.navCtrl.push(LoginWithpassPage, {
              phone: this.loginForm.value.phone
            }, {
              animate: true,
              direction: "forward"
            });

          } else {

            // Navigate to Register Page - Account doesn't exist.
            this.navCtrl.push(RegisterPage, {
              phone: this.loginForm.value.phone
            }, {
              animate: true,
              direction: "forward"
            });

          }

        }, (err) => {
          
        }
      )

    }

  }

}
