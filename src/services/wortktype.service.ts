
import { Injectable }    from '@angular/core';

import  { WorkType } from '../models/worktype';


const WORK_TYPES: WorkType[] = [
    {id: 1, name: 'Carpintería', description: 'Profesionales 50,000 COP/hora', icon: 'images/carpinteria.png'},
    {id: 2, name: 'Plomeria ', description: 'Profesionales 24,000 COP/hora', icon: 'images/plomeria.png'},
    {id: 3, name: 'Cerrajeria', description: 'Profesionales 42,000 COP/hora', icon: 'images/cerrajeria.jpg'},
    {id: 4, name: 'Electricista', description: 'Profesionales 33,000 COP/hora', icon: 'images/electricista.jpg'},
]

@Injectable()
export class WorkTypeService {
    constructor(){

    }


    getWorkTypes(): Promise<WorkType[]> {
        return Promise.resolve(WORK_TYPES)
    }
}
