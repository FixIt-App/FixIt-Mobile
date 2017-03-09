import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/Rx'
import { Observable } from "rxjs/Observable";

import { SERVER_URL } from './services.util'
import { Address } from '../models/address';

@Injectable()
export class AddressService {

  constructor(public http: Http) {}

  getAddresses(token: string, idCustomer: number): Observable<any>{
      //todo(a-santamria): change to url addresses of specific customer
      let getAddressesUrl: string = `${SERVER_URL}/api/addresses`;
      console.log(getAddressesUrl);
      var headers = new Headers({ 'Content-Type': 'application/json', 
                                  'Accept': 'application/json',
                                  'Authorization': `Token ${token}`
                                });
      var options = new RequestOptions({ headers: headers });
      return this.http.get(getAddressesUrl, options)
                      .map(response => response.json().map(data => new Address(data)))
                      .catch(this.handleError)
        
    }

    private handleError(error: any): Observable<any> {
        console.error('An error occurred', error);
        return Observable.throw(error.message || error);
    }

}
