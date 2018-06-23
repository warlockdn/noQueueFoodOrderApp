import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, ToastController, Events } from 'ionic-angular';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HomePage } from '../../home/home';

import { AuthProvider } from '../../../providers/auth/auth';

/**
 * Generated class for the LoginWithpassPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login-withpass',
  templateUrl: 'login-withpass.html',
})
export class LoginWithpassPage {

  @ViewChild(Content)
  content:Content;

  loginForm: FormGroup;
  phone: number;

  isTransparent = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder, private ref: ChangeDetectorRef, public auth: AuthProvider, public toast: ToastController, public events: Events) {
    this.phone = this.navParams.data.phone;
    this.createLoginForm()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginWithpassPage');
  }

  ngAfterViewInit() {
    this.content.ionScroll.subscribe((event) => {
      if (parseInt(event.scrollTop) > 120) {
        this.changeStatus(false);
      } else {
        this.changeStatus(true);
      }
      this.ref.detectChanges();
    })
  }

  changeStatus(status) {
    this.isTransparent = status;
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      phone: new FormControl(this.phone, [Validators.required, Validators.pattern("^[0-9]{10}$")]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
  }

  login() {

    if (this.loginForm.valid) {

      this.auth.authenticate({
        phone: this.loginForm.value.phone,
        password: this.loginForm.value.password
      }).subscribe(
        response => {
          
          this.auth.setUser(response.customer);

          this.navCtrl.setRoot(HomePage, {}, {
            animate: true,
            direction: "forward"
          })

        }, error => {

          const errToast = this.toast.create({
            message: 'Some error ocurred. Please try again later',
            duration: 5000,
            position: 'bottom'
          })

        }
      )

    }

  }

}
