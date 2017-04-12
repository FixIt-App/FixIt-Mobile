import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
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

  works: WorkType[] = null;
  customer: Customer;
  work: Work;
  @ViewChild(Slides) slides: Slides;

  constructor(private navController: NavController,
              private workTypeService: WorkTypeService,
              public userDataService: UserDataService)
  {
    this.work = new Work({});
  }

  ngOnInit(){
    this.slides.slidesPerView = 3;
    this.slides.pager = true;
    this.slides.paginationType = 'progress';
    this.slides.freeMode = true;

    // this.slides.loop = true
    this.customer = this.userDataService.getCustomer();
    this.workTypeService.getWorkTypes().subscribe(
      works => {
          this.works = works;
      },
      error => {
          console.log(error);
      });
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
      icon: ''
    }
    this.navController.push('WorkDescriptionPage', {
      work: this.work
    });
  }
    
}
