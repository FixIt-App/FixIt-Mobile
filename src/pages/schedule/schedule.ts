import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { WorkType } from '../../models/worktype'
import { Work } from '../../models/work'
import { WherePage } from '../where/where'

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html'
})
export class SchedulePage {

    workType: WorkType
    work: Work
    form: FormGroup;
    minDate: string;
    maxDate: string;
    today: Date;

    constructor(private navController: NavController,
                private navParams: NavParams,
                private formBuilder: FormBuilder)
    {
      this.workType = navParams.get('work')
      this.work = new Work();
      this.today = new Date();
      // this.minDate = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
      // this.maxDate = `${today.getFullYear()+1}-${today.getMonth()}-${today.getDate()}`
      this.minDate = `${this.today.getFullYear()}`;
      this.maxDate = `${this.today.getFullYear()+1}`;

      console.log(this.minDate + ' ' + this.maxDate);

      this.form = this.formBuilder.group({
        date: ['', Validators.compose([Validators.required, this.isDateValid])]
      });
    }

    nextStepNow() {
      this.work.date = new Date()
      this.navController.push(WherePage, {
        work: this.work,
        workType: this.workType
      })
    }

    nextStep() {
      if(!this.form.valid) {
        return;
      }
      console.log(this.work.date);
      this.navController.push(WherePage, {
        work: this.work,
        workType: this.workType
      })
    }

    isDateValid(date: FormControl): any {
        console.log(date.value);
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if((new Date(date.value)) < yesterday) return { "la fecha no puede ser menor a ": 'hoy' };
        return null;
    }
}
