import { CreditCard } from './../models/credit-card';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/Rx'
import { Observable } from "rxjs/Observable";
import { SERVER_URL, TPAGA_URL } from './services.util'

@Injectable()
export class PaymentService {

  constructor(public http: Http) {
    console.log('Hello PaymentService Provider');
  }

  saveCreditCard(card: CreditCard): Observable<any> {
     let tokenizeCreditCardUrl: string = `${TPAGA_URL}/tokenize/credit_card`;
      var headers = new Headers({ 'Content-Type': 'application/json', 
                                  'Accept': 'application/json',
                                  'Authorization': `Basic ZG4ybHRrM3JyanRybG9raG1vY2Y2bGxoaHF2dXFoZTI6`
                              });

      var body = card.exportTPaga();
      console.log(body);
      var options = new RequestOptions({ headers: headers });
      return this.http.post(tokenizeCreditCardUrl, body, options)
                      .map(response => response.json())
                      .catch(this.handleError)
  }

  saveTokenToServer(tokenCreditCard: string) {
    let token = localStorage.getItem('token');
    // TODO (a-santamaria): revisar que funcione
    let tpagoTokenUrl: string = `${SERVER_URL}/api/tpago/token/`;
      var headers = new Headers({ 'Content-Type': 'application/json', 
                                  'Accept': 'application/json',
                                  'Authorization': `Token ${token}`
                              });

      var options = new RequestOptions({ headers: headers });
      return this.http.post(tpagoTokenUrl, { token: tokenCreditCard }, options)
                      .map(response => response.status)
                      .catch(this.handleError)
  }

  getCreditCard(): Observable<CreditCard> {
    let token = localStorage.getItem('token');
    console.log(token);
    let getCreditCardUrl: string = `${SERVER_URL}/api/customer/tpago/payment/`;
      var headers = new Headers({ 'Content-Type': 'application/json', 
                                  'Accept': 'application/json',
                                  'Authorization': `Token ${token}`
                              });

      var options = new RequestOptions({ headers: headers });
      return this.http.get(getCreditCardUrl, options)
                      .map(response => new CreditCard(response.json()))
                      .catch(this.handleError)
  }

  deleteCreditCard() {
    let token = localStorage.getItem('token');
    console.log(token);
    let getCreditCardUrl: string = `${SERVER_URL}/api/customer/tpago/payment/`;
      var headers = new Headers({ 'Content-Type': 'application/json', 
                                  'Accept': 'application/json',
                                  'Authorization': `Token ${token}`
                              });

      var options = new RequestOptions({ headers: headers });
      return this.http.delete(getCreditCardUrl, options)
                      .map(response => response.status)
                      .catch(this.handleError)
  }
  private handleError(error: any): Observable<any> {
    console.error('An error occurred', error);
    return Observable.throw(error.message || error);
  }
}
