import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from './../login/login';
import { AuthService } from "../../providers/auth-service";

@IonicPage()
@Component({
  selector: 'page-recover-password',
  templateUrl: 'recover-password.html',
})
export class RecoverPasswordPage {

  sent: boolean;
  email: string;
  emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public toastCtrl: ToastController,
              private authService: AuthService) {
    this.sent = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecoverPasswordPage');
  }

  send(){
    if(!this.isEmailValid()){
      this.showToast('Ingresa una dirección de correo válida.')
      return;
    }
    
    this.authService.resetPassword(this.email).subscribe(
      status => {
        if(status == 201) {
          this.showToast('Enviado');
          this.sent = true;
        } else {
          this.showToast('Intenta de nuevo más tarde.');
        }
      },
      error => {
        this.showToast('Intenta de nuevo más tarde.');
      }
    )
  }

  goHome(){
    this.navCtrl.setRoot(LoginPage);
  }

  showToast(text){
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }

  isEmailValid() {
    if(!this.email || this.email == '')
      return false;
    return this.emailRegExp.test(this.email);
  }
}
