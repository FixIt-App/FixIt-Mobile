import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FormatMonthPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'formatMonth',
})
export class FormatMonthPipe implements PipeTransform {
  /**
   * Gets the month name from a js date.
   */
  transform(date: Date) {
    var monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return monthNames[date.getMonth()];
  }
}
