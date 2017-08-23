import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/Rx'
import { Observable } from "rxjs/Observable";

import { SERVER_URL } from './services.util'

@Injectable()
export class ConfirmationService {

  constructor(public http: Http) {
  }

  confirmSMS(smsCode: number) { 
    let token = localStorage.getItem('token');
    let confirmSMSUrl: string = `${SERVER_URL}/api/phone/confirmations/`;
    var headers = new Headers({ 'Content-Type': 'application/json', 
                                'Accept': 'application/json',
                                'Authorization': `Token ${token}`
                            });
    var body = JSON.stringify({
      code: smsCode
    });
    var options = new RequestOptions({ headers: headers });
    return this.http.post(confirmSMSUrl, body, options)
                    .map(response => response.status)
                    .catch(this.handleError)
  }

  resendSMSCode() {
    let token = localStorage.getItem('token');
    let resendSMSUrl: string = `${SERVER_URL}/api/resend-sms-code/`;
    var headers = new Headers({ 'Content-Type': 'application/json', 
                                'Accept': 'application/json',
                                'Authorization': `Token ${token}`
                            });
    var options = new RequestOptions({ headers: headers });
    return this.http.get(resendSMSUrl, options)
                    .map(response => response.status)
                    .catch(this.handleError)
  }

  private handleError(error: any): Observable<any> {
    console.error('An error occurred', error);
    return Observable.throw(error.message || error);
  }

}
