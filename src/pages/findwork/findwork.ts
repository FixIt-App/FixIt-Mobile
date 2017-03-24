import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WorkTypeService } from '../../providers/wortktype-service'
import { WorkType } from '../../models/worktype'
import { SchedulePage } from '../schedule/schedule'
import { UserDataService } from '../../providers/user-data-service';
import { Customer } from '../../models/user';
@Component({
  selector: 'find-work',
  templateUrl: 'findwork.html'
})
export class FindWorkPage implements OnInit {

    works: WorkType[] = null;
    customer: Customer;

    constructor(
      private navController: NavController,
      private workTypeService: WorkTypeService,
      public userDataService: UserDataService){
      
    }

    ngOnInit(){
      this.customer = this.userDataService.getCustomer();
      this.workTypeService.getWorkTypes()
        .subscribe( works => {
          this.works = works;
        },
        error => {
          console.log(error);
        })
    }

    goToNextStep(work: WorkType){
      this.navController.push(SchedulePage, {
        work: work
      })
    }
    
}
