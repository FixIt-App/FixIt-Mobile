import { Injectable } from '@angular/core'
import { Http, Headers, RequestOptions } from '@angular/http'

import { SERVER_URL } from './services.util'
import 'rxjs/Rx'

@Injectable()
export class AuthService {
    loginUrl: string = SERVER_URL + "/api-token-auth/"
    

    constructor(private http: Http){    }

    login(username: string, password: string): Promise<any>{
        var headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json' })
        var options = new RequestOptions({ headers: headers });
        return this.http.post(this.loginUrl,{
            username: username,
            password: password
        }, options).toPromise()
        .then(response =>  {
            console.log(response.json())
            return response.json()
        }).catch(this.handleError)
        
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

}
