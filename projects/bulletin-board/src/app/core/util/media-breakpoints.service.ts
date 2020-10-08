import { Injectable } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { pluck } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediaBreakpointsService {
  private readonly breakpoints: { [key: string]: string } = {
    'p-sm': '(min-width: 576px)',
    'p-md': '(min-width: 768px)',
    'p-lg': '(min-width: 992px)',
    'p-xl': '(min-width: 1200px)',
  } as const;

  constructor(private readonly breakpointObserver: BreakpointObserver) {}

  observeBreakpoint(name: string): Observable<boolean> {
    return this.breakpointObserver
      .observe(this.breakpoints[name])
      .pipe(pluck('matches'));
  }
}
