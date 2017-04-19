import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
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

  // @ViewChild(Slides) slides: Slides;
  @ViewChildren(Slides) slides: QueryList<Slides>;

  constructor(private navController: NavController,
              private workTypeService: WorkTypeService,
              public userDataService: UserDataService)
  {
    this.work = new Work({});
  }

  ngOnInit(){
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

}
