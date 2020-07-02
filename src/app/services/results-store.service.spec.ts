import { TestBed } from '@angular/core/testing';

import { ResultsStoreService } from './results-store.service';

describe('ResultsStoreService', () => {
  let service: ResultsStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultsStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
