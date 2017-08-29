import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Work } from './../../models/work';

@IonicPage()
@Component({
  selector: 'page-rate-work',
  templateUrl: 'rate-work.html',
})
export class RateWorkPage {

  stars: number = 0;
  starsText: string;
  work: Work;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams) 
  {
    this.work = navParams.get('work');
  }

  ionViewDidLoad() {
  }

  starsChange(stars) {
    this.stars = stars;
    console.log('stars changed' + this.stars);
    if (this.stars == 1) this.starsText = "Muy Malo";
    else if (this.stars == 2) this.starsText = "Malo";
    else if (this.stars == 3) this.starsText = "Bueno";
    else if (this.stars == 4) this.starsText = "Muy Bueno";
    else if (this.stars == 5) this.starsText = "¡Excelente!";
  }

  sendRating() {

  }
}
