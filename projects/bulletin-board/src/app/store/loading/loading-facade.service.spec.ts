import { TestBed } from '@angular/core/testing';

import { LoadingFacadeService } from './loading-facade.service';

describe('LoadingFacadeService', () => {
  let service: LoadingFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
