import { WorkType } from './worktype';
import { Address } from './address';

export class Work {
    id: number;
    workType: WorkType;
    date: Date;
    description : string;
    address: Address;
    images: number[];

    constructor(data: any) {
        this.id = data.id;
        this.workType = data.worktype;
        this.date = new Date(data.time);
        this.description = data.description;
        this.address = data.address;
        this.images = data.address;
    }

    export(): any {
        var obj: any = {};
        obj.worktypeid = this.workType.id;
        obj.date = this.date;
        obj.description = this.description;
        obj.addressid = this.address.id;
        obj.images = this.images;
        return obj
    }
}
