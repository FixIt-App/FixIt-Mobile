import { FindWorkPage } from './../findwork/findwork';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, IonicPage, Content } from 'ionic-angular';

import { Work } from '../../models/work'
import { WorkService } from '../../providers/work-service';
import { WorkTypeService } from '../../providers/wortktype-service'

@IonicPage()
@Component({
  selector: 'page-service-historical',
  templateUrl: 'service-historical.html'
})
export class ServiceHistoricalPage {

  currentWorks: Work[];
  finishedWorks: Work[];
  today: Date;
  tomorrow: Date;

   // for autohide header
  @ViewChild(Content) content: Content;
  start = 0;
  threshold = 50;
  slideHeaderPrevious = 0;
  ionScroll:any;
  showheader:boolean;
  hideheader:boolean;
  headercontent:any;

  constructor(public navCtrl: NavController, 
              private workTypeService: WorkTypeService,
              public navParams: NavParams,
              private workService: WorkService,
              private navController: NavController,
              public myElement: ElementRef)
  {
    this.showheader = false;
    this.hideheader = true;
    this.today = new Date();
    this.tomorrow = new Date(this.today.getFullYear(), this.today.getMonth(), 
                              this.today.getDate() + 1);
  }

  ionViewDidLoad() {
    this.listenToScroll();
    this.workService.getMyWorks(['ORDERED', 'SCHEDULED', 'IN_PROGRESS']).subscribe(
      (works) => {
        this.currentWorks = works;
        console.log(this.currentWorks);
      },
      (error) => {

      }
    );
    this.workService.getMyWorks(['FINISHED']).subscribe(
      (works) => {
        this.finishedWorks = works;
        console.log(this.finishedWorks);
        this.finishedWorks.reverse();
      },
      (error) => {

      }
    );
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

   listenToScroll() {
    this.ionScroll = this.myElement.nativeElement.getElementsByClassName('scroll-content')[0];
    console.log(this.ionScroll)
    // On scroll function
    this.ionScroll.addEventListener("scroll", 
      () => {
        console.log('entre a scrol');
        if(this.ionScroll.scrollTop - this.start > this.threshold) {
          this.showheader =true;
          this.hideheader = false;
        } else {
          this.showheader =false;
          this.hideheader = true;
        }
        if (this.slideHeaderPrevious >= this.ionScroll.scrollTop - this.start) {
          this.showheader =false;
          this.hideheader = true;
        }
        this.slideHeaderPrevious = this.ionScroll.scrollTop - this.start;
      });
  }

  goToFindWorks() {
    this.workTypeService.getWorkTypes().subscribe(
      categories => {
        this.navController.setRoot(FindWorkPage, { categories: categories.reverse() });
      },
      error => {
        console.log(error);
      });
  }

  goToDetails(work: Work) {
    this.navCtrl.push('WorkDetailsPage', {
      work: work
    });
  }
}
