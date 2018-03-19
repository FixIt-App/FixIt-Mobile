import { WorkType } from './worktype';
import { Address } from './address';
import { Worker } from './worker';

export class Work {
    id: number;
    workType: WorkType;
    date: Date;
    description : string;
    address: Address;
    images: number[];
    imagesUrl: string[];
    asap: boolean;
    worker: Worker;
    state: string;

    constructor(data: any) {
        this.id = data.id;
        this.workType = data.worktype;
        this.state = data.state;
        if(data.time)
            this.date = new Date(data.time);
        this.description = data.description;
        this.address = data.address;
        this.images = data.address;
        this.asap = false;
        if(data.address)
            this.address = new Address(data.address);
        if(data.worktype)
            this.workType = new WorkType(data.worktype);
        if(data.images) {
            this.images = data.images.map(image => image.id);
            this.imagesUrl = data.images.map(image => image.image);
        }
        if(data.worker)
            this.worker = new Worker(data.worker);
    }

    export(): any {
        var obj: any = {};
        obj.worktypeid = this.workType.id;
        obj.date = this.date;
        obj.description = this.description;
        obj.addressid = this.address.id;
        if(this.images)
            obj.images = this.images;
        else
            obj.images = [];
        obj.asap = this.asap;
        return obj
    }
}
