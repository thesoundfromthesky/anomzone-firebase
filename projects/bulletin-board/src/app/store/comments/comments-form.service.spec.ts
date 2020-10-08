import { TestBed } from '@angular/core/testing';

import { CommentsFormService } from './comments-form.service';

describe('CommentsFormService', () => {
  let service: CommentsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentsFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
