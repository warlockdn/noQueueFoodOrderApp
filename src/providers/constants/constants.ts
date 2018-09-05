import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
// import { Observable } from 'rxjs/Observable';

/*
  Generated class for the ConstantsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.

  <!-- Production -->
  <!-- <preference name="CodePushDeploymentKey" value="LLyzO_LC6DAZn31VAFwF0sIHxj6L85652288-c0b9-405f-be8a-3d3a4145e7aa" /> -->
  <!-- <!-- Staging -->
  <preference name="CodePushDeploymentKey" value="upe9_Bn_4hHQSDEyWAaZT96PyABJ85652288-c0b9-405f-be8a-3d3a4145e7aa" />

*/

export interface CheckInDetail {
  name: String,
  checkInTime: Date,
  partnerID: Number,
  room: String
}

@Injectable()
export class ConstantsProvider {

  // used for an example of ngFor and navigation
  public loggedInMenu: Array<{title: string, subtitle: string, component: any, disabled?: boolean }> = [
    { title: 'Home', subtitle: '', component: 'HomePage', disabled: false },
    { title: 'Account', subtitle: 'History, Payments, etc.', component: 'OrderHistoryPage', disabled: false },
    { title: 'Coupons', subtitle: '', component: 'HomePage', disabled: true },
    { title: 'Points', subtitle: '', component: 'HomePage', disabled: true },
    { title: 'Settings', subtitle: 'Accounts, Reviews, Referrals, etc.', component: 'HomePage', disabled: true }
  ];

  public notLoggedInMenu: Array<{title: string, subtitle: string, component?: any, disabled: boolean }> = [
    { title: 'Home', subtitle: '', component: 'HomePage', disabled: false },
    { title: 'Account', subtitle: 'History, Payments, etc.', disabled: true },
    { title: 'Coupons', subtitle: '', disabled: true },
    { title: 'Points', subtitle: '', disabled: true },
    { title: 'Settings', subtitle: 'Accounts, Reviews, Referrals, etc.', disabled: true }
  ];

  public static mixPanelToken = "1e1e7305ce755346eb4069d1440ad6bc";
  public static razorPayKey = "rzp_test_8ZuXe81gFihhsI";
  public static api = "http://localhost:3003/v1/";
  public static partnerlogoURL = "https://res.cloudinary.com/ddiiq3bzl/image/upload/fl_lossy,f_auto,w_400,h_400,f_auto,c_fill/logo/";
 
  // Auth
  public static findCustomer = "http://192.168.31.190:3003/v1/auth/findCustomer";
  public static register = "http://192.168.31.190:3003/v1/auth/registration";
  public static authByPhonePass = "http://192.168.31.190:3003/v1/auth/login";
  public static authByOTP = "http://192.168.31.190:3003/v1/auth/loginByOtp";

  // Places
  public static getSinglePartner = "http://192.168.31.190:3003/v1/places/";
  public static getPlaces = "http://192.168.31.190:3003/v1/places/listPlaces";
  public static getMenu = "http://192.168.31.190:3003/v1/places/menu/";

  // Cart
  public static cart = "http://192.168.31.190:3003/v1/cart/manage";
  public static notifyStatus = "http://192.168.31.190:3003/v1/cart/notify";
  public static capturePayment = "http://192.168.31.190:3003/v1/cart/capture";
  public static validateCoupon = "http://192.168.31.190:3003/v1/cart/validateCoupon";

  // Account
  public static orderList = "http://192.168.31.190:3003/v1/account/orders";
  public static fetchAccount = "http://192.168.31.190:3003/v1/account/fetch";

  public token = null;
  public isCheckedIn: boolean = false;
  public checkInDetail: CheckInDetail;

  constructor(public http: HttpClient, private storage: Storage) {
    console.log('Hello ConstantsProvider Provider');
    this.getToken().then((token) => {
      if (token) {
        console.log(token);
        this.token = token;
      }
    })
  }

  getToken() {
    return this.storage.get("token").then((token) => {
      return token;
    }).catch((err) => {
      return err;
    })
  }

  setToken(token) {
    console.log('Setting Token ', token);
    this.storage.set("token", token);
    this.token = token;
  }

  getCheckInDetail() {
    return this.storage.get("checkInData").then((data) => {
      return data;
    }).catch(err => {
      return err;
    })
  }

  setCheckInDetail(data) {
    this.storage.set("checkInData", data);
    this.isCheckedIn = true;
    this.checkInDetail = data;
  }
  
  removeCheckInDetail() {
    this.isCheckedIn = false;
    this.checkInDetail = null;
    this.storage.remove("checkInData");
  }

}
