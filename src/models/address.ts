export class Address {
    id: number;
    name: string;
    address: string;
    city: string;
    country: string;

    constructor(data: any) {
      this.id = data.id;
      this.name = data.name;
      this.address = data.address;
      this.city = data.city;
      this.country = data.country;
    }
}