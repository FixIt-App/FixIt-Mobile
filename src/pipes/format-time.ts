import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime',
})
export class FormatTimePipe implements PipeTransform {
  /**
   * Format the hour from a date.
   */
  transform(date: Date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    let _minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + _minutes + ' ' + ampm;
    return strTime;
  }
}
