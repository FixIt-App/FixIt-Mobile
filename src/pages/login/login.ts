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
            .subscribe(
            token => {
                localStorage.setItem('token', token.token)
                this.navController.setRoot(FindWorkPage)
            },
            err => {
                let msg = "error";
                if (err.status == 500) {
                    msg = "error de conexión, porfavor intenta mas tarde";
                } else if (err.status == 400) {
                    msg = "Las credenciales ingresadas no son correctas!";
                }
                var alert = this.alertCtrl.create({
                    title: 'Error al inicar sesión',
                    subTitle: msg,
                    buttons: ['OK']
                });
                alert.present();
            })
    }

    signUp(){
        this.navController.setRoot(FindWorkPage)
    }
}

