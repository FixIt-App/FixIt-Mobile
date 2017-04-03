import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { SERVER_URL } from './services.util'

import {File, Transfer} from 'ionic-native';


@Injectable()
export class WorkService {
  token: string;
  

  constructor(public http: Http) {
    this.token = localStorage.getItem('token');
  }

  sendImage(base64Img: string): Observable<any> {
      let uploadImageUrl: string = `${SERVER_URL}/api/work/upload-image/`;
      var headers = new Headers({ 'Content-Type': 'application/json', 
                                  'Accept': 'application/json',
                                  'Authorization': `Token ${this.token}`
                              });
      var body = JSON.stringify({
        image: `data:image/png;base64,${base64Img}`
      });
      var options = new RequestOptions({ headers: headers });
      return this.http.post(uploadImageUrl, body, options)
                      .map(response => response.json())
                      .catch(this.handleError)
  }

  private handleError(error: any): Observable<any> {
        console.error('An error occurred', error);
        return Observable.throw(error.message || error);
    }

}
