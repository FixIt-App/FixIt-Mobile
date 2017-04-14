import { Confirmation } from './confirmation';

export class User {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;

    constructor(data: any) {
        this.username = data.username;
        this.firstName = data.first_name;
        this.lastName = data.last_name;
        this.email = data.email;
        this.phone = data.phone;
    }

    export(): any {
        var obj: any = {};
        obj.username = this.username
        obj.first_name = this.firstName
        obj.last_name = this.lastName
        obj.password = this.password
        obj.email = this.email
        obj.phone = this.phone
        return obj
    }
}

export class Customer extends User {
    idCustomer: number;
    city: string;
    confirmations: Confirmation[];

    constructor(data: any) {
        super(data);
        this.idCustomer = data.id;
        this.city = data.city;
        this.confirmations = [];
        for(let rawConf of data.confirmations) {
            this.confirmations.push(new Confirmation(rawConf));
        }
    }

    export(): any {
        var obj = super.export()
        obj.city = this.city
        return obj
    }
}

export class Worker extends User {
    idWorker: number;

    constructor(data: any) {
        super(data);
        this.idWorker = data.id;
    }
}
