import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import { Work } from './../../models/work';
import { WorkService } from './../../providers/work-service';
import { WorkTypeService } from './../../providers/wortktype-service';
import { FindWorkPage } from './../findwork/findwork';

@IonicPage()
@Component({
  selector: 'page-rate-work',
  templateUrl: 'rate-work.html',
})
export class RateWorkPage {

  stars: number;
  starsText: string;
  work: Work;
  comment: string;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private ngZone: NgZone,
              private workTypeService: WorkTypeService,
              private workService: WorkService) 
  {
    this.work = navParams.get('work');
    this.stars = 0;
  }

  ionViewDidLoad() {
  }

  starsChange(stars) {
    this.stars = stars;
    // using ngZone because view doesn't display first change
    this.ngZone.run(() => this.stars = stars);
    console.log('stars changed' + this.stars);
    if (this.stars == 1)      this.ngZone.run(() => this.starsText = "Muy Malo");
    else if (this.stars == 2) this.ngZone.run(() => this.starsText = "Malo");
    else if (this.stars == 3) this.ngZone.run(() => this.starsText = "Bueno");
    else if (this.stars == 4) this.ngZone.run(() => this.starsText = "Muy Bueno");
    else if (this.stars == 5) this.ngZone.run(() => this.starsText = "¡Excelente!");
  }

  sendRating() {
    let loader = this.loadingCtrl.create({spinner: 'crescent'});
    loader.present();
    this.workService.sendWorkRating(this.work.id, this.stars, this.comment).subscribe(
      (status) => {
        let toast = this.toastCtrl.create({
          message: "¡Gracias por enviar la calificación!",
          duration: 5000,
          closeButtonText: "Cerrar",
          showCloseButton: true
        })
        toast.present();
        this.workTypeService.getWorkTypes().subscribe(
          categories => {
            this.navCtrl.setRoot(FindWorkPage, { categories: categories.reverse() });
            loader.dismiss();
          },
          error => {
            console.log(error);
            loader.dismiss();
          });
      },
      (error) => {
        let toast = this.toastCtrl.create({
          message: "Error, por favor intenta más tarde",
          duration: 5000,
          closeButtonText: "Cerrar"
        })
        toast.present();
        loader.dismiss();
      }
    )
  }
}
