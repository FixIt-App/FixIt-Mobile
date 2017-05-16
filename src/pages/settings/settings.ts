import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { Customer } from '../../models/user';
import { Address } from '../../models/address';
import { UserDataService } from '../../providers/user-data-service';
import { AddressService } from '../../providers/address-service';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  customer: Customer;
  addresses: Address[];
  constructor(public navCtrl: NavController, 
              private userDataService: UserDataService,
              public navParams: NavParams,
              private modalCtrl: ModalController,
              private addressService: AddressService) 
  {
    this.customer = this.userDataService.getCustomer();
    console.log(this.customer)
  }

  ionViewDidLoad() {
    this.addressService.getCustomerAddresses().subscribe(
      addresses => {
        this.addresses = addresses;
      },
      error => {
        console.log(error);
      }
    )
  }

  editUser() {
    this.navCtrl.push('SettingsUserPage');
  }

  editPaymentMethod() {
    //TODO (a-santamaria): edit payment method

  }

  addPaymentMethod() {
    this.navCtrl.push('PaymentMethodPage');
  } 

  deletePaymentMethod() {
    // TODO(a-santamaria): delete payment method
    console.log('todo delete payment method');
  }

  newAddress() {
    // lazzy loading new address page
      let modal = this.modalCtrl.create('NewAddressPage');
      modal.onDidDismiss(
        (newAddress) => {
          if(newAddress) {
            this.addresses.push(newAddress);
          }
        }
      );
      modal.present();
  }

  deleteAddress() {
    // TODO(a-santamaria): delete address
    console.log('todo delte address');
  }

}
