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
  dynamicPrice: any;

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
    this.work.asap = true;
    console.log(this.work);
    this.getDynamicPrice();
  }

  editDate() {
    this.dynamicPrice = undefined;
    if(this.work.asap) {
      this.work.asap = false;
      this.work.date = undefined;
    } else {
      this.makeDate();
    }
  }

  getDynamicPrice() {
    this.workService.dynamicPrice(this.work).subscribe(
      (data) => {
        console.log(data);
        this.dynamicPrice = data;
      },
      (error) => {
        console.log(error);
      }
    )
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
          this.getDynamicPrice();
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
          let asap = this.work.asap;
          this.work = work;
          this.work.asap = asap;
          
          this.navController.setRoot('WorkDetailsPage', {
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
