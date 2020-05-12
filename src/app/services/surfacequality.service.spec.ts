import { TestBed } from '@angular/core/testing';

import { SurfacequalityService } from './surfacequality.service';

describe('SurfacequalityService', () => {
  let service: SurfacequalityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurfacequalityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
