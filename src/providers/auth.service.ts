import { Injectable } from '@angular/core'
import { Http, Headers, RequestOptions } from '@angular/http'

import { SERVER_URL } from './services.util'
import 'rxjs/Rx'
import { Observable } from "rxjs/Observable";

@Injectable()
export class AuthService {
    
    constructor(private http: Http){    }

    login(username: string, password: string): Observable<any>{
        let loginUrl: string = SERVER_URL + "/api/token-auth/";
        var headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json' })
        var options = new RequestOptions({ headers: headers });
        return this.http.post(loginUrl,{
            username: username,
            password: password
        }, options)
        .map(response => response.json())
        .catch(this.handleError)
        
    }

    private handleError(error: any): Observable<any> {
        console.error('An error occurred', error);
        return Observable.throw(error.message || error);
    }

}
