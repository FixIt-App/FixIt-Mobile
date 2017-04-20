import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Work } from '../../models/work';
import { WorkType } from '../../models/worktype';

@IonicPage()
@Component({
  selector: 'page-work-details',
  templateUrl: 'work-details.html',
})
export class WorkDetailsPage {

  work: Work;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams) 
  {
    // this.work = navParams.get('work');
    this.work = new Work({
      images: [],
      state:"ORDERED",
      time: new Date("2017-05-01T02:41:00Z"),
      worker: null,
      worktype: new WorkType({
        description:"Desde 33,000/hora",
        icon : "https://test-fixit.s3.amazonaws.com/media/electricista.jpg",
        id:4,
        name:"Cambiar bombillo",
        price:"200000.00",
        price_type:"STANDARIZED"
      }),
    });
  }


  ionViewDidLoad() {
    
  }

}
