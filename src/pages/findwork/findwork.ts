import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { WorkTypeService } from '../../services/wortktype.service'
import { WorkType } from '../../models/worktype'

@Component({
  selector: 'find-work',
  templateUrl: 'findwork.html'
})
export class FindWorkPage implements OnInit {

    works: WorkType[] = null;

    constructor(
      private navController: NavController,
      public toastController: ToastController,
      private workTypeService: WorkTypeService){
      
    }

    ngOnInit(){
      this.workTypeService.getWorkTypes()
          .then(works => this.works = works)
          .catch(err =>{
            console.log("Error al cargar los datos, intentando de nuevo")
          })
    }

    goToNextStep(){
      var toast = this.toastController.create({
        message: 'Actualmente esta funcionalidad no está disponible',
        duration: 1000
      })
      toast.present()
    }
    
}
