import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/Rx'
import { Observable } from "rxjs/Observable";

import { SERVER_URL } from './services.util'
import { Address } from '../models/address';

@Injectable()
export class AddressService {
    token: string;

    constructor(public http: Http) {
        this.token = localStorage.getItem('token');
    }

    getCustomerAddresses(): Observable<any> {
        let getAddressesUrl: string = `${SERVER_URL}/api/myadresses/`;
        var headers = new Headers({ 'Content-Type': 'application/json', 
                                    'Accept': 'application/json',
                                    'Authorization': `Token ${this.token}`
                                    });
        var options = new RequestOptions({ headers: headers });
        return this.http.get(getAddressesUrl, options)
                        .map(response => response.json().map(data => new Address(data)))
                        .catch(this.handleError)
        
    }

    addCustomerAddress(newAddres: Address): Observable<any> {
        let getAddressesUrl: string = `${SERVER_URL}/api/myadresses/`;
        var headers = new Headers({ 'Content-Type': 'application/json', 
                                    'Accept': 'application/json',
                                    'Authorization': `Token ${this.token}`
                                });
        var body = JSON.stringify(newAddres);
        var options = new RequestOptions({ headers: headers });
        return this.http.post(getAddressesUrl, body, options)
                        .map(response =>  new Address(response))
                        .catch(this.handleError)
        
    }

    private handleError(error: any): Observable<any> {
        console.error('An error occurred', error);
        return Observable.throw(error.message || error);
    }

}
