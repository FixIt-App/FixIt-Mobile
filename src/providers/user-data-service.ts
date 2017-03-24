import { Injectable } from '@angular/core';
import { Customer } from '../models/user';

@Injectable()
export class UserDataService {
  customer: Customer;

  constructor() {
  }

  getCustomer(): Customer {
    return this.customer;
  }

  setCustomer(customer: Customer): void {
    this.customer = customer;
  }

}
