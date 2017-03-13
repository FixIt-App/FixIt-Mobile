
import { Injectable }    from '@angular/core';

import { Headers, Http, RequestOptions } from '@angular/http'

import { WorkType } from '../models/worktype';
import { SERVER_URL } from './services.util'

import 'rxjs/Rx'
import { Observable } from "rxjs/Observable";

const WORK_TYPES: WorkType[] = [
    {id: 1, name: 'Carpintería', description: 'Profesionales 50,000 COP/hora', icon: 'images/carpinteria.png'},
    {id: 2, name: 'Plomería ', description: 'Profesionales 24,000 COP/hora', icon: 'images/plomeria.png'},
    {id: 3, name: 'Cerrajería', description: 'Profesionales 42,000 COP/hora', icon: 'images/cerrajeria.jpg'},
    {id: 4, name: 'Electricista', description: 'Profesionales 33,000 COP/hora', icon: 'images/electricista.jpg'},
]

@Injectable()
export class WorkTypeService {

    constructor(private http: Http){    }

    getWorkTypes(): Observable<WorkType[]> {
        var token = localStorage.getItem('token')
        let worktTypesUrl: string = `${SERVER_URL}/api/worktypes/`;
        var headers = new Headers({ 
            'Content-Type': 'application/json', 
            'Accept': 'application/json',
            'Authorization': `Token ${token}`
        });
        var options = new RequestOptions({ headers: headers });
        return this.http.get(worktTypesUrl, options)
                        .map(response => response.json() as WorkType[])
                        .catch(this.handleError)
    }

    private handleError(error: any): Observable<any> {
        console.error('An error occurred', error);
        return Observable.throw(error.message || error);
    }
}
