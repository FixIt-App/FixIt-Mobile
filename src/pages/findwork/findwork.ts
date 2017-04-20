import { Component, OnInit, ViewChildren, QueryList, ViewChild, ElementRef } from '@angular/core';
import { NavController, Slides, Content } from 'ionic-angular';
import { WorkTypeService } from '../../providers/wortktype-service'
import { SchedulePage } from '../schedule/schedule'
import { UserDataService } from '../../providers/user-data-service';

import { Category } from '../../models/category'
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
  threshold = 100;
  slideHeaderPrevious = 0;
  ionScroll:any;
  showheader:boolean;
  hideheader:boolean;
  headercontent:any;

  @ViewChildren(Slides) slides: QueryList<Slides>;

  constructor(private navController: NavController,
              private workTypeService: WorkTypeService,
              public userDataService: UserDataService,
              public myElement: ElementRef)
  {
    this.work = new Work({});
    this.showheader = false;
    this.hideheader = true;
  }

  ngOnInit() {
    this.listenToScroll();
    this.customer = this.userDataService.getCustomer();
    this.workTypeService.getWorkTypes().subscribe(
      categories => {
          this.categories = categories.reverse();
          this.initializeSlides();
      },
      error => {
          console.log(error);
      });
  }

  initializeSlides() {
    // console.log(this.slides.length);
    this.slides.changes.subscribe(
      (slides: QueryList<Slides>) => {
        console.log(slides);
        slides.map(
          (slide) => {
            slide.slidesPerView = 3;
            slide.pager = true;
            slide.paginationType = 'bullets';
            // slide.freeMode = true;
          });
      }
    )

  }

  goToNextStep(selectedWork: WorkType){
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

}
