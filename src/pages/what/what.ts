import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Camera } from 'ionic-native';

import { WorkService } from '../../providers/work-service';

@Component({
  selector: 'page-what',
  templateUrl: 'what.html'
})
export class WhatPage {

  images: { src: string, 
            isUploading: boolean, 
            idServer: number,
            id: number }[];
  currId: number;
  textExplanation: AbstractControl;
  currentMarker: any;

  form: FormGroup;
  submitAttempt: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              private formBuilder: FormBuilder,
              private workService: WorkService) 
  {
    this.images = [];
    this.currId = 0;
    this.form = this.formBuilder.group({
      textExplanation:   ['', Validators.compose([Validators.required])],
    });
    this.textExplanation = this.form.controls['textExplanation'];
  }

  ionViewDidLoad() {
    
  }

  takePicture(type: string) {
    // console.log('entre a al camar');
    let options = {
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.PNG,
        targetWidth: 1000,
        targetHeight: 1000,
        correctOrientation: true,
        // allowEdit: true
      };

    if(type == 'gallery') {
      options.sourceType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
      options.correctOrientation = false;
    }

    let id = this.currId++;
    this.sleep(700).then(() => {
      this.images.push({ src: '', isUploading: true, idServer: -1, id: id});
    })

    Camera.getPicture(options).then(
      (imageURI) => {
        console.log('voy a llamar');
        console.log(this.images.length);
        this.workService.sendImage(imageURI).subscribe(
          (data) => {
            console.log(data.id);
            for(let image of this.images) {
              if(image.id == id) {
                this.images[this.images.length-1].src = `data:image/png;base64,${imageURI}`;
                this.images[this.images.length-1].idServer = data.id;
                this.images[this.images.length-1].isUploading = false;
                break;
              }
            }
          },
          (error) => {
            this.deleteImageNoConfirm(id);
            //TODO what to do on error
            console.log(error);
          }
        )
      }, (err) => {
        this.deleteImageNoConfirm(id);
        console.log('error: ' + err);
      });
    }

    deleteImageNoConfirm(id: number) {
      for(let i = 0; i < this.images.length; i++) {
        if(this.images[i].id == id) {
          this.images.splice(i, 1);
          break;
        }
      }
    }

    deleteImage(id: number) {
    let confirm = this.alertCtrl.create({
        title: '¿Eliminar imagen?',
        buttons: [
          {
            text: 'Cancelar'
          },
          {
            text: 'Aceptar',
            handler: () => {
              this.deleteImageNoConfirm(id);
            }
          }
        ]
      });
      confirm.present();
  }

  finalize() {
    this.submitAttempt = true;
    if(!this.form.valid) return;
    if(this.images.filter( image => image.isUploading == true).length > 0) {
      let toast = this.toastCtrl.create({
        message: 'Por favor esperar a que cargen todas la imágens',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: 'Cerrar'
      });
      toast.present();
    } else {
      
    }
  }

  sleep (time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    }
}
