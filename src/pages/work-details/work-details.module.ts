import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkDetailsPage } from './work-details';
import { FormatTimePipe } from '../../pipes/format-time';
import { FormatMonthPipe } from '../../pipes/format-month-pipe';
import { FormatDayOfWeekPipe } from '../../pipes/format-day-of-week-pipe';

@NgModule({
  declarations: [
    WorkDetailsPage,
    FormatTimePipe,
    FormatMonthPipe,
    FormatDayOfWeekPipe
  ],
  imports: [
    IonicPageModule.forChild(WorkDetailsPage),
  ],
  exports: [
    WorkDetailsPage
  ]
})
export class WorkDetailsModule {}
