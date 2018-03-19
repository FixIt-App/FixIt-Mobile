import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FormatDayOfWeekPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'formatDayOfWeek',
})
export class FormatDayOfWeekPipe implements PipeTransform {
  /**
   * Gets the name of the day of the week from a js Date
   */
  transform(date: Date) {
      var dayName = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      return dayName[date.getDay()];
  }
}
