import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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

    constructor(private navController: NavController,
                private navParams: NavParams,
                private formBuilder: FormBuilder)
    {
      this.workType = navParams.get('work')
      this.work = new Work();

      this.form = this.formBuilder.group({
        date: ['', Validators.required]
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
}
