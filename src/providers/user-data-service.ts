import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/Rx'
import { Observable } from "rxjs/Observable";


import { Customer } from '../models/user';

import { SERVER_URL } from './services.util'

@Injectable()
export class UserDataService {
  customer: Customer;

  constructor(private http: Http) {
  }

  getCustomer(): Customer {
    return this.customer;
  }

  setCustomer(customer: Customer): void {
    this.customer = customer;
  }

  saveCustomer(customer: Customer): Observable<Customer> {
     let createCustomerURI: string = `${SERVER_URL}/api/customers/`
     var headers = new Headers({ 'Content-Type': 'application/json', 
                                  'Accept': 'application/json',
     })
     var options = new RequestOptions({ headers: headers });
     return this.http.post(createCustomerURI, customer.export(), options)
                .map(response => response.json() as Customer)
                .catch(this.handleError)
  }

  updateCustomer(idCustomer: number, fieldName: string, fieldValue: string): Observable<Customer> {
     let token = localStorage.getItem('token');
     let customerURI: string = `${SERVER_URL}/api/customers/${idCustomer}/`
     var headers = new Headers({ 'Content-Type': 'application/json', 
                                  'Accept': 'application/json',
                                  'Authorization': `Token ${token}`});
     let obj = {};
     obj[fieldName] = fieldValue;
     console.log(obj);
     let body = JSON.stringify(obj)
     console.log(body);
     var options = new RequestOptions({ headers: headers });
     return this.http.put(customerURI, body, options)
                .map(response => new Customer(response.json()))
                .catch(this.handleError)
  } 

  private handleError(error: any): Observable<any> {
        console.error('An error occurred', error);
        return Observable.throw(error.message || error);
    }

}
