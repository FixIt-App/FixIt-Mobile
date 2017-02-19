import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WorkTypeService } from '../../services/wortktype.service'
import { WorkType } from '../../models/worktype'
import { SchedulePage } from '../schedule/schedule'

@Component({
  selector: 'find-work',
  templateUrl: 'findwork.html'
})
export class FindWorkPage implements OnInit {

    works: WorkType[] = null;

    constructor(
      private navController: NavController,
      private workTypeService: WorkTypeService){
      
    }

    ngOnInit(){
      this.workTypeService.getWorkTypes()
          .then(works => this.works = works)
          .catch(err => {
            console.log("Error al cargar los datos, intentando de nuevo")
          })
    }

    goToNextStep(work: WorkType){
      this.navController.push(SchedulePage, {
        work: work
      })
    }
    
}
