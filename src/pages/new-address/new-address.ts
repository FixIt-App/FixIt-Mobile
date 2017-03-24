import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Geolocation, NativeGeocoder } from 'ionic-native';

declare var google;

@Component({
  selector: 'page-new-address',
  templateUrl: 'new-address.html'
})
export class NewAddressPage {

  // streetTypes: any[] = [
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

  streetAbb: any = {
    'Av' : 'Avenida',
    'Ac': 'Avenida Calle',
    'Ak': 'Avenida Carrera',
    'Cl': 'Calle',
    'Cra': 'Carrera',
    'Ai': 'Circunvalar',
    'Dg': 'Diagonal',
    'Tv': 'Transversal',
  }
  streetTypes: string[] = [
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

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('locationIcon') locationIcon: ElementRef;
  map: any;

  streetType: AbstractControl;
  streetNumber: AbstractControl;
  genNumber: AbstractControl;
  placaNumber: AbstractControl;

  // streetType: string;
  // streetNumber: string;
  // genNumber: string;
  // placaNumber: string;

  form: FormGroup;
  mapLoaded: boolean;
  geocoder: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              private viewCtrl: ViewController,
              private ngZone: NgZone)
  {
    
    this.form = this.formBuilder.group({
        streetType:   ['', Validators.compose([Validators.required])],
        streetNumber: ['', Validators.compose([Validators.required])],
        genNumber:   ['', Validators.compose([Validators.required])],
        placaNumber: ['', Validators.compose([Validators.required])],
      });
    this.form.patchValue({ 'streetType' : 'Calle'});
    this.streetType = this.form.controls['streetType'];
    this.streetNumber = this.form.controls['streetNumber'];
    this.genNumber = this.form.controls['genNumber'];
    this.placaNumber = this.form.controls['placaNumber'];

    // this.streetType = 'Calle';
    this.mapLoaded = false;
    this.geocoder = new google.maps.Geocoder();
    this.form.valueChanges
             .debounceTime(600)
             .distinctUntilChanged()
             .subscribe(() => this.getLocByAddres());
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    Geolocation.getCurrentPosition().then(
      (position) => {
 
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    
        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
    
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        // 'center_changed'
        
        this.map.addListener('dragend', () => {
          this.getCenterGeocode();
        });

        this.mapLoaded = true;
        this.setMarker();
        this.getCenterGeocode();
      }, 
      (err) => {
        console.log(err);
      });
  }

  setMarker() {
    var offsetT = this.mapElement.nativeElement.offsetTop;
    var offsetL = this.mapElement.nativeElement.offsetLeft;
    var divHeight = this.mapElement.nativeElement.offsetHeight / 2;
    var divWidth = this.mapElement.nativeElement.offsetWidth / 2;
    
    var iconHeight = this.locationIcon.nativeElement.offsetHeight;
    var iconWidth = this.locationIcon.nativeElement.offsetWidth;
  
    this.locationIcon.nativeElement.style.top = - (divHeight + (iconHeight)) + "px";
    this.locationIcon.nativeElement.style.left = (divWidth - (iconWidth/2)) +  "px";
  }
  
  getCenterGeocode() {
    let pos = this.map.getCenter();
    console.log(pos.lat);
    console.log(pos.lng);
    this.getGeocode(pos.lat(), pos.lng());
  
  }

  getLocByAddres() {
    let address: string = `${this.streetType.value} ${this.streetNumber.value} ${this.genNumber.value}-${this.placaNumber.value}, Bogotá, Colombia`;
    console.log(address);
    let geocoder = new google.maps.Geocoder();
     this.geocoder.geocode({address: address},
      (results, status) => {
        console.log(status);
        console.log(results);
        if (status == google.maps.GeocoderStatus.OK && results && results.length > 0) {
          console.log(results[0].geometry.location);
          this.map.setCenter(results[0].geometry.location);
        }
      }
     );
  }
  getGeocode(lat: number, lng: number) {
    if (navigator.geolocation) {
        let latlng = new google.maps.LatLng(lat, lng);
        let request = { latLng: latlng };
        this.geocoder.geocode(request,
          (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
              let result = results[0];
              console.log(result);
              let rsltAdrComponent = result.address_components;
              let resultLength = rsltAdrComponent.length;
              if (result != null) {
                let street: string[] = rsltAdrComponent[1].short_name.split(/[ \.]+/);
                let streetName: string = street[0];
                let streetNumber: string = street.slice(1,street.length).join(" ");
                let genNumbers: string[] = rsltAdrComponent[0].long_name.split('-');
                let formated: string = result.formatted_address;
                if(formated.indexOf('#') != -1) {
                  let genNumbers2: string = formated.split('#')[1].split(' ')[0];
                  console.log(genNumbers2);
                  genNumbers = genNumbers2.split(/[-,]+/);
                } else {
                  let genNumbers = ["", ""];
                }
                /**
                 * force anglar to rerender values
                 * this has to be done since map listener is not registered
                 */
                if(this.streetType.value != this.streetAbb[streetName])
                  this.ngZone.run(() => this.form.patchValue({ 'streetType' : this.streetAbb[streetName]}));
                if(this.streetNumber.value != streetNumber)
                  this.ngZone.run(() => this.form.patchValue({ 'streetNumber': streetNumber}));
                if(this.genNumber.value != genNumbers[0])
                  this.ngZone.run(() => this.form.patchValue({ 'genNumber': genNumbers[0]}));
                if(this.placaNumber.value != genNumbers[1])
                  this.ngZone.run(() => this.form.patchValue({ 'placaNumber': genNumbers[1]}));
              } else {
                alert("No address available!");
              }
            }
          });
    }
  }

  addInfoWindow(marker, content) {
 
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }
 


  saveAddress() {
    if(this.form.valid) {
      console.log('es valido');
    } else {
      console.log('fuck');
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
