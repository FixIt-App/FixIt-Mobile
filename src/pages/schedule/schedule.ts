import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { WorkType } from '../../models/worktype'
import { Work } from '../../models/work'
import { WherePage } from '../where/where'

@Component({
  selector: 'schedule',
  templateUrl: 'schedule.html'
})
export class SchedulePage {

    workType: WorkType
    work: Work

    constructor(
      private navController: NavController,
      private navParams: NavParams){
      this.workType = navParams.get('work')
      this.work = new Work()
    }

    nextStepNow() {
      this.work.date = new Date()
      this.navController.push(WherePage, {
        work: this.work,
        workType: this.workType
      })
    }

    nextStep() {
      this.navController.push(WherePage)
    }
}
