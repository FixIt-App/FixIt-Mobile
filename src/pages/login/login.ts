import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { FindWorkPage } from '../findwork/findwork'
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class Login {

    username: string;
    password: string;

    constructor(private navController: NavController,
        private authService: AuthService, public alertCtrl: AlertController){
    }

    login(){
        this.authService.login(this.username, this.password)
            .then(token =>{
                localStorage.setItem('token', token.token)
                this.navController.setRoot(FindWorkPage)
            }).catch(err => {
                var alert = this.alertCtrl.create({
                    title: 'Error al inicar sesión',
                    subTitle: 'Las credenciales ingresadas no son correctas!',
                    buttons: ['OK']
                });
                alert.present();
            })
    }

    signUp(){
        this.navController.setRoot(FindWorkPage)
    }
}

