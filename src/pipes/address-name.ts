import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the AddressName pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */

@Pipe({
  name: 'addressName',
})
export class AddressName implements PipeTransform {
  
  /**
   * Formats address name, to not to be longer than 10
   * characters
   */
  transform(name: string) {
    return name.length > 10 ? name.substring(0,7) + "..." : name;
  }
}
