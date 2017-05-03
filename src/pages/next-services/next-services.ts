import { FindWorkPage } from './../findwork/findwork';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, IonicPage, Content } from 'ionic-angular';

import { Work } from '../../models/work'
import { WorkService } from '../../providers/work-service';

@IonicPage()
@Component({
  selector: 'page-next-services',
  templateUrl: 'next-services.html'
})
export class NextServicesPage {

  works: Work[];
  today: Date;
  tomorrow: Date;
  
  // for autohide header
  @ViewChild(Content) content: Content;
  start = 0;
  threshold = 100;
  slideHeaderPrevious = 0;
  ionScroll:any;
  showheader:boolean;
  hideheader:boolean;
  headercontent:any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private workService: WorkService,
              public myElement: ElementRef)
  {
    this.today = new Date();
    this.tomorrow = new Date(this.today.getFullYear(), this.today.getMonth(), 
                              this.today.getDate() + 1);
    this.showheader = false;
    this.hideheader = true;
  }

  ionViewDidLoad() {
    this.listenToScroll();
    this.workService.getMyWorks(['ORDERED', 'SCHEDULED']).subscribe(
      (works) => {
        this.works = works;
        console.log(this.works);
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

  goToDetails(work: Work) {
    this.navCtrl.push('WorkDetailsPage', {
      work: work
    });
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
    this.navCtrl.setRoot(FindWorkPage);
  }

}
