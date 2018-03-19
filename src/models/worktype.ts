export class WorkType {
    id: number;
    name: string;
    description: string;
    icon: string;
    price_type: string;
    price: number; 

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name
        this.description = data.description;
        this.icon = data.icon;
        this.price_type = data.price_type;
        this.price = data.price;
    }
}
