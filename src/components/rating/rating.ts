import { Component, Output, EventEmitter, NgZone } from '@angular/core';

@Component({
  selector: 'rating',
  templateUrl: 'rating.html'
})
export class RatingComponent {

  starsNumber: number = 0;
  iconName: string[];
  @Output()
  starsChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(private ngZone: NgZone) {
    this.iconName = [];
    for (let i = 0; i < 5; i++) {
      this.iconName.push("star-outline");
    }
  }

  rangeChanged() {
    for (let i = 0; i < 5; i++) {
      this.ngZone.run(() => this.iconName[i] = this.starsNumber > i ? "star" : "star-outline");
    }
    this.starsChange.emit(this.starsNumber);
  }

}
