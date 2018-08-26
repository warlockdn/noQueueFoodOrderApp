import { Component, forwardRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { AuthProvider } from '../../providers/auth/auth';
import { Mixpanel } from '@ionic-native/mixpanel';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder, public auth: AuthProvider, public loading: LoadingController, public alertCtrl: AlertController, private mixpanel: Mixpanel) {
    if (this.navParams.data.data) {
      this.auth.fromCart = true;
    }
    this.createLoginForm();

    this.mixpanel.track("Opened Login Page")
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

    this.mixpanel.track("Entered Login Form");

    if (this.loginForm.valid) {

      const loading = this.loading.create({
        content: "Finding user"
      });

      loading.present();

      this.auth.checkUser(this.loginForm.value.phone).subscribe(
        (data) => {
          
          if (data.result) {

            loading.dismiss();

            // Navigate to Register Page - Account exists.
            this.navCtrl.push('LoginWithpassPage', {
              phone: this.loginForm.value.phone
            }, {
              animate: true,
              direction: "forward"
            });

          } else {

            loading.dismiss();

            // Navigate to Register Page - Account doesn't exist.
            this.navCtrl.push('RegisterPage', {
              phone: this.loginForm.value.phone
            }, {
              animate: true,
              direction: "forward"
            });

          }

        }, (err) => {
          
          const alert = this.alertCtrl.create({
            title: "Error!",
            message: "There seems to be a problem. Please try again later.",
            buttons: ["OK"]
          });

          alert.present();

        }
      )

    }

  }

}
