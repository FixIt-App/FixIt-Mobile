import { Category } from './../../models/category';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, Content, Platform, NavParams } from 'ionic-angular';
import { WorkTypeService } from '../../providers/wortktype-service'
import { SchedulePage } from '../schedule/schedule'
import { UserDataService } from '../../providers/user-data-service';

import { WorkType } from '../../models/worktype'
import { Customer } from '../../models/user';
import { Work } from '../../models/work';

@Component({
  selector: 'page-find-work',
  templateUrl: 'findwork.html'
})
export class FindWorkPage implements OnInit {
  categories: Category[];
  customer: Customer;
  work: Work;

  // for autohide header
  @ViewChild(Content) content: Content;
  start = 0;
  threshold = 50;
  slideHeaderPrevious = 0;
  ionScroll:any;
  showheader:boolean;
  hideheader:boolean;
  headercontent:any;


  constructor(private navController: NavController,
              private workTypeService: WorkTypeService,
              public userDataService: UserDataService,
              public navParams: NavParams,
              private platform: Platform,
              public myElement: ElementRef)
  {
    this.showheader = false;
    this.hideheader = true;
    this.categories = this.navParams.get('categories');
  }

  ngOnInit() {
    this.listenToScroll();
    this.customer = this.userDataService.getCustomer();    
  }

  goToNextStep(selectedWork: WorkType) {
    this.work = new Work({});
    this.work.workType = selectedWork;
    console.log(this.work);
    if(this.work.workType.price_type != 'UNKNOWN') {
      this.navController.push(SchedulePage, {
        work: this.work
      });
    } else {
      this.navController.push('WorkDescriptionPage', {
        work: this.work
      });
    }
  }

  // TODO (a-santamria): merge this not to repeat it every time
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

  sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}
