import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, IonicPage } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Camera } from '@ionic-native/camera';

import { SchedulePage } from '../schedule/schedule';

import { Work } from '../../models/work'
import { WorkService } from '../../providers/work-service';

@IonicPage()
@Component({
  selector: 'page-work-description',
  templateUrl: 'work-description.html'
})
export class WorkDescriptionPage {

  work: Work;
  images: { src: string, 
            isUploading: boolean, 
            idServer: number,
            id: number }[];
  currId: number;
  description: AbstractControl;
  currentMarker: any;

  form: FormGroup;
  submitAttempt: boolean;
  textButtonTop: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              private formBuilder: FormBuilder,
              private workService: WorkService,
              private camera: Camera)
  {
    this.work = navParams.get('work');
    console.log(this.work);
    this.form = this.formBuilder.group({
      description:   ['', Validators.compose([Validators.required])],
    });
    this.description = this.form.controls['description'];
    this.textButtonTop = 'Siguiente';
    if(this.work.description && this.work.description != '') {
      this.textButtonTop = 'Editar descripción';
      this.description.setValue(this.work.description);
    }
    this.images = [];
    this.currId = 0;
    if(this.work.images) {
      for(let i = 0; i < this.work.images.length; i++) {
        this.images.push({
          src: this.work.imagesUrl[i], 
          isUploading: false, 
          idServer: this.work.images[i],
          id: this.currId++
        });
      }
    }
    
  }

  ionViewDidLoad() {
    
  }

  takePicture(type: string) {
    let imageId = this.currId++;
    this.sleep(700).then(() => {
      this.images.push({ src: '', isUploading: true, idServer: -1, id: imageId});
    });

    let options = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.CAMERA,
        encodingType: this.camera.EncodingType.PNG,
        targetWidth: 1000,
        targetHeight: 1000,
        correctOrientation: true,
        // allowEdit: true
      };

    if(type == 'gallery') {
      options.sourceType = this.camera.PictureSourceType.SAVEDPHOTOALBUM;
      options.correctOrientation = false;
    }

    this.camera.getPicture(options).then(
      (base64Img) => {
        console.log('voy a llamar');
        console.log(this.images.length);
        this.workService.sendImage(base64Img).subscribe(
          (data) => {
            console.log(data);
            console.log('voy a guardar en ' + imageId + ' type: ' + type);
            for(let image of this.images) {
              if(image.id == imageId) {
                image.src = `data:image/png;base64,${base64Img}`;
                image.idServer = data.id;
                image.isUploading = false;
                break;
              }
            }
          },
          (error) => {
            this.deleteImageNoConfirm(imageId);
            let alert = this.alertCtrl.create({
              title: 'Error',
              buttons: [ { text: 'Aceptar' } ],
              message: 'Error al subir la imagen, por favor intenta más tarde'
            });
            alert.present();
            console.log(error);
          }
        )
      }, (err) => {
        this.deleteImageNoConfirm(imageId);
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

  nextStep() {
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
      this.work.description = this.description.value;
      this.work.images = this.images.map(image => image.idServer);
      if(!this.work.id) {
        //not created in server yet
        this.navCtrl.push(SchedulePage, {
          work: this.work
        });
      } else {
        //adding details
        this.workService.addDetailsWork(this.work).subscribe(
          (work) => {
            this.work = work;
            let toast = this.toastCtrl.create({
              message: 'Los datalles del trabajo se actualizaron exitosamente.',
              duration: 3000,
              showCloseButton: true,
              closeButtonText: 'Cerrar'
            });
            toast.present();
            this.navCtrl.setRoot('WorkDetailsPage', {
              work: this.work
            });
          },
          (error) => {
            let toast = this.toastCtrl.create({
              message: 'Error. Por favor intentar mas tarde',
              duration: 3000,
              showCloseButton: true,
              closeButtonText: 'Cerrar'
            });
            toast.present();
          }
        )
      }
    }
  }

  sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}
