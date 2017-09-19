export class CreditCard {
    id: number;
    number: string;
    lastFour: string;
    cvv: string;
    expirationYear: string;
    expirationMonth: string;
    cardHolderName: string;
    creditCardId: string;
    type: string;

    constructor(data: any) {
        console.log('adentro ');
        console.log(data);
        this.id = data.id;
        this.lastFour = data.last_four;
        this.expirationYear = data.expirationYear;
        this.expirationMonth = data.expirationYear;
        this.cardHolderName = data.card_holder_name;
        this.creditCardId = data.credit_card_id;
        this.type = data.type;
    }   

    exportTPaga(): any {
        var obj: any = {};
        obj.primaryAccountNumber = this.number;
        obj.cvv = this.cvv;
        obj.expirationYear = this.expirationYear;
        obj.expirationMonth = this.expirationMonth;
        obj.cardHolderName = this.number;
        return obj;
    }
    
}
