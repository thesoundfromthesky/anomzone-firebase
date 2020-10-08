import { TestBed } from '@angular/core/testing';

import { CustomRouteReuseStategyService } from './custom-route-reuse-stategy.service';

describe('CustomRouteReuseStategyService', () => {
  let service: CustomRouteReuseStategyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomRouteReuseStategyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
