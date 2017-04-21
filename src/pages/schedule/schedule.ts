import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';

import { Work } from '../../models/work';
import { Address } from '../../models/address';
import { AddressService } from '../../providers/address-service';
import { WorkService } from '../../providers/work-service';

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html'
})
export class SchedulePage {

  work: Work;
  minDate: string;
  maxDate: string;
  today: Date;
  addresses: Address[];
  selectedAddress: Address;

  constructor(private navController: NavController,
              private navParams: NavParams,
              private toastCtrl: ToastController,
              private datePicker: DatePicker,
              private modalCtrl: ModalController,
              private workService: WorkService,
              private addressService: AddressService)
  {
    this.work = navParams.get('work');
    console.log(this.work);
    this.today = new Date();
    this.minDate = `${this.today.getFullYear()}-${this.today.getMonth()}-${this.today.getDate()}`
    // this.maxDate = `${today.getFullYear()+1}-${today.getMonth()}-${today.getDate()}`
    // this.minDate = `${this.today.getFullYear()}`;
    this.maxDate = `${this.today.getFullYear()+1}`;

    console.log(this.minDate + ' ' + this.maxDate);
  }

  ionViewDidLoad() {
    this.addressService.getCustomerAddresses().subscribe(
      data => {
        console.log('acabe');
        console.log(data);
        this.addresses = data;
        if(this.addresses && this.addresses.length > 0) {
          this.selectedAddress = this.addresses[0];
          this.work.address = this.selectedAddress;
        } else {
          // need new address
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  needItNow() {
    this.work.date = new Date();
    this.work.needItNow = true;
    console.log(this.work);
    // this.navController.push(WherePage, {
    //     work: this.work
    // });
  }

  editDate() {
    if(this.work.needItNow) {
      this.work.needItNow = false;
      this.work.date = undefined;
    } else {
      this.makeDate();
    }
  }

  makeDate() {
    let options = {
      date: new Date(),
      mode: 'datetime',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT,
      minDate: new Date()
    }

    this.datePicker.show(options).then(
      date => {
          this.work.date = date;
      },
      error => {
          console.log('Error: ' + error);
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

  sendWork() {
      this.work.address = this.selectedAddress;

      this.workService.createWork(this.work).subscribe(
        (work) => {
          //TODO (a-santamaria): el need it now deberia guardarse en el servidor
          let needItNow = this.work.needItNow;
          this.work = work;
          this.work.needItNow = needItNow;
          
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
}
