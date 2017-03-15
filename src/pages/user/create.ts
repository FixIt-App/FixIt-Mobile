import { Component } from '@angular/core'
import { NavController, LoadingController, Loading } from 'ionic-angular'
import { AlertController } from 'ionic-angular'

import { UserDataService } from '../../providers/user-data-service'

@Component({
    selector: 'create-user',
    templateUrl: 'create.html'
})
export class CreateUserPage {

    username: string;
    password: string;
    name: string;
    city: string;

    constructor(private userService: UserDataService,
                public alertCtrl: AlertController,
                private navController: NavController){}

}
