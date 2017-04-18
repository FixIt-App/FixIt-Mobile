import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, ToastController } from 'ionic-angular';
import { DatePicker } from 'ionic-native';

import { Work } from '../../models/work'
import { Address } from '../../models/address';

import { AddressService } from '../../providers/address-service';
import { WorkService } from '../../providers/work-service';

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
                private toastCtrl: ToastController,
                private addressService: AddressService,
                private modalCtrl: ModalController,
                private workService: WorkService)
    {
      this.work = this.navParams.get('work');
      console.log('estoy en where');
      console.log(this.work);
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

    sendWork() {
      this.work.address = this.selectedAddress;

      this.workService.createWork(this.work).subscribe(
        (data) => {
          console.log(data);
          this.navController.push('ConfirmationPage', {
            work: this.work
          });
        },
        (error) => {
          console.log(error);
          let toast = this.toastCtrl.create({
            message: 'Error, por favor intenta más tarde',
            duration: 3000,
            showCloseButton: true,
            closeButtonText: 'Cerrar'
          });
          toast.present();
        }
      )
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
