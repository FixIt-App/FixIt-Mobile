import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DatePicker } from 'ionic-native';

import { Work } from '../../models/work'
import { WherePage } from '../where/where'

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html'
})
export class SchedulePage {

  work: Work;
  minDate: string;
  maxDate: string;
  today: Date;

  constructor(private navController: NavController,
              private navParams: NavParams)
  {
    this.work = navParams.get('work')
    this.today = new Date();
    this.minDate = `${this.today.getFullYear()}-${this.today.getMonth()}-${this.today.getDate()}`
    // this.maxDate = `${today.getFullYear()+1}-${today.getMonth()}-${today.getDate()}`
    // this.minDate = `${this.today.getFullYear()}`;
    this.maxDate = `${this.today.getFullYear()+1}`;

    console.log(this.minDate + ' ' + this.maxDate);
  }

  ionViewDidLoad() {
  }

  nextStepNow() {
    this.work.date = new Date();
    console.log(this.work);
    this.navController.push(WherePage, {
        work: this.work
    });
  }

  makeDate() {
    let options = {
      date: new Date(),
      mode: 'datetime',
      androidTheme: DatePicker.ANDROID_THEMES.THEME_HOLO_LIGHT,
      minDate: new Date()
    }

    DatePicker.show(options).then(
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
