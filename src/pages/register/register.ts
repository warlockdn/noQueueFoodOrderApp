import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, ToastController } from 'ionic-angular';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../home/home';
import { Mixpanel, MixpanelPeople } from '@ionic-native/mixpanel';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  @ViewChild(Content)
  content:Content;

  isTransparent = true;

  registerForm: FormGroup;
  phone: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toast: ToastController, private ref: ChangeDetectorRef, private fb: FormBuilder, public auth: AuthProvider, private mixpanel: Mixpanel, private mixpanelPeople: MixpanelPeople) {
    this.phone = this.navParams.data.phone;
    this.createRegisterForm();
    this.mixpanel.track("Opened Registration Page");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
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

  createRegisterForm() {
    this.registerForm = this.fb.group({
      phone: new FormControl(this.phone, [Validators.required, Validators.pattern("^[0-9]{10}$")]),
      email: new FormControl(null, [Validators.email]),
      name: new FormControl(null, Validators.required),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
  }

  register() {

    this.mixpanel.track("Entered Registration Form");

    if (this.registerForm.valid) {
      this.auth.registration(this.registerForm.value)
        .then((response) => {
          this.auth.user = response.customer;
          this.auth.setUser(response.customer);

          this.mixpanel.identify((response.customer.id).toString()).then(() => {
            this.mixpanelPeople.set({
              "$email": response.customer.email,
              "$name": response.customer.name
            });
          });

          this.navCtrl.setRoot(HomePage, {}, {
            animate: true,
            direction: "forward",
            keyboardClose: true
          })

        })
        .catch((err) => {
          const toast = this.toast.create({
            message: 'Error adding user.',
            duration: 3000,
            showCloseButton: true,
            closeButtonText: 'OK'
          });
          toast.present();
        })
    }
  }

}
