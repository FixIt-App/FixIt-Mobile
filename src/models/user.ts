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
}

export class Customer extends User {
    idCustomer: number;

    constructor(data: any) {
        super(data);
        this.idCustomer = data.id;
    }
}

export class Worker extends User {
    idWorker: number;

    constructor(data: any) {
        super(data);
        this.idWorker = data.id;
    }
}
