import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'rating',
  templateUrl: 'rating.html'
})
export class RatingComponent {

  starsNumber: number = 0;
  @Output()
  starsChange: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
  }

  iconName (curr: number) {
    return this.starsNumber >= curr ? "star" : "star-outline";
  }

  rangeChanged() {
    this.starsChange.emit(this.starsNumber);
  }

}
