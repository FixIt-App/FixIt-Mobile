import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { SERVER_URL } from './services.util'

import { Work } from '../models/work';

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
                      .map(response => response.json() )
                      .catch(this.handleError)
  }

  createWork(work: Work): Observable<any> {
     let createWorkUrl: string = `${SERVER_URL}/api/work/`;
      var headers = new Headers({ 'Content-Type': 'application/json', 
                                  'Accept': 'application/json',
                                  'Authorization': `Token ${this.token}`
                              });
      var body = JSON.stringify(work.export());
      console.log(body);
      var options = new RequestOptions({ headers: headers });
      return this.http.post(createWorkUrl, body, options)
                      .map(response => new Work(response.json()))
                      .catch(this.handleError)
  }

  addDetailsWork(work: Work): Observable<any> {
     let createWorkUrl: string = `${SERVER_URL}/api/work/${work.id}/`;
     console.log(createWorkUrl);
      var headers = new Headers({ 'Content-Type': 'application/json', 
                                  'Accept': 'application/json',
                                  'Authorization': `Token ${this.token}`
                              });
      var body = JSON.stringify(work.export());
      console.log(body);
      var options = new RequestOptions({ headers: headers });
      return this.http.put(createWorkUrl, body, options)
                      .map(response => new Work(response.json()))
                      .catch(this.handleError)
  }

  getMyWorks(states: string[] = []): Observable<Work[]> {
    let myWorksUrl: string = `${SERVER_URL}/api/myworks/`;
    if(states.length > 0) {
      myWorksUrl += '?state=';
      let first = true;
      for(let state of states) {
        if(!first) myWorksUrl += ',';
        first = false;
        myWorksUrl += state;
      }
    }
    console.log(myWorksUrl);
    var headers = new Headers({ 'Content-Type': 'application/json', 
                                'Accept': 'application/json',
                                'Authorization': `Token ${this.token}`
                            });
    var options = new RequestOptions({ headers: headers });
    return this.http.get(myWorksUrl, options)
                    .map(response => this.extractWorks(response.json()))
                    .catch(this.handleError)
  }

  private extractWorks(rawWorks: any): Observable<Work[]> {
    return rawWorks.map(rawWork => {
      console.log(rawWork);
      return new Work(rawWork);
    }) 
  }

  private handleError(error: any): Observable<any> {
        console.error('An error occurred', error);
        return Observable.throw(error.message || error);
    }

}
