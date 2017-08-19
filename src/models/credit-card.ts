export class CreditCard {
	number: string;
    cvc: string;
    expirationYear: string;
    expirationMonth: string;
    cardHolderName: string;

    exportTPaga(): any {
        var obj: any = {};
        obj.primaryAccountNumber = this.number;
        obj.cvc = this.cvc;
        obj.expirationYear = this.expirationYear;
        obj.expirationMonth = this.expirationMonth;
        obj.cardHolderName = this.number;
        return obj;
    }
}
