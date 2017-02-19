import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { WorkType } from '../../models/worktype'

@Component({
  selector: 'schedule',
  templateUrl: 'schedule.html'
})
export class SchedulePage {

    workType: WorkType

    constructor(
      private navController: NavController,
      private navParams: NavParams){
      this.workType = navParams.get('work')
    }

    nextStep() {
      
    }
}
