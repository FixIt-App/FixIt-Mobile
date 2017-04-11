import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { DatePicker } from 'ionic-native';

import { Work } from '../../models/work'
import { AddressService } from '../../providers/address-service';
import { Address } from '../../models/address';

@Component({
  selector: 'page-where',
  templateUrl: 'where.html'
})
export class WherePage {

    addresses: Address[];
    selectedAddress: Address;
    work: Work;
    
    constructor(private navController: NavController,
                private navParams: NavParams,
                private loadingCtrl: LoadingController,
                private addressService: AddressService,
                private modalCtrl: ModalController)
    {
      this.work = this.navParams.get('work');
      this.addresses = [];
    }

    ionViewDidLoad() {
      console.log('voy a llamar service');

      let loader = this.loadingCtrl.create({content: "Please wait..."});
      loader.present();
      this.addressService.getCustomerAddresses().subscribe(
        data => {
          console.log('acabe');
          console.log(data);
          this.addresses = data;
          if(this.addresses && this.addresses.length > 0) {
            this.selectedAddress = this.addresses[0];
            this.work.address = this.selectedAddress;
          } else {
            this.newAddress();
          }
          loader.dismiss();
        },
        error => {
          console.log(error);
          loader.dismiss();
        }
      )
    }

    nextStep() {
      this.work.address = this.selectedAddress;
      // lazzy loading work description page
      this.navController.push('WorkDescriptionPage', {
        work: this.work
      });
    }

    newAddress() {
      // lazzy loading new address page
       let modal = this.modalCtrl.create('NewAddressPage');
       modal.onDidDismiss(
         (newAddress) => {
           if(newAddress) {
             this.addresses.push(newAddress);
             this.selectedAddress = this.addresses[this.addresses.length-1];
           }
         }
       );
       modal.present();
    }

    editDate() {
      let options = {
          date: this.work.date,
          mode: 'datetime',
          androidTheme: DatePicker.ANDROID_THEMES.THEME_HOLO_LIGHT,
          minDate: new Date()
        }

        DatePicker.show(options).then(
          date => {
            this.work.date = date;
          },
          error => {
            console.log('Error: ' + error);
          }
        );
    }
}
