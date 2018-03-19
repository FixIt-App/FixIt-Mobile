export class Confirmation {
    confirmation_type: string;
    state: boolean;

    constructor(data: any) {
        this.confirmation_type = data.confirmation_type;
        this.state = data.state;
    }
}