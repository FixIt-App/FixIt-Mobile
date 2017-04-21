import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

import { Work } from '../../models/work';
import { WorkType } from '../../models/worktype';


@IonicPage()
@Component({
  selector: 'page-work-details',
  templateUrl: 'work-details.html',
})
export class WorkDetailsPage {

  work: Work;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private barcodeScanner: BarcodeScanner) 
  {
    this.work = navParams.get('work');
    // for testing
    // this.work = new Work({
    //   images: [],
    //   state:"SCHEDULED",
    //   time: new Date("2017-05-01T02:41:00Z"),
    //   worker: 
    //   {
    //    document_id: "1020787426",
    //    email:"",
    //    first_name:"Alfredo",
    //    id:1,
    //    last_name:"Santamaria",
    //    phone:"3186017866",
    //    profile_pic:"https://test-fixit.s3.amazonaws.com/media/workers/pf2.png",
    //    rh:"0+",
    //    username:"alfredoWorker"
    //   },
    //   worktype: new WorkType({
    //     description:"Desde 33,000/hora",
    //     icon : "https://test-fixit.s3.amazonaws.com/media/electricista.jpg",
    //     id:4,
    //     name:"Cambiar bombillo",
    //     price:"200000.00",
    //     price_type:"STANDARIZED"
    //   }),
    // });
  }


  ionViewDidLoad() {
    
  }

  callWorker() {
    window.open("tel:" + this.work.worker.phone);
  }

  goToDescription() {
    this.navCtrl.push('WorkDescriptionPage', {
      work: this.work
    })
  }

  cancelWork() {
    // TODO
    console.log('TODO');
  }

  registerQR() {
    let options: BarcodeScannerOptions =  {
      preferFrontCamera : false, // iOS and Android
      showFlipCameraButton : true, // iOS and Android
      showTorchButton : true, // iOS and Android
      torchOn: false, // Android, launch with the torch switched on (if available)
      prompt : "Escanea el código del trabajador dentro del area", // Android
      resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
      formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
      orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
      disableAnimations : true, // iOS
      disableSuccessBeep: true // iOS
    };
    this.barcodeScanner.scan(options).then(
      (result) => {
          alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
      },
       (error) => {
          alert("Scanning failed: " + error);
      });
  }

}
