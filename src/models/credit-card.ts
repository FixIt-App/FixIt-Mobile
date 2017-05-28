export class CreditCard {
	number: string;
    securityNumber: string;
    expirationYear: string;
	expirationMonth: string;

    export(): any {
        var obj: any = {};
        obj.number = this.number;
        obj.securityNumber = this.securityNumber;
        obj.expirationYear = this.expirationYear;
        obj.expirationMonth = this.expirationMonth;
        return obj
    }
}
