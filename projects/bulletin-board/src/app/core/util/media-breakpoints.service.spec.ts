import { TestBed } from '@angular/core/testing';

import { MediaBreakpointsService } from './media-breakpoints.service';

describe('MediaBreakpointsService', () => {
  let service: MediaBreakpointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaBreakpointsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
