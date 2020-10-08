import { TestBed } from '@angular/core/testing';

import { CommentsFacadeService } from './comments-facade.service';

describe('CommentsFacadeService', () => {
  let service: CommentsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
