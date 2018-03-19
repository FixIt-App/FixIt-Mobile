import { NgModule } from '@angular/core';
import { CountryCodeSelectorPage } from './country-code-selector';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [ CountryCodeSelectorPage ],
  imports: [ IonicPageModule.forChild(CountryCodeSelectorPage) ],
})
export class NewAddressModule { }