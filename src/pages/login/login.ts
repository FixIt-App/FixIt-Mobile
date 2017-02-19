import {Component} from '@angular/core';
import { NavController } from 'ionic-angular';
import { FindWorkPage } from '../findwork/findwork'

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class Login {

    constructor(private navController: NavController){
    }

    login(){
        this.navController.push(FindWorkPage)
    }
}

