import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';

import { WherePage } from '../where/where'
import { Work } from '../../models/work'
import { Address } from '../../models/address';
import { AddressService } from '../../providers/address-service';

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
              private datePicker: DatePicker,
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
    console.log('voy a llamar service');

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

  nextStepNow() {
    this.work.date = new Date();
    this.work.needItNow = true;
    console.log(this.work);
    this.navController.push(WherePage, {
        work: this.work
    });
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
          this.navController.push(WherePage, {
            work: this.work
          })
      },
      error => {
          console.log('Error: ' + error);
      });
  }
}
