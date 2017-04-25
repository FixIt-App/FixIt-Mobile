import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/Rx'
import { Observable } from "rxjs/Observable";
import { SERVER_URL } from './services.util'

@Injectable()
export class DeviceService {

  constructor(public http: Http) {
  }

  registerDevice() {
    let token = localStorage.getItem('token');
    let deviceToken = localStorage.getItem('deviceToke');
    if(!deviceToken)
      return Observable.create(() => false);
    let platform = localStorage.getItem('platform');
    let getAddressesUrl: string = `${SERVER_URL}/api/devicetoken/`;
    var headers = new Headers({ 'Content-Type': 'application/json', 
                                'Accept': 'application/json',
                                'Authorization': `Token ${token}`
                            });
    var body = JSON.stringify({
      token: deviceToken,
      platform_type: platform,
      token_type: "CUSTOMER"
    });
    console.log(body);
    var options = new RequestOptions({ headers: headers });
    return this.http.post(getAddressesUrl, body, options)
                    .map(response => response)
                    .catch(this.handleError)
  }

  removeDeviceToken() {
    let token = localStorage.getItem('token');
    let deviceToken = localStorage.getItem('deviceToke');
    let platform = localStorage.getItem('platform');
    let getAddressesUrl: string = `${SERVER_URL}/api/devicetoken/remove/`;
    var headers = new Headers({ 'Content-Type': 'application/json', 
                                'Accept': 'application/json',
                                'Authorization': `Token ${token}`
                            });
    var body = JSON.stringify({
      token: deviceToken,
      platform_type: platform,
      token_type: "CUSTOMER"
    });
    console.log(body);
    var options = new RequestOptions({ headers: headers, body: body });
    return this.http.delete(getAddressesUrl, options)
                    .map(response => response)
                    .catch(this.handleError)
  }

  private handleError(error: any): Observable<any> {
    console.error('An error occurred', error);
    return Observable.throw(error.message || error);
  }

}
