import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmationPage } from './confirmation';
import { FormatTimePipe } from '../../pipes/format-time';
import { FormatMonthPipe } from '../../pipes/format-month-pipe';
import { FormatDayOfWeekPipe } from '../../pipes/format-day-of-week-pipe';

@NgModule({
  declarations: [
    ConfirmationPage,
    FormatTimePipe,
    FormatMonthPipe,
    FormatDayOfWeekPipe
  ],
  imports: [
    IonicPageModule.forChild(ConfirmationPage),
  ],
  exports: [
    ConfirmationPage
  ]
})
export class ConfirmationModule {}
