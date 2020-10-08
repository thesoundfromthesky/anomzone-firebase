import { TestBed } from '@angular/core/testing';

import { PostsFormService } from './posts-form.service';

describe('PostsFormService', () => {
  let service: PostsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostsFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
