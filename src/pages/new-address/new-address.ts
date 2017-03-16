import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'page-new-address',
  templateUrl: 'new-address.html'
})
export class NewAddressPage {

  // trackTypes: any[] = [
  //   { name: 'Avenida', abbreviation: 'AV' },
  //   { name: 'Avenida Calle', abbreviation: 'AV CLL' },
  //   { name: 'Avenida Carrera', abbreviation: 'AV CR' },
  //   { name: 'Calle', abbreviation: 'CLL' },
  //   { name: 'Carrera', abbreviation: 'CR' },
  //   { name: 'Circular', abbreviation: 'CQ' },
  //   { name: 'Circunvalar', abbreviation: 'CV' },
  //   { name: 'Diagonal', abbreviation: 'DG' },
  //   { name: 'Manzana', abbreviation: 'MZ' },
  //   { name: 'Transversal', abbreviation: 'TR' },
  //   { name: 'Vía', abbreviation: 'VIA' }
  // ];

  trackTypes: string[] = [
    'Avenida',
    'Avenida Calle',
    'Avenida Carrera',
    'Calle',
    'Carrera',
    'Circular',
    'Circunvalar',
    'Diagonal',
    'Manzana',
    'Transversal',
    'Vía'
  ];

  trackType: AbstractControl;
  trackNumber: AbstractControl;
  genNumber: AbstractControl;
  placaNumber: AbstractControl;
  form: FormGroup;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private formBuilder: FormBuilder) 
  {
    
    this.form = this.formBuilder.group({
        trackType:   ['', Validators.compose([Validators.required])],
        trackNumber: ['', Validators.compose([Validators.required])],
        genNumber:   ['', Validators.compose([Validators.required])],
        placaNumber: ['', Validators.compose([Validators.required])],
      });
    this.form.patchValue({ 'trackType' : 'Calle'});
    this.trackType = this.form.controls['trackType'];
    this.trackNumber = this.form.controls['trackNumber'];
    this.genNumber = this.form.controls['genNumber'];
    this.placaNumber = this.form.controls['placaNumber'];
  }

  ionViewDidLoad() {

  }

  saveAddress() {
    if(this.form.valid) {
      console.log('es valido');
    } else {
      console.log('fuck');
    }
  }

}
