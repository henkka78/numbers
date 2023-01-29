import { SwapModel } from './../../models/swap-model';
import { SlideModel } from './../../models/slide-model';
import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  public slides: Array<SlideModel> = [];
  public swapping: boolean = false;
  constructor(private changeDetector: ChangeDetectorRef, private zone: NgZone) { }

  ngOnInit(): void {
    this.createSlides();
  }

  private createSlides(): void {
    for (let i = 0; i < 15; i++) {
      this.slides.push({ index: i, content: i + 1, status: true });
    }
    this.slides = this.shuffle(this.slides);
    this.slides.push({ index: this.slides.length, content: null, status: false });
  }

  private shuffle(slides: Array<SlideModel>): Array<SlideModel> {
    for (let i = slides.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [slides[i], slides[j]] = [slides[j], slides[i]];
    }
    slides.forEach((item, index) => item.index = index);
    return slides;
  }

  public swap(swapModel: SwapModel): void {
    this.swapping = true;
    this.slides[swapModel.movedIndex] = this.slides.splice(swapModel.emptyIndex, 1, this.slides[swapModel.movedIndex])[0];
    this.slides.forEach((item, index) => item.index = index);
    this.slides = [...this.slides];
    interval(1).pipe(tap(() => this.swapping = false), take(1)).subscribe();

    if (this.checkOrder()) {
      alert("Kaikki oikein!");
    }
  }

  public trackByFn(index: number) {
    return index;
  }

  private checkOrder(): boolean {
    return this.slides.every(item => {
      return (item.content ?? 0) - item.index === 1 || (item.index === 15 && !item.status);
    })
  }

}
