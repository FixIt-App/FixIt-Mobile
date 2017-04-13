import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
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
          this.categories = categories;
          this.slides.changes
          // this.sleep(700).then(() => {
            this.initializeSlides();
          // });
          
      },
      error => {
          console.log(error);
      });
  }

  initializeSlides() {
    // console.log(this.slides.length);
    this.slides.changes.subscribe(
      (slides: QueryList<Slides>) => {
        // console.log(slide);
        slides.map(
          (slide) => {
            slide.slidesPerView = 3;
            slide.pager = true;
            slide.paginationType = 'progress';
            slide.freeMode = true;
          });
      }
    )

  }

  goToNextStep(selectedWork: WorkType){
    this.work.workType = selectedWork;
    this.navController.push(SchedulePage, {
      work: this.work
    });
  }

  nonStandardWork() {
    //TODO (a-santamaria): set real non standard work type
    this.work.workType = {
      id: 1,
      name: 'Trabajo no estándar',
      description: '',
      icon: '',
      price_type: '',
      price: -1
    }
    this.navController.push('WorkDescriptionPage', {
      work: this.work
    });
  }

  sleep (time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    }
    
}
