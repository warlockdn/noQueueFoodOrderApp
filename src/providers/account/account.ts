import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ConstantsProvider } from '../constants/constants';

/*
  Generated class for the AccountProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AccountProvider {

  constructor(public http: HttpClient, public constants: ConstantsProvider) {
    console.log('Hello AccountProvider Provider');
  }

  fetchFromAccount() {
    this.http.get(ConstantsProvider.fetchAccount).subscribe(
      data => {
        if (data["status"] === 200) {
          this.constants.isCheckedIn = true;
          this.constants.checkInDetail = data["details"];
        }
      }
    )
  }

  getOrders() {
    return this.http.get(ConstantsProvider.orderList);
  }

}
