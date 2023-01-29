import { SwapModel } from './../../models/swap-model';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ChangeDetectorRef } from '@angular/core';
import { fromEvent, interval, Subject } from 'rxjs';
import { bufferCount, filter, first, switchMap, take, takeUntil, takeWhile, tap, throttleTime } from 'rxjs/operators'
import { SlideModel } from 'src/app/models/slide-model';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss']
})
export class SlideComponent implements OnInit, AfterViewInit {
  @Input() set slide(value: SlideModel) {
    this._slide = value;
  }
  @Input() set slides(value: Array<SlideModel>) {
    this._slides = value;
    this.setPosition();
  }

  public _slide!: SlideModel;
  private _slides!: Array<SlideModel>;
  @Output() swap: EventEmitter<SwapModel> = new EventEmitter();
  @ViewChild('root') root!: ElementRef;
  public left!: number;
  public top!: number;
  private emptyIndex!: number;
  private directionAxis!: string;
  private direction!: number;

  constructor() { }

  ngOnInit(): void {
    this.setPosition();
  }

  private setPosition(): void {
    this.left = 100 * (this._slide.index) - (Math.floor((this._slide.index) / 4) * 400);
    this.top = 100 * Math.floor((this._slide.index) / 4);
  }

  ngAfterViewInit(): void {
    if (this._slide.status) {
      this.move();
    }
  }

  private move(): void {
    fromEvent(this.root.nativeElement, 'click')
      .pipe(
        filter(() => this.isMovable),
        throttleTime(500),
        tap(() => {
          if (this.isMovableRight) {
            this.directionAxis = 'x';
            this.direction = 2;
            this.emptyIndex = this._slide.index + 1;
          }
          if (this.isMovableDown) {
            this.directionAxis = 'y';
            this.direction = 2;
            this.emptyIndex = this._slide.index + 4;
          }
          if (this.isMovableLeft) {
            this.directionAxis = 'x';
            this.direction = -2;
            this.emptyIndex = this._slide.index - 1;
          }
          if (this.isMovableUp) {
            this.directionAxis = 'y';
            this.direction = -2;
            this.emptyIndex = this._slide.index - 4;
          }
        }),
        switchMap(() => interval(1)),
        tap(() => {
          switch (this.directionAxis) {
            case 'x':
              this.left += this.direction;
              break;
            case 'y':
              this.top += this.direction;
              break;
          }
        }),
        bufferCount(50),
        tap(() => this.moveEnd()),
        first()
      ).subscribe();
  }

  private moveEnd(): void {
    this.swap.emit({ emptyIndex: this.emptyIndex, movedIndex: this._slide.index });
    this.move();
  }

  get isMovable(): boolean {
    return this.isMovableDown || this.isMovableUp || this.isMovableLeft || this.isMovableRight;
  }

  get isMovableRight(): boolean {
    const currentIndex = this._slide.index;
    return this.left < 300 && !this._slides[currentIndex + 1]?.status
  }

  get isMovableLeft(): boolean {
    const currentIndex = this._slide.index;
    return this.left > 0 && !this._slides[currentIndex - 1]?.status;
  }

  get isMovableUp(): boolean {
    const currentIndex = this._slide.index;
    return this.top > 0 && !this._slides[currentIndex - 4]?.status;
  }

  get isMovableDown(): boolean {
    const currentIndex = this._slide.index;
    return this.top < 300 && !this._slides[currentIndex + 4]?.status;
  }

}
