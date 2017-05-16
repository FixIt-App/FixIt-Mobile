import { FindWorkPage } from './../findwork/findwork';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';

import { Work } from '../../models/work'
import { WorkService } from '../../providers/work-service';

@IonicPage()
@Component({
  selector: 'page-service-historical',
  templateUrl: 'service-historical.html'
})
export class ServiceHistoricalPage {

  works: Work[];
  today: Date;
  tomorrow: Date;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private workService: WorkService)
  {
    this.today = new Date();
    this.tomorrow = new Date(this.today.getFullYear(), this.today.getMonth(), 
                              this.today.getDate() + 1);
  }

  ionViewDidLoad() {
    this.workService.getMyWorks(['FINISHED']).subscribe(
      (works) => {
        this.works = works;
        console.log(this.works);
        this.works.reverse();
      },
      (error) => {

      }
    )
  }

  isToday(date: Date) {
    if (this.today.getFullYear() == date.getFullYear() && 
        this.today.getMonth() == date.getMonth() && 
        this.today.getDate() == date.getDate()) 
    {
        return true;
    }
    return false;
  }

  isTomorrow(date: Date) {
    if (this.tomorrow.getFullYear() == date.getFullYear() && 
        this.tomorrow.getMonth() == date.getMonth() && 
        this.tomorrow.getDate() == date.getDate()) 
    {
      return true;
    }
    return false;
  }

  goToFindWorks() {
    this.navCtrl.setRoot(FindWorkPage);
  }

}
