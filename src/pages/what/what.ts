import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Camera } from 'ionic-native';

@Component({
  selector: 'page-what',
  templateUrl: 'what.html'
})
export class WhatPage {

  images: string[];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController) 
  {
    this.images = [];
  }

  ionViewDidLoad() {
    
  }

  takePicture(type: string) {
    // console.log('entre a al camar');
    let options = {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        targetWidth: 1000,
        targetHeight: 1000,
        correctOrientation: true,
        // allowEdit: true
      };

    if(type == 'gallery') {
      options.sourceType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
      options.correctOrientation = false;
    }

    Camera.getPicture(options).then(
      (imageURI) => {
        console.log(imageURI);
        this.images.push(imageURI);
      }, (err) => {
        console.log('error: ' + err);
      });
    }

    deleteImage(index: number) {
    let confirm = this.alertCtrl.create({
        title: '¿Eliminar imagen?',
        buttons: [
          {
            text: 'Cancelar'
          },
          {
            text: 'Aceptar',
            handler: () => {
              this.images.splice(index, 1);
            }
          }
        ]
      });
      confirm.present();
  }

  finalize() {
    
  }
}
