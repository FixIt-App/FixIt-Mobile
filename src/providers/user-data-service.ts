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

  createCustomer(customer: Customer): Observable<Customer> {
     if(!customer.idCustomer) {
      let createCustomerURI: string = `${SERVER_URL}/api/customers/`
      var headers = new Headers({ 'Content-Type': 'application/json', 
                                  'Accept': 'application/json'})
      var options = new RequestOptions({ headers: headers });
       console.log('call create');
       return this.http.post(createCustomerURI, customer.export(), options)
         .map(response => new Customer(response.json()))
         .catch(this.handleError)
     } else {
      let customerURI: string = `${SERVER_URL}/api/customers/${customer.idCustomer}/`
      let token = localStorage.getItem('token');
      var headers = new Headers({ 'Content-Type': 'application/json', 
                                  'Accept': 'application/json',
                                  'Authorization': `Token ${token}`});
      var options = new RequestOptions({ headers: headers });
      console.log('call edit');
      console.log(customer.export())
      return this.http.put(customerURI, customer.export(), options)
        .map(response => new Customer(response.json()))
        .catch(this.handleError)
     }
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

  isEmailAvailable(email: string): Observable<boolean> {
    let emailAvailableURI: string = `${SERVER_URL}/api/customer/email/${email}/available/`
    var headers;
    let token = localStorage.getItem('token');
    if(token) {
      console.log('si hay token ' + token);
      headers = new Headers({ 'Content-Type': 'application/json', 
                                'Accept': 'application/json',
                                'Authorization': `Token ${token}`});
    } else {
      headers = new Headers({ 'Content-Type': 'application/json', 
                               'Accept': 'application/json'});
    }
    console.log(emailAvailableURI);
    var options = new RequestOptions({ headers: headers });
    return this.http.get(emailAvailableURI, options)
            .map(response => response.json() )
  }

  isPhoneAvailable(phone: string): Observable<boolean> {
    let phoneAvailableURI: string = `${SERVER_URL}/api/customer/phone/${phone}/available/`
    var headers;
    let token = localStorage.getItem('token');
    if(token)
      headers = new Headers({ 'Content-Type': 'application/json', 
                                'Accept': 'application/json',
                                'Authorization': `Token ${token}`});
    else {
      headers = new Headers({ 'Content-Type': 'application/json', 
                               'Accept': 'application/json'});
    }
    console.log(phoneAvailableURI);
    var options = new RequestOptions({ headers: headers });
    return this.http.get(phoneAvailableURI, options)
            .map(response => response.json() )
  }

  private handleError(error: any): Observable<any> {
        console.error('An error occurred', error);
        return Observable.throw(error.message || error);
  }

}
