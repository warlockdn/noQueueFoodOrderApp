import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { ConstantsProvider } from '../constants/constants';
import { Observable } from 'rxjs/Observable';
/*
  Generated class for the PartnerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

export interface Place {
  basic: {
    address: string,
    city: string,
    pincode: string,
    state: string
  },
  characteristics: Object,
  imageid: string,
  location: {
    coordinates: Array<Number>,
    type: string
  },
  name: string,
  partnerID: number,
  phone: number
}

@Injectable()
export class PartnerProvider {

  places: any;

  constructor(public http: HttpClient, public storage: Storage) {
    console.log('Hello PartnerProvider Provider');
  }

  listPlaces(coordinates): Observable<any> {
    return this.http.get(ConstantsProvider.getPlaces, {
      params: {
        lat: coordinates.latitude,
        long: coordinates.longitude,
        altitude: coordinates.altitude
      }
    });
  }

  getMenu(partnerID): Observable<any> {
    return this.http.get(ConstantsProvider.getMenu + partnerID);
  }

  getPartner() {
    return this.storage.get('Partner').then(
      (data) => {
        return data;
    }, (err) => {
        return err;
    })
  }

  setPartner(partner) {
    this.storage.set('Partner', partner).then(
      (data) => {
        return data;
      }, (err) => {
        return err;
      }
    )
  }

  removePartner() {
    this.storage.remove('Partner');
  }

}
