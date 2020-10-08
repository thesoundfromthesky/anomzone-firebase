import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private delaySubject$!: Subject<number>;
  delay$!: Observable<number>;

  countdown!: number;

  constructor() {
    this.init();
  }

  init() {
    this.delaySubject$ = new BehaviorSubject<number>(0);
    this.delay$ = this.delaySubject$.asObservable();
    this.countdown = 5;
  }

  run(cb: () => void) {
    cb();
    timer(0, 1000).pipe(
      map((index) => index + 1),
      tap((index) => {
        this.delaySubject$.next(this.countdown - index);
      }),
      take(this.countdown)
    ).subscribe();
  }
}
