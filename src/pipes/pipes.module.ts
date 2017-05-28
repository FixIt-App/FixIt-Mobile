import { NgModule } from '@angular/core';
import { BreakLine } from './breakLine';
import { Hashtag } from './hashtag';
import { Translator } from './translator';

import { FormatTimePipe } from './format-time';
import { FormatMonthPipe } from './format-month-pipe';
import { FormatDayOfWeekPipe } from './format-day-of-week-pipe';

@NgModule({
  declarations: [
    FormatTimePipe,
    FormatMonthPipe,
    FormatDayOfWeekPipe
  ],
  imports: [

  ],
  exports: [
    FormatTimePipe,
    FormatMonthPipe,
    FormatDayOfWeekPipe
  ]
  ,
})
export class PipesModule {}